package miraculix.students;

import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.JanusList;
import janus.annotations.JanusString;
import janus.annotations.JanusUUID;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Class implements DataClass {
    @JanusUUID("id")
    private UUID id;
    @JanusUUID("owner")
    private UUID owner;
    @JanusString("name")
    private String name;
    @JanusList("students")
    private List<String> students = new ArrayList<>();

    public Class() {
    }

    public Class(String name, UUID owner) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.owner = owner;
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwner() {
        return owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UUID> getStudents() {
        return students.stream().map(UUID::fromString).toList();
    }

    public void setStudents(List<UUID> students) {
        this.students = students.stream().map(UUID::toString).toList();
    }

    public void removeStudent(UUID studentId) {
        students.remove(studentId.toString());
    }

    public void addStudent(Student student) {
        students.add(student.getId().toString());
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
        json.setString("name", name);
        json.setList("students", students.stream().map(i -> (Object) i).toList());
        return json;
    }
}
