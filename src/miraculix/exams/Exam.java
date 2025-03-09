package miraculix.exams;

import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.JanusList;
import janus.annotations.JanusString;
import janus.annotations.JanusUUID;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Exam implements DataClass {
    @JanusUUID("id")
    private UUID id;
    @JanusUUID("owner")
    private UUID owner;
    @JanusString("title")
    private String title;
    @JanusUUID("clazz")
    private UUID clazz;
    @JanusList("tasks")
    private List<String> taskIds = new ArrayList<>();
    private List<Task> tasks = new ArrayList<>();

    public Exam() {
    }

    public Exam(String title, UUID owner, UUID clazz) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.owner = owner;
        this.clazz = clazz;
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwner() {
        return owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UUID getClazz() {
        return clazz;
    }

    public void setClazz(UUID clazz) {
        this.clazz = clazz;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public List<String> getTaskIds() {
        return taskIds;
    }

    public void addTask(Task task) {
        tasks = new ArrayList<>(tasks);
        tasks.add(task);
        taskIds = tasks.stream().map(Task::getId).map(UUID::toString).toList();
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
        this.taskIds = tasks.stream().map(Task::getId).map(UUID::toString).toList();
    }

    @Override
    public String getKey() {
        return owner.toString() + "_" + id.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();

        json.setString("id", id.toString());
        json.setString("owner", owner.toString());
        json.setString("title", title);
        json.setString("clazz", clazz.toString());
        json.setList("tasks", tasks.stream().map(o -> (Object) o.toJson()).toList());

        return json;
    }

    public NewJson toStoreJson() {
        final NewJson json = new NewJson();

        json.setString("id", id.toString());
        json.setString("owner", owner.toString());
        json.setString("title", title);
        json.setString("clazz", clazz.toString());
        json.setList("tasks", taskIds.stream().map(o -> (Object) o).toList());

        return json;
    }
}
