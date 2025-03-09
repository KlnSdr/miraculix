interface Test {
  id: string;
  owner: string;
  title: string;
  clazz: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  points: number;
  subtasks: Task[];
}

class TestsService {
  public static getAll(): Promise<Test[]> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/exams")
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(({ exams }: { exams: Test[] }) => resolve(exams))
        .catch((e: any) => reject(e));
    });
  }

  public static save(title: string, clazz: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          class: clazz
        })
      })
      .then(_ => resolve())
      .catch((e: any) => reject(e));
    });
  }
}
