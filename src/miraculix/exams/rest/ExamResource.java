package miraculix.exams.rest;

import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;
import miraculix.exams.Exam;
import miraculix.exams.Task;
import miraculix.exams.service.ExamService;
import miraculix.exams.service.TaskService;
import miraculix.students.Class;
import miraculix.students.Student;
import miraculix.students.service.ClassService;
import miraculix.students.service.StudentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

public class ExamResource {
    private static final String BASE_PATH = "/rest/exams";
    private static final ExamService service = ExamService.getInstance();
    private static final ClassService classService = ClassService.getInstance();
    private static final TaskService taskService = TaskService.getInstance();
    private static final StudentService studentService = StudentService.getInstance();

    @AuthorizedOnly
    @Post(BASE_PATH)
    public void createExam(HttpContext context) {
        final NewJson body = context.getRequest().getBody();

        if (!validateCreateRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson response = new NewJson();
            response.setString("error", "Invalid request body");
            context.getResponse().setBody(response);
            return;
        }

        final Class clazz = classService.find(body.getString("class"), getOwner(context));

        if (clazz == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Class not found");
            context.getResponse().setBody(response);
            return;
        }

        final Exam exam = new Exam(body.getString("title"), getOwner(context), clazz.getId());

        if (!service.save(exam)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save exam");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + exam.getId());
        context.getResponse().setBody(exam.toJson());
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}")
    public void getExam(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        final Exam exam = service.get(id, getOwner(context));

        if (exam == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Exam not found");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(exam.toJson());
    }

    @AuthorizedOnly
    @Get(BASE_PATH)
    public void getExams(HttpContext context) {
        final Exam[] exams = service.getAll(getOwner(context));

        final NewJson response = new NewJson();
        response.setList("exams", Stream.of(exams).map(Exam::toJson).map(o -> (Object) o).toList());

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(response);
    }

    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{id}/tasks")
    public void addTaskToExam(HttpContext context) {
        final NewJson body = context.getRequest().getBody();
        final String id = context.getRequest().getParam("id");
        final Task task = TaskFromJson(body);

        if (task == null) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson response = new NewJson();
            response.setString("error", "Invalid request body");
            context.getResponse().setBody(response);
            return;
        }

        final Exam exam = service.get(id, getOwner(context));

        if (exam == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Exam not found");
            context.getResponse().setBody(response);
            return;
        }

        exam.addTask(task);

        if (!service.save(exam)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save exam");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(exam.toJson());
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}/results")
    public void getExamResults(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        final Exam exam = service.get(id, getOwner(context));

        if (exam == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Exam not found");
            context.getResponse().setBody(response);
            return;
        }

        final Class clazz = classService.find(exam.getClazz().toString(), getOwner(context));
        final Map<UUID, Double> results = new HashMap<>();

        for (UUID studentId : clazz.getStudents()) {
            double points = 0.0;

            for (Task task : exam.getTasks()) {
                final double taskPoints = taskService.getPointsForTask(exam.getOwner(), task, studentId);
                points += taskPoints;
            }

            results.put(studentId, points);
        }

        final NewJson response = new NewJson();
        final List<NewJson> resultsList = results.entrySet().stream()
                .map(e -> {
                    final NewJson result = new NewJson();

                    final Student student = studentService.find(e.getKey().toString(), getOwner(context));
                    if (student != null) {
                        result.setString("student", student.getName());
                    } else {
                        result.setString("student", e.getKey().toString());
                    }
                    result.setFloat("points", e.getValue().floatValue());
                    return result;
                })
                .toList();

        response.setList("results", resultsList.stream().map(o -> (Object) o).toList());

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(response);
    }

    private Task TaskFromJson(NewJson body) {
        final Task task = new Task();

        if (!body.hasKeys("title", "points", "subtasks")) {
            return null;
        }

        task.setTitle(body.getString("title"));
        task.setPoints(body.getFloat("points").floatValue());

        final List<Object> subtasks = body.getList("subtasks");

        for (Object o : subtasks) {
            if (!(o instanceof NewJson)) {
                return null;
            }

            final Task subtask = TaskFromJson((NewJson) o);

            if (subtask == null) {
                return null;
            }

            task.addSubtask(subtask);
        }

        return task;
    }

    private boolean validateCreateRequest(NewJson body) {
        return body.hasKeys("title", "class");
    }

    private UUID getOwner(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
