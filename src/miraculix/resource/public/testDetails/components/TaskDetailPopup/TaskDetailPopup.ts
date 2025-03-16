class TaskDetailPopup implements Component {
  // @ts-ignore
  private readonly task: Task;

  // @ts-ignore
  public static show(task: Task) {
    new TaskDetailPopup(task).render(edom.body);
  }

  // @ts-ignore
  constructor(task: Task) {
    this.task = task;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      this.task.title,
      new TaskDetail(this.task).instructions()
    ).instructions();
  }

  public unload() {}
}
