class AddStudentTaskPointsPopup implements Component {
  private readonly taskId: string;
  // @ts-ignore
  private readonly students: Student[];

  // @ts-ignore
  constructor(taskId: string, students: Student[]) {
    this.students = students;
    this.taskId = taskId;
  }

  // @ts-ignore
  public static show(taskId: string, students: Student[]) {
    new AddStudentTaskPointsPopup(taskId, students).render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "",
      new AddStudentTaskPoints(this.taskId, this.students).instructions()
    ).instructions();
  }

  public unload() {}
}
