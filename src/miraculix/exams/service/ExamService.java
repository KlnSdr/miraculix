package miraculix.exams.service;

import dobby.util.json.NewJson;
import janus.Janus;
import miraculix.exams.Exam;
import miraculix.exams.Task;
import thot.connector.Connector;

import java.util.UUID;

public class ExamService {
    public static final String BUCKET_NAME = "miraculix_exams";
    private static ExamService instance;

    private ExamService() {
    }

    public static ExamService getInstance() {
        if (instance == null) {
            instance = new ExamService();
        }
        return instance;
    }

    public boolean save(Exam exam) {
        for (Task task : exam.getTasks()) {
            if (!TaskService.getInstance().save(task)) {
                return false;
            }
        }

        return Connector.write(BUCKET_NAME, exam.getKey(), exam.toStoreJson());
    }

    public Exam get(String id, UUID owner) {
        final Exam exam = Janus.parse(Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class), Exam.class);
        if (exam == null) {
            return null;
        }

        exam.setTasks(TaskService.getInstance().get(exam.getTaskIds()));

        return exam;
    }
}
