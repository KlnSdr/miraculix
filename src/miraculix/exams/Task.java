package miraculix.exams;

import dobby.util.json.NewJson;
import hades.security.Encryptable;
import thot.janus.DataClass;
import thot.janus.annotations.JanusInteger;
import thot.janus.annotations.JanusList;
import thot.janus.annotations.JanusString;
import thot.janus.annotations.JanusUUID;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Task extends Encryptable implements DataClass {
    @JanusUUID("id")
    private UUID id;
    @JanusString("title")
    private String title;
    @JanusInteger("points")
    private int points;
    @JanusInteger("points_comma")
    private int pointsComma ;
    @JanusList("subtasks")
    private List<String> subtaskIds = new ArrayList<>();
    private List<Task> subtasks = new ArrayList<>();

    private UUID owner;

    public Task() {
        this.id = UUID.randomUUID();
    }

    public Task(String title, float points) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.points = (int) points;
        this.pointsComma = (int) ((points - this.points) * 100);
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public float getPoints() {
        return points + pointsComma / 100f;
    }

    public void setPoints(float points) {
        this.points = (int) points;
        this.pointsComma = (int) ((points - this.points) * 100);
    }

    public List<Task> getSubtasks() {
        return subtasks;
    }

    public void addSubtask(Task subtask) {
        subtasks.add(subtask);
        subtaskIds.add(subtask.getId().toString());
    }

    public void setSubtasks(List<Task> subtasks) {
        this.subtasks = subtasks;
        this.subtaskIds = subtasks.stream().map(Task::getId).map(UUID::toString).toList();
    }

    public List<String> getSubtaskIds() {
        return subtaskIds;
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    @Override
    public String getKey() {
        return id.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();

        json.setString("id", id.toString());
        json.setString("title", title);
        json.setFloat("points", getPoints());
        json.setList("subtasks", subtasks.stream().map(o -> (Object) o.toJson()).toList());

        return json;
    }

    @Override
    public NewJson getEncrypted() {
        setUuid(owner);
        final NewJson json = new NewJson();

        json.setString("id", id.toString());
        json.setString("title", encrypt(title));
        json.setString("points", encrypt(points));
        json.setString("points_comma", encrypt(pointsComma));
        json.setList("subtasks", subtaskIds.stream().map(o -> (Object) encrypt(o)).toList());

        return json;
    }

    @Override
    public NewJson decrypt(NewJson newJson, UUID uuid) {
        if (newJson == null) {
            return null;
        }

        setUuid(uuid);
        final NewJson json = new NewJson();

        json.setString("id", newJson.getString("id"));
        json.setString("title", decryptString(newJson.getString("title")));
        json.setInt("points", decryptInt(newJson.getString("points")));
        json.setInt("points_comma", decryptInt(newJson.getString("points_comma")));
        json.setList("subtasks", newJson.getList("subtasks").stream().map(o -> (Object) decryptString((String) o)).toList());

        return json;
    }
}
