package miraculix.students.rest;

import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import miraculix.students.Class;
import miraculix.students.service.ClassService;

import java.util.Arrays;
import java.util.UUID;

public class ClassResource {
    private static final String BASE_PATH = "/rest/classes";
    private static final ClassService classService = ClassService.getInstance();

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

    @Get(BASE_PATH)
    public void getAllClasses(HttpContext context) {
        final Class[] classes = classService.findAll(getOwner(context));

        final NewJson response = new NewJson();
        response.setList("classes", Arrays.stream(classes).map(Class::toJson).map(o -> (Object) o).toList());

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(response);
    }

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

    private boolean validatePostRequest(NewJson body) {
        return body.hasKey("name");
    }

    private UUID getOwner(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
