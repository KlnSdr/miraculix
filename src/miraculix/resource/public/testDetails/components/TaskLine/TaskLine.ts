class TaskLine implements Component {
  // @ts-ignore
  private readonly task: Task;

  // @ts-ignore
  constructor(task: Task) {
    this.task = task;
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
        new OpenTaskButton(this.task).instructions(),
        // @ts-ignore
        ...this.task.subtasks.map((t: Task) => new TaskLine(t).instructions()),
      ],
    };
  }

  public unload() {}
}
