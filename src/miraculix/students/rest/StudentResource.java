package miraculix.students.rest;

import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;
import miraculix.students.Student;
import miraculix.students.service.StudentService;

import java.util.UUID;

public class StudentResource {
    private static final String BASE_PATH = "/rest/students";
    private static final StudentService studentService = StudentService.getInstance();

    @AuthorizedOnly
    @Post(BASE_PATH)
    public void createStudent(HttpContext context) {
        final NewJson body = context.getRequest().getBody();

        if (!validatePostRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson response = new NewJson();
            response.setString("error", "Invalid request body");
            context.getResponse().setBody(response);
            return;
        }

        final Student student = new Student(body.getString("name"), getOwner(context));
        if (!studentService.save(student)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save student");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + student.getKey());
        context.getResponse().setBody(student.toJson());
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}")
    public void getStudent(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        final Student student = studentService.find(id, getOwner(context));

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Student not found");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(student.toJson());
    }

    private boolean validatePostRequest(NewJson body) {
        return body.hasKey("name");
    }

    private UUID getOwner(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
