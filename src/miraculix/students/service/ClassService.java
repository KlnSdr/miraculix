package miraculix.students.service;

import dobby.util.json.NewJson;
import miraculix.students.Class;
import thot.connector.Connector;
import thot.janus.Janus;

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
        return Connector.write(BUCKET_NAME, clazz.getKey(), clazz.getEncrypted());
    }

    public Class find(String id, UUID owner) {
        return Janus.parse(
                new Class().decrypt(
                    Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class),
                    owner
                ),
                Class.class
        );
    }

    public Class[] findAll(UUID owner) {
        final NewJson[] jsons = Connector.readPattern(BUCKET_NAME, owner.toString() + "_.*", NewJson.class);
        final ArrayList<Class> classes = new ArrayList<>();
        final Class clazz = new Class();

        for (NewJson json : jsons) {
            classes.add(Janus.parse(clazz.decrypt(json, owner), Class.class));
        }

        return classes.toArray(new Class[0]);
    }
}
