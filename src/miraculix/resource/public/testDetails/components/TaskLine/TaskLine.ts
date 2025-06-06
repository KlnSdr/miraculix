class TaskLine implements Component {
  // @ts-ignore
  private readonly task: Task;
  private classId: string;

  // @ts-ignore
  constructor(classId: string, task: Task) {
    this.task = task;
    this.classId = classId;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["taskLine"],
      children: [
        {
          tag: "p",
          text: this.task.title,
        },
        new OpenTaskButton(this.classId, this.task).instructions(),
        new OpenTaskStatsButton(this.classId, this.task).instructions(),
        ...this.task.subtasks
          // @ts-ignore
          .sort((a: Task, b: Task) => {
            const numA: number = parseInt(a.title.replace(/[^0-9]/g, ""));
            const numB: number = parseInt(b.title.replace(/[^0-9]/g, ""));

            if (numA < numB) {
              return -1;
            } else if (numA == numB) {
              return a.title.localeCompare(b.title);
            }
            return 1;
          })
          // @ts-ignore
          .map((task: Task) => new TaskLine(this.classId, task).instructions()),
      ],
    };
  }

  public unload() {}
}
