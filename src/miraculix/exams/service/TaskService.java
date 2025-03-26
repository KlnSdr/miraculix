package miraculix.exams.service;

import dobby.util.json.NewJson;
import janus.Janus;
import miraculix.exams.Task;
import miraculix.exams.TaskStudentPoints;
import thot.connector.Connector;

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

        return Connector.write(BUCKET_NAME, task.getKey(), task.toStoreJson());
    }

    public Task get(String id) {
        return Janus.parse(Connector.read(BUCKET_NAME, id, NewJson.class), Task.class);
    }

    public List<Task> get(List<String> ids) {
        final String regex = "(" + String.join("|", ids) + ")";
        final NewJson[] jsons = Connector.readPattern(BUCKET_NAME, regex, NewJson.class);
        final List<Task> result = new ArrayList<>();

        for (NewJson json : jsons) {
            final Task task = Janus.parse(json, Task.class);

            if (task != null) {
                task.setSubtasks(get(task.getSubtaskIds()));
                result.add(task);
            }
        }

        return result;
    }

    public boolean saveStudentPoints(UUID owner, UUID studentId, UUID taskId, double points) {
        final TaskStudentPoints data = new TaskStudentPoints(owner, taskId, studentId, points);
        return Connector.write(STUDENT_POINTS_BUCKET_NAME, data.getKey(), data.toStoreJson());
    }

    public TaskStudentPoints getStudentPoints(UUID owner, UUID taskId, UUID studentId) {
        final NewJson json = Connector.read(STUDENT_POINTS_BUCKET_NAME, owner + "_" + taskId + "_" + studentId, NewJson.class);
        return Janus.parse(json, TaskStudentPoints.class);
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
        for (NewJson json : jsons) {
            final TaskStudentPoints points = Janus.parse(json, TaskStudentPoints.class);
            if (points != null) {
                result.add(points);
            }
        }
        return result;
    }
}
