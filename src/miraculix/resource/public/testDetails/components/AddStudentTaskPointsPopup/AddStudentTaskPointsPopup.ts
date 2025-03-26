class AddStudentTaskPointsPopup implements Component {
  // @ts-ignore
  private readonly task: Task;
  // @ts-ignore
  private readonly students: Student[];

  // @ts-ignore
  constructor(task: Task, students: Student[]) {
    this.students = students;
    this.task = task;
  }

  // @ts-ignore
  public static show(task: Task, students: Student[]) {
    new AddStudentTaskPointsPopup(task, students).render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "",
      new AddStudentTaskPoints(this.task, this.students).instructions()
    ).instructions();
  }

  public unload() {}
}
