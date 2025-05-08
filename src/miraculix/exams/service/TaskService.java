package miraculix.exams.service;

import dobby.util.json.NewJson;
import miraculix.exams.Task;
import miraculix.exams.TaskStudentPoints;
import thot.connector.Connector;
import thot.janus.Janus;

import java.util.*;

public class TaskService {
    public static final String BUCKET_NAME = "miraculix_tasks";
    public static final String STUDENT_POINTS_BUCKET_NAME = "miraculix_student_points";
    private static TaskService instance;

    private TaskService() {
    }

    public static TaskService getInstance() {
        if (instance == null) {
            instance = new TaskService();
        }
        return instance;
    }

    public boolean save(Task task) {
        for (Task subtask : task.getSubtasks()) {
            if (!save(subtask)) {
                return true;
            }
        }

        return Connector.write(BUCKET_NAME, task.getKey(), task.getEncrypted());
    }

    public Task get(String id) {
        return Janus.parse(Connector.read(BUCKET_NAME, id, NewJson.class), Task.class);
    }

    public List<Task> get(List<String> ids, UUID owner) {
        final String regex = "(" + String.join("|", ids) + ")";
        final NewJson[] jsons = Connector.readPattern(BUCKET_NAME, regex, NewJson.class);
        final List<Task> result = new ArrayList<>();
        final Task decryptTask = new Task();

        for (NewJson json : jsons) {
            final Task task = Janus.parse(decryptTask.decrypt(json, owner), Task.class);

            if (task != null) {
                task.setSubtasks(get(task.getSubtaskIds(), owner));
                result.add(task);
            }
        }

        return result;
    }

    public boolean saveStudentPoints(UUID owner, UUID studentId, UUID taskId, double points) {
        final TaskStudentPoints data = new TaskStudentPoints(owner, taskId, studentId, points);
        return Connector.write(STUDENT_POINTS_BUCKET_NAME, data.getKey(), data.getEncrypted());
    }

    public TaskStudentPoints getStudentPoints(UUID owner, UUID taskId, UUID studentId) {
        final NewJson json = Connector.read(STUDENT_POINTS_BUCKET_NAME, owner + "_" + taskId + "_" + studentId, NewJson.class);
        return Janus.parse(new TaskStudentPoints().decrypt(json, owner), TaskStudentPoints.class);
    }

    public double getPointsForTask(UUID owner, Task task, UUID studentId) {
        double points = 0.0;

        for (Task subtask : task.getSubtasks()) {
            final TaskStudentPoints data = getStudentPoints(owner, subtask.getId(), studentId);
            if (data != null) {
                points += data.getPoints();
            }
        }
        if (task.getSubtasks().isEmpty()) {
            final TaskStudentPoints data = getStudentPoints(owner, task.getId(), studentId);
            if (data != null) {
                points += data.getPoints();
            }
        }

        return points;
    }

    public boolean delete(UUID owner, Task task) {
        for (Task subtask : task.getSubtasks()) {
            if (!delete(owner, subtask)) {
                return false;
            }
        }

        return deleteStudentPoints(owner, task) && Connector.delete(BUCKET_NAME, task.getKey());
    }

    public boolean deleteStudentPoints(UUID owner, Task task) {
        final List<TaskStudentPoints> points = getPointsForTask(owner, task.getId());

        for (TaskStudentPoints point : points) {
            if (!Connector.delete(STUDENT_POINTS_BUCKET_NAME, point.getKey())) {
                return false;
            }
        }
        return true;
    }

    public List<TaskStudentPoints> getPointsForTask(UUID owner, UUID taskId) {
        final NewJson[] jsons = Connector.readPattern(STUDENT_POINTS_BUCKET_NAME, owner + "_" + taskId + "_.*", NewJson.class);
        final List<TaskStudentPoints> result = new ArrayList<>();
        final TaskStudentPoints decryptTask = new TaskStudentPoints();
        for (NewJson json : jsons) {
            final TaskStudentPoints points = Janus.parse(decryptTask.decrypt(json, owner), TaskStudentPoints.class);
            if (points != null) {
                result.add(points);
            }
        }
        return result;
    }

    public boolean deletePointsForStudent(UUID owner, UUID studentId) {
        final List<TaskStudentPoints> points = getPointsForStudent(owner, studentId);
        for (TaskStudentPoints point : points) {
            if (!Connector.delete(STUDENT_POINTS_BUCKET_NAME, point.getKey())) {
                return false;
            }
        }
        return true;
    }

    private List<TaskStudentPoints> getPointsForStudent(UUID owner, UUID studentId) {
        final NewJson[] jsons = Connector.readPattern(STUDENT_POINTS_BUCKET_NAME, owner + "_.*_" + studentId, NewJson.class);
        final List<TaskStudentPoints> result = new ArrayList<>();
        final TaskStudentPoints decryptTask = new TaskStudentPoints();
        for (NewJson json : jsons) {
            final TaskStudentPoints points = Janus.parse(decryptTask.decrypt(json, owner), TaskStudentPoints.class);
            if (points != null) {
                result.add(points);
            }
        }
        return result;
    }
}
