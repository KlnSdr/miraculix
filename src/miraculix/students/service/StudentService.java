package miraculix.students.service;

import dobby.util.json.NewJson;
import janus.Janus;
import miraculix.students.Student;
import thot.connector.Connector;

import java.util.UUID;

public class StudentService {
    public static final String BUCKET_NAME = "miraculix_students";
    private static StudentService instance;

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
}
