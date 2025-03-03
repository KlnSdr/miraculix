package miraculix;

import hades.Hades;
import miraculix.exams.Exam;
import miraculix.exams.Task;
import miraculix.exams.service.ExamService;

import java.util.UUID;

public class MiraculixApplication extends Hades {
    public static void main(String[] args) {
        new MiraculixApplication().startApplication(MiraculixApplication.class);
    }

    @Override
    public void postStart() {
        super.postStart();

        final Exam exam = new Exam("Hello World", UUID.fromString("fffdc44f-9868-48b7-abc2-91f285c5b97a"), UUID.fromString("e79ecb4b-dd46-4e0b-8943-8d500a6b4bc0"));

        final Task task1 = new Task("Task 1", 10);
        final Task task1a = new Task("Task 1a", 5);
        task1.addSubtask(task1a);
        final Task task2 = new Task("Task 2", 20);

        exam.addTask(task1);
        exam.addTask(task2);

        ExamService.getInstance().save(exam);

        final Exam exam2 = ExamService.getInstance().get(exam.getId().toString(), exam.getOwner());
        System.out.println(exam2);
    }
}