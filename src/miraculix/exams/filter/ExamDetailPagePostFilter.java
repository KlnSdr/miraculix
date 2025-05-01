package miraculix.exams.filter;

import dobby.Config;
import dobby.files.StaticFile;
import dobby.files.service.StaticFileService;
import dobby.filter.Filter;
import dobby.filter.FilterType;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.template.TemplateEngine;
import hades.user.service.UserService;
import miraculix.exams.Exam;
import miraculix.exams.service.ExamService;

import java.util.Base64;
import java.util.UUID;

public class ExamDetailPagePostFilter implements Filter {
    private static final ExamService examService = ExamService.getInstance();
    private static final StaticFileService staticFileService = StaticFileService.getInstance();

    @Override
    public String getName() {
        return "exam-detail-page-post-filter";
    }

    @Override
    public FilterType getType() {
        return FilterType.POST;
    }

    @Override
    public int getOrder() {
        return 0;
    }

    @Override
    public boolean run(HttpContext ctx) {
        if (ctx.getResponse().getCode() != ResponseCodes.NOT_FOUND) {
            return true;
        }

        final String path = ctx.getRequest().getPath().toLowerCase();

        if (!path.startsWith("/tests/id/")) {
            return true;
        }

        final String[] splitted = path.split("/");

        if (splitted.length < 4 || splitted.length > 5) {
            return true;
        }

        if (splitted.length == 5 && !(splitted[4].equals("index.html") || splitted[4].isEmpty())) {
            return true;
        }

        final String id = splitted[3];


        if (!UserService.getInstance().isLoggedIn(ctx.getSession())) {
            ctx.getResponse().setCode(ResponseCodes.FOUND);
            ctx.getResponse().setHeader("Location", Config.getInstance().getString("hades.context", "") + "/hades/login?src=" + Base64.getEncoder().encodeToString(path.getBytes()));
            return true;
        }
        final String userId = ctx.getSession().get("userId");

        final Exam exam = examService.get(id, UUID.fromString(userId));

        if (exam == null) {
            // todo send not found page
            return true;
        }

        final StaticFile file = staticFileService.get("/testDetails/index.html");

        if (file == null) {
            return true;
        }

        final NewJson data = new NewJson();
        data.setString("NAME", exam.getTitle());
        data.setString("DATA", exam.toJson().toString());

        final StaticFile renderedFile = TemplateEngine.render(file, data);

        ctx.getResponse().setCode(ResponseCodes.OK);
        ctx.getResponse().sendFile(renderedFile);

        return true;
    }
}
