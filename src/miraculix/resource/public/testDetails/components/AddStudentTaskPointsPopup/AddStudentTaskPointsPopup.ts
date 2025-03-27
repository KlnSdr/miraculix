class AddStudentTaskPointsPopup implements Component {
  // @ts-ignore
  private readonly task: Task;
  // @ts-ignore
  private readonly students: Student[];
  private readonly initialPoints: string;
  private readonly initialStudent: string;

  constructor(
    // @ts-ignore
    task: Task,
    // @ts-ignore
    students: Student[],
    initialPoints: string = "0.0",
    initialStudent: string = ""
  ) {
    this.students = students;
    this.task = task;
    this.initialPoints = initialPoints;
    this.initialStudent = initialStudent;
  }

  public static show(
    // @ts-ignore
    task: Task,
    // @ts-ignore
    students: Student[],
    initialPoints: string = "0.0",
    initialStudent: string = ""
  ) {
    new AddStudentTaskPointsPopup(
      task,
      students,
      initialPoints,
      initialStudent
    ).render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "",
      new AddStudentTaskPoints(
        this.task,
        this.students,
        this.initialPoints,
        this.initialStudent
      ).instructions()
    ).instructions();
  }

  public unload() {}
}
