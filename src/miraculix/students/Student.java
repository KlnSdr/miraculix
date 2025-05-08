package miraculix.students;

import dobby.util.json.NewJson;
import hades.security.Encryptable;
import thot.janus.DataClass;
import thot.janus.annotations.JanusString;
import thot.janus.annotations.JanusUUID;

import java.util.UUID;

public class Student extends Encryptable implements DataClass {
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

    @Override
    public NewJson getEncrypted() {
        setUuid(owner);
        final NewJson json = new NewJson();
        json.setString("id", encrypt(id));
        json.setString("owner", encrypt(owner));
        json.setString("name", encrypt(name));
        return json;
    }

    @Override
    public NewJson decrypt(NewJson newJson, UUID ownerUUID) {
        if (newJson == null) {
            return null;
        }

        setUuid(ownerUUID);
        final NewJson json = new NewJson();
        json.setString("id", decryptString(newJson.getString("id")));
        json.setString("owner", decryptString(newJson.getString("owner")));
        json.setString("name", decryptString(newJson.getString("name")));
        return json;
    }
}
