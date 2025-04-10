package miraculix.exams;

import dobby.util.json.NewJson;
import thot.janus.DataClass;
import thot.janus.annotations.JanusInteger;
import thot.janus.annotations.JanusUUID;

import java.util.UUID;

public class TaskStudentPoints implements DataClass {
    @JanusUUID("studentId")
    private UUID studentId;
    @JanusUUID("taskId")
    private UUID taskId;
    @JanusUUID("owner")
    private UUID owner;
    @JanusInteger("points")
    private int points;
    @JanusInteger("pointsComma")
    private int pointsComma;

    public TaskStudentPoints() {
    }

    public TaskStudentPoints(UUID ownerId, UUID taskId, UUID studentId, double points) {
        this.studentId = studentId;
        this.taskId = taskId;
        this.owner = ownerId;
        this.points = (int) points;
        this.pointsComma = (int) ((points - this.points) * 100);
    }

    public UUID getStudentId() {
        return studentId;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getOwner() {
        return owner;
    }

    public double getPoints() {
        return points + pointsComma / 100f;
    }

    public void setPoints(float points) {
        this.points = (int) points;
        this.pointsComma = (int) ((points - this.points) * 100);
    }

    @Override
    public String getKey() {
        return owner + "_" + taskId + "_" + studentId;
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();
        json.setString("studentId", studentId.toString());
        json.setString("taskId", taskId.toString());
        json.setString("owner", owner.toString());
        json.setFloat("points", getPoints());
        return json;
    }

    public NewJson toStoreJson() {
        final NewJson json = new NewJson();
        json.setString("studentId", studentId.toString());
        json.setString("taskId", taskId.toString());
        json.setString("owner", owner.toString());
        json.setInt("points", points);
        json.setInt("pointsComma", pointsComma);
        return json;
    }
}
