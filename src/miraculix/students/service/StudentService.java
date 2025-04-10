package miraculix.students.service;

import dobby.util.json.NewJson;
import miraculix.exams.service.TaskService;
import miraculix.students.Student;
import thot.connector.Connector;
import thot.janus.Janus;

import java.util.UUID;

public class StudentService {
    public static final String BUCKET_NAME = "miraculix_students";
    private static StudentService instance;
    private static final TaskService taskService = TaskService.getInstance();

    private StudentService() {
    }

    public static StudentService getInstance() {
        if (instance == null) {
            instance = new StudentService();
        }
        return instance;
    }

    public boolean save(Student student) {
        return Connector.write(BUCKET_NAME, student.getKey(), student.toJson());
    }

    public Student find(String id, UUID owner) {
        return Janus.parse(Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class), Student.class);
    }

    public boolean delete(Student student) {
        if (student == null) {
            return false;
        }

        return taskService.deletePointsForStudent(student.getOwner(), student.getId()) && Connector.delete(BUCKET_NAME, student.getKey());
    }
}
