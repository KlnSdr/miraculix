package miraculix.exams.service;

import dobby.util.json.NewJson;
import janus.Janus;
import miraculix.exams.Task;
import thot.connector.Connector;

import java.util.ArrayList;
import java.util.List;

public class TaskService {
    public static final String BUCKET_NAME = "miraculix_tasks";
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
}
