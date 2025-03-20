package miraculix.exams.rest;

import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import miraculix.exams.TaskStudentPoints;
import miraculix.exams.service.TaskService;

import java.util.UUID;

public class TaskResource {
    private static final String BASE_PATH = "/tasks";
    private static final TaskService service = TaskService.getInstance();

    @Post(BASE_PATH + "/id/{taskId}/student/id/{studentId}")
    public void addPointsForStudent(HttpContext context) {
        if (!context.getRequest().getBody().hasKey("points")) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson json = new NewJson();
            json.setString("error", "Points not provided");
            context.getResponse().setBody(json);
            return;
        }

        final String taskId = context.getRequest().getParam("taskId");
        final String studentId = context.getRequest().getParam("studentId");

        final UUID taskUUID;
        final UUID studentUUID;

        try {
            taskUUID = UUID.fromString(taskId);
            studentUUID = UUID.fromString(studentId);
        } catch (IllegalArgumentException e) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson json = new NewJson();
            json.setString("error", "Invalid task or student id");
            context.getResponse().setBody(json);
            return;
        }

        final TaskStudentPoints points = service.getStudentPoints(getOwner(context), taskUUID, studentUUID);

        if (points != null) {
            context.getResponse().setCode(ResponseCodes.CONFLICT);
            final NewJson json = new NewJson();
            json.setString("error", "Points already exist");
            context.getResponse().setBody(json);
            return;
        }

        final double pointsValue = context.getRequest().getBody().getFloat("points");

        if (service.saveStudentPoints(getOwner(context), studentUUID, taskUUID, pointsValue)) {
            context.getResponse().setCode(ResponseCodes.CREATED);
        } else {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson json = new NewJson();
            json.setString("error", "Failed to save points");
            context.getResponse().setBody(json);
        }
    }

    @Get(BASE_PATH + "/id/{taskId}/student/id/{studentId}")
    public void getPointsForStudent(HttpContext context) {
        final String taskId = context.getRequest().getParam("taskId");
        final String studentId = context.getRequest().getParam("studentId");

        final UUID taskUUID;
        final UUID studentUUID;

        try {
            taskUUID = UUID.fromString(taskId);
            studentUUID = UUID.fromString(studentId);
        } catch (IllegalArgumentException e) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson json = new NewJson();
            json.setString("error", "Invalid task or student id");
            context.getResponse().setBody(json);
            return;
        }

        final TaskStudentPoints points = service.getStudentPoints(getOwner(context), taskUUID, studentUUID);

        if (points == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson json = new NewJson();
            json.setString("error", "Points not found");
            context.getResponse().setBody(json);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(points.toJson());
    }

    private UUID getOwner(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
