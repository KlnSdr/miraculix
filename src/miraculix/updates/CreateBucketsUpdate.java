package miraculix.updates;

import hades.update.Update;
import miraculix.students.service.ClassService;
import miraculix.students.service.StudentService;
import thot.connector.Connector;

public class CreateBucketsUpdate implements Update {
    @Override
    public boolean run() {
        return
            Connector.write(ClassService.BUCKET_NAME, "TEST", "") &&
            Connector.delete(ClassService.BUCKET_NAME, "TEST") &&
            Connector.write(StudentService.BUCKET_NAME, "TEST", "") &&
            Connector.delete(StudentService.BUCKET_NAME, "TEST");
    }

    @Override
    public String getName() {
        return "miraculix_create_buckets";
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
