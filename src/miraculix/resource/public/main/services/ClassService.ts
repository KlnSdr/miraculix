interface Class {
  id: string;
  name: string;
  owner: string;
  students: string[];
}

class ClassService {
  private static classes: Class[] | null = null;

  public static getClasses(): Promise<Class[]> {
    return new Promise((resolve, reject) => {
      if (this.classes !== null) {
        resolve(this.classes);
        return;
      }

      fetch("{{CONTEXT}}/rest/classes")
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(({ classes }: { classes: Class[] }) => {
          this.classes = classes;
          this.sortClasses();
          resolve(this.classes);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  public static save(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      })
        .then((response: Response) => {
          if (response.status !== 201) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((clazz: Class) => {
          this.classes?.push(clazz);
          this.sortClasses();
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  public static addStudent(student: Student, clazz: Class): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/rest/classes/id/${clazz.id}/add-student/id/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  private static sortClasses() {
    this.classes! = this.classes!.sort((a, b) => a.name.localeCompare(b.name));
  }
}
