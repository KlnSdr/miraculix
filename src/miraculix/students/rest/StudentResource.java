package miraculix.students.rest;

import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;
import hades.apidocs.annotations.ApiDoc;
import hades.apidocs.annotations.ApiResponse;
import miraculix.students.Student;
import miraculix.students.service.StudentService;

import java.util.UUID;

public class StudentResource {
    private static final String BASE_PATH = "/rest/students";
    private static final StudentService studentService = StudentService.getInstance();

    @ApiDoc(
            summary = "Create a new student",
            description = "Create a new student with the given name.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 201, message = "Student created successfully")
    @ApiResponse(code = 400, message = "Invalid request body")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 500, message = "Failed to save student")
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

    @ApiDoc(
            summary = "Get a student by ID",
            description = "Retrieve a student by their ID.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Student retrieved successfully")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Student not found")
    @ApiResponse(code = 500, message = "Failed to retrieve student")
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

    @ApiDoc(
            summary = "Update a student by ID",
            description = "Update a student's information by their ID.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Student updated successfully")
    @ApiResponse(code = 400, message = "Invalid request body")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Student not found")
    @ApiResponse(code = 500, message = "Failed to update student")
    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{id}")
    public void updateStudent(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        final NewJson body = context.getRequest().getBody();

        if (!validatePostRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson response = new NewJson();
            response.setString("error", "Invalid request body");
            context.getResponse().setBody(response);
            return;
        }

        final Student student = studentService.find(id, getOwner(context));

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Student not found");
            context.getResponse().setBody(response);
            return;
        }

        student.setName(body.getString("name"));
        if (!studentService.save(student)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to update student");
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
