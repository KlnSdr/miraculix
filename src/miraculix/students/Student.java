package miraculix.students;

import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.JanusString;
import janus.annotations.JanusUUID;

import java.util.UUID;

public class Student implements DataClass {
    @JanusUUID("id")
    private UUID id;
    @JanusUUID("owner")
    private UUID owner;
    @JanusString("name")
    private String name;

    public Student() {
    }

    public Student(String name, UUID owner) {
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
        return json;
    }
}
