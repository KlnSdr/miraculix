class TaskStatsPopup implements Component {
  // @ts-ignore
  private readonly task: Task;
  private readonly classId: string;

  // @ts-ignore
  public static show(classId: string, task: Task) {
    new TaskStatsPopup(classId, task).render(edom.body);
  }

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
    return new Popup(
      this.task.title + " - Statistik",
      new TaskStats(this.classId, this.task).instructions()
    ).instructions();
  }

  public unload() {}
}
