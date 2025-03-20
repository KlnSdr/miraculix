class OpenTaskButton implements Component {
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
    // @ts-ignore
    return new Button(
      "",
      () => {
        TaskDetailPopup.show(this.classId, this.task);
      },
      ["fa", "fa-external-link"]
    ).instructions();
  }

  public unload() {}
}
