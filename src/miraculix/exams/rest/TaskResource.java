package miraculix.exams.rest;

import dobby.annotations.Get;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;
import hades.apidocs.annotations.ApiDoc;
import hades.apidocs.annotations.ApiResponse;
import miraculix.exams.TaskStudentPoints;
import miraculix.exams.service.TaskService;

import java.util.UUID;

public class TaskResource {
    private static final String BASE_PATH = "/tasks";
    private static final TaskService service = TaskService.getInstance();

    @ApiDoc(
            summary = "Set points for a student in a task",
            description = "This endpoint allows you to set points for a student in a specific task. " +
                    "You need to provide the task ID, student ID, and the points value in the request body.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 201, message = "Points set successfully")
    @ApiResponse(code = 400, message = "Invalid task or student ID")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 500, message = "Failed to save points")
    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{taskId}/student/id/{studentId}")
    public void setPointsForStudent(HttpContext context) {
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

    @ApiDoc(
            summary = "Get points for a student in a task",
            description = "This endpoint allows you to get points for a student in a specific task. " +
                    "You need to provide the task ID and student ID in the URL.",
            baseUrl = BASE_PATH
    )
    @ApiResponse(code = 200, message = "Points retrieved successfully")
    @ApiResponse(code = 400, message = "Invalid task or student ID")
    @ApiResponse(code = 403, message = "Unauthorized")
    @ApiResponse(code = 404, message = "Points not found")
    @ApiResponse(code = 500, message = "Failed to retrieve points")
    @AuthorizedOnly
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
