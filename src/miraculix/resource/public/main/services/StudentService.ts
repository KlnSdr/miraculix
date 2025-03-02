interface Student {
  name: string;
  id: string;
}

class StudentService {
  public static create(name: string): Promise<Student> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/students", {
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
        .then((student: Student) => {
          resolve(student);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  public static getStudentsOfClass(clazz: Class): Promise<Student[]> {
    return Promise.all(
      clazz.students.map(async (id: string) => {
        return fetch(`{{CONTEXT}}/rest/students/id/${id}`).then(
          (response: Response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            return response.json();
          }
        );
      })
    );
  }
}
