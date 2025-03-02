package miraculix.students.service;

import dobby.util.json.NewJson;
import janus.Janus;
import miraculix.students.Class;
import thot.connector.Connector;

import java.util.ArrayList;
import java.util.UUID;

public class ClassService {
    public static final String BUCKET_NAME = "miraculix_classes";
    private static ClassService instance;

    private ClassService() {
    }

    public static ClassService getInstance() {
        if (instance == null) {
            instance = new ClassService();
        }
        return instance;
    }

    public boolean save(Class clazz) {
        return Connector.write(BUCKET_NAME, clazz.getKey(), clazz.toJson());
    }

    public Class find(String id, UUID owner) {
        return Janus.parse(Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class), Class.class);
    }

    public Class[] findAll(UUID owner) {
        final NewJson[] jsons = Connector.readPattern(BUCKET_NAME, owner.toString() + "_.*", NewJson.class);
        final ArrayList<Class> classes = new ArrayList<>();

        for (NewJson json : jsons) {
            classes.add(Janus.parse(json, Class.class));
        }

        return classes.toArray(new Class[0]);
    }
}
