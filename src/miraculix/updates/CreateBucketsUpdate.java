package miraculix.updates;

import hades.update.Update;
import miraculix.exams.service.ExamService;
import miraculix.exams.service.TaskService;
import miraculix.students.service.ClassService;
import miraculix.students.service.StudentService;
import thot.connector.Connector;

public class CreateBucketsUpdate implements Update {
    @Override
    public boolean run() {
        final String[] buckets = {ClassService.BUCKET_NAME, StudentService.BUCKET_NAME, ExamService.BUCKET_NAME, TaskService.BUCKET_NAME};

        for (String bucket: buckets) {
            if (!Connector.write(bucket, "TEST", "") || !Connector.delete(bucket, "TEST")) {
                return false;
            }
        }
        return true;
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
