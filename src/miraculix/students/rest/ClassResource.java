package miraculix.students.rest;

import dobby.annotations.Delete;
import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;
import hades.apidocs.annotations.ApiDoc;
import hades.apidocs.annotations.ApiResponse;
import miraculix.students.Class;
import miraculix.students.Student;
import miraculix.students.service.ClassService;
import miraculix.students.service.StudentService;

import java.util.Arrays;
import java.util.UUID;

public class ClassResource {
    private static final String BASE_PATH = "/rest/classes";
    private static final ClassService classService = ClassService.getInstance();
    private static final StudentService studentService = StudentService.getInstance();

    @ApiDoc(
            summary = "Create a new class",
            description = "Create a new class with the given name.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 201, message = "Class created successfully")
    @ApiResponse(code = 400, message = "Invalid request body")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 500, message = "Failed to save class")
    @AuthorizedOnly
    @Post(BASE_PATH)
    public void createClass(HttpContext context) {
        final NewJson body = context.getRequest().getBody();

        if (!validatePostRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson response = new NewJson();
            response.setString("error", "Invalid request body");
            context.getResponse().setBody(response);
            return;
        }

        final Class clazz = new Class(body.getString("name"), getOwner(context));
        if (!classService.save(clazz)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save class");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + clazz.getKey());
        context.getResponse().setBody(clazz.toJson());
    }

    @ApiDoc(
            summary = "Get all classes",
            description = "Retrieve all classes for the authenticated user.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Classes retrieved successfully")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 500, message = "Failed to retrieve classes")
    @AuthorizedOnly
    @Get(BASE_PATH)
    public void getAllClasses(HttpContext context) {
        final Class[] classes = classService.findAll(getOwner(context));

        final NewJson response = new NewJson();
        response.setList("classes", Arrays.stream(classes).map(Class::toJson).map(o -> (Object) o).toList());

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(response);
    }

    @ApiDoc(
            summary = "Get a class by ID",
            description = "Retrieve a class by its ID.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Class retrieved successfully")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Class not found")
    @ApiResponse(code = 500, message = "Failed to retrieve class")
    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}")
    public void getClass(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        final Class clazz = classService.find(id, getOwner(context));

        if (clazz == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Class not found");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(clazz.toJson());
    }

    @ApiDoc(
            summary = "Add a student to a class",
            description = "Add a student to a class by their ID.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Student added to class successfully")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Class or student not found")
    @ApiResponse(code = 500, message = "Failed to save class")
    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{classId}/add-student/id/{studentId}")
    public void addStudentToClass(HttpContext context) {
        final String classId = context.getRequest().getParam("classId");
        final String studentId = context.getRequest().getParam("studentId");

        final Class clazz = classService.find(classId, getOwner(context));
        if (clazz == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Class not found");
            context.getResponse().setBody(response);
            return;
        }

        final Student student = StudentService.getInstance().find(studentId, getOwner(context));
        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Student not found");
            context.getResponse().setBody(response);
            return;
        }

        clazz.addStudent(student);
        if (!classService.save(clazz)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save class");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(clazz.toJson());
    }

    @ApiDoc(
            summary = "Delete a student from a class",
            description = "Delete a student from a class by their ID.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 204, message = "Student deleted from class successfully")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Class or student not found")
    @ApiResponse(code = 500, message = "Failed to delete student")
    @AuthorizedOnly
    @Delete(BASE_PATH + "/id/{classId}/student/id/{studentId}")
    public void deleteStudent(HttpContext context) {
        final String studentId = context.getRequest().getParam("studentId");
        final String classId = context.getRequest().getParam("classId");

        final Student student = studentService.find(studentId, getOwner(context));

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Student not found");
            context.getResponse().setBody(response);
            return;
        }

        final Class clazz = classService.find(classId, getOwner(context));

        if (clazz == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson response = new NewJson();
            response.setString("error", "Class not found");
            context.getResponse().setBody(response);
            return;
        }

        clazz.removeStudent(student.getId());
        if (!classService.save(clazz)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to save class");
            context.getResponse().setBody(response);
            return;
        }

        if (!studentService.delete(student)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson response = new NewJson();
            response.setString("error", "Failed to delete student");
            context.getResponse().setBody(response);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }

    private boolean validatePostRequest(NewJson body) {
        return body.hasKey("name");
    }

    private UUID getOwner(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
