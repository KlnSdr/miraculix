package miraculix.exams.service;

import dobby.util.json.NewJson;
import miraculix.exams.Exam;
import miraculix.exams.Task;
import thot.connector.Connector;
import thot.janus.Janus;

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

        return Connector.write(BUCKET_NAME, exam.getKey(), exam.getEncrypted());
    }

    public Exam get(String id, UUID owner) {
        final Exam exam = Janus.parse(
                new Exam().decrypt(
                    Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class),
                    owner
                ),
            Exam.class
        );
        if (exam == null) {
            return null;
        }

        exam.setTasks(TaskService.getInstance().get(exam.getTaskIds(), owner));

        return exam;
    }

    public Exam[] getAll(UUID owner) {
        final NewJson[] jsons = Connector.readPattern(BUCKET_NAME, owner + "_.*", NewJson.class);
        final Exam[] exams = new Exam[jsons.length];
        final Exam ex = new Exam();

        for (int i = 0; i < jsons.length; i++) {
            final Exam exam = Janus.parse(ex.decrypt(jsons[i], owner), Exam.class);
            exam.setTasks(TaskService.getInstance().get(exam.getTaskIds(), owner));
            exams[i] = exam;
        }

        return exams;
    }

    public boolean delete(Exam exam) {
        for (Task task : exam.getTasks()) {
            if (!TaskService.getInstance().delete(exam.getOwner(), task)) {
                return false;
            }
        }
        return Connector.delete(BUCKET_NAME, exam.getKey());
    }
}
