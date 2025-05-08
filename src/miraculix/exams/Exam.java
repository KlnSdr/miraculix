package miraculix.exams;

import dobby.util.json.NewJson;
import hades.security.Encryptable;
import thot.janus.DataClass;
import thot.janus.annotations.JanusList;
import thot.janus.annotations.JanusString;
import thot.janus.annotations.JanusUUID;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Exam extends Encryptable implements DataClass {
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

    @Override
    public NewJson getEncrypted() {
        setUuid(owner);
        final NewJson json = new NewJson();

        json.setString("id", encrypt(id));
        json.setString("owner", encrypt(owner));
        json.setString("title", encrypt(title));
        json.setString("clazz", encrypt(clazz));
        json.setList("tasks", taskIds.stream().map(o -> (Object) encrypt(o)).toList());

        return json;
    }

    @Override
    public NewJson decrypt(NewJson newJson, UUID uuid) {
        if (newJson == null) {
            return null;
        }

        setUuid(uuid);
        final NewJson json = new NewJson();

        json.setString("id", decryptString(newJson.getString("id")));
        json.setString("owner", decryptString(newJson.getString("owner")));
        json.setString("title", decryptString(newJson.getString("title")));
        json.setString("clazz", decryptString(newJson.getString("clazz")));
        json.setList("tasks", newJson.getList("tasks").stream().map(o -> (Object) decryptString((String) o)).toList());

        return json;
    }
}
