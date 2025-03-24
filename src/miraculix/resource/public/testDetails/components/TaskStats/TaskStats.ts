class TaskStats implements Component {
  // @ts-ignore
  private readonly task: Task;
  private readonly classId: string;

  // @ts-ignore
  constructor(classId: string, task: Task) {
    this.task = task;
    this.classId = classId;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      this.loadData();
    }, 50);

    return {
      tag: "div",
      classes: ["taskDetail"],
      id: "TaskDetail",
      children: [
        {
          tag: "label",
          text: "lade Daten...",
        },
      ],
    };
  }

  private loadData() {
    // @ts-ignore
    ClassService.getClassById(this.classId)
      // @ts-ignore
      .then((clazz: Class) => StudentService.getStudentsOfClass(clazz))
      // @ts-ignore
      .then((students: Student[]) => {
        return Promise.all([
          // @ts-ignore
          ...this.task.subtasks.map((t: Task) => {
            return Promise.all(
              // @ts-ignore
              students.map((s: Student) =>
                // @ts-ignore
                TaskService.getPoints(t.id, s.id)
              )
            );
          }),
          Promise.all(
            // @ts-ignore
            students.map((s: Student) =>
              // @ts-ignore
              TaskService.getPoints(this.task.id, s.id)
            )
          ),
        ]);
      })
      .then((res: Array<number | null>[]) => {
        if (res.length > 1) {
          for (let i = 0; i < res[0].length; i++) {
            let sum: number = 0.0;

            for (let j = 0; j < res.length - 1; j++) {
              sum += res[j][i] ?? 0.0;
            }
            res[res.length - 1][i] = sum;
          }
        }
        this.renderWithDataNumbers(res);
      })
      .catch((e: any) => {
        alert(e);
      });
  }

  private renderWithDataNumbers(points: Array<number | null>[]) {
    const sums: number[] = points[points.length - 1].filter((v) => v !== null);
    const container: edomElement = edom.findById("TaskDetail")!;

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    const maxPoints: number = this.task.subtasks.reduce(
      // @ts-ignore
      (acc: number, val: Task) => acc + val.points,
      this.task.points
    );
    console.log(maxPoints);
    console.log(this.task);

    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 0.0; i <= maxPoints; i += 0.5) {
      labels.push(i.toFixed(1));
      values.push(sums.filter((v) => v === i).length);
    }

    edom.fromTemplate(
      [
        // @ts-ignore
        new Button("", (_) => this.renderWithDataPercent(points), [
          "fa",
          "fa-percent",
        ]).instructions(),
        new BarChart(labels, values).instructions(),
      ],
      container
    );
  }

  private renderWithDataPercent(points: Array<number | null>[]) {
    const sums: number[] = points[points.length - 1].filter((v) => v !== null);
    const container: edomElement = edom.findById("TaskDetail")!;

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    const maxPoints: number = this.task.subtasks.reduce(
      // @ts-ignore
      (acc: number, val: Task) => acc + val.points,
      this.task.points
    );
    console.log(maxPoints);
    console.log(this.task);

    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 0.0; i <= maxPoints; i += 0.5) {
      labels.push(i.toFixed(1));
      values.push((100 * sums.filter((v) => v === i).length) / sums.length);
    }

    edom.fromTemplate(
      [
        // @ts-ignore
        new Button("", (_) => this.renderWithDataNumbers(points), [
          "fa",
          "fa-hashtag",
        ]).instructions(),
        new BarChart(labels, values).instructions(),
      ],
      container
    );
  }

  public unload() {}
}
