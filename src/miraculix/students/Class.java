package miraculix.students;

import dobby.util.json.NewJson;
import hades.security.Encryptable;
import thot.janus.DataClass;
import thot.janus.annotations.JanusList;
import thot.janus.annotations.JanusString;
import thot.janus.annotations.JanusUUID;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Class extends Encryptable implements DataClass {
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

    @Override
    public NewJson getEncrypted() {
        setUuid(owner);
        final NewJson json = new NewJson();
        json.setString("id", encrypt(id));
        json.setString("owner", encrypt(owner));
        json.setString("name", encrypt(name));
        json.setList("students", students.stream().map(i -> (Object) encrypt(i)).toList());
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
        json.setString("name", decryptString(newJson.getString("name")));
        json.setList("students", newJson.getList("students").stream().map(i -> (Object) decryptString((String) i)).toList());
        return json;
    }
}
