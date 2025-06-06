class AddStudentTaskPoints implements Component {
  private points: number = 0.0;
  private student: string = "";

  // @ts-ignore
  private readonly task: Task;
  // @ts-ignore
  private readonly students: Student[];

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

    this.points = parseFloat(initialPoints);
    this.student = initialStudent;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["addStudentTaskPoints"],
      id: "AddStudentTaskPointsPopup",
      children: [
        {
          tag: "label",
          text: "Schüler*in",
        },
        // @ts-ignore
        new Dropdown(
          (val: string) => {
            this.student = val;
          },
          // @ts-ignore
          this.students.map((s: Student) => s.name),
          this.student
        ).instructions(),
        {
          tag: "label",
          text: "Punkte (von " + this.task.points.toFixed(1) + ")",
        },
        // @ts-ignore
        new Input((val: string) => {
          this.points = parseFloat(val.replace(",", "."));
        }, this.points).instructions(),
        {
          tag: "label",
        },
        // @ts-ignore
        new Button("speichern", (_self: edomElement) =>
          this.savePoints()
        ).instructions(),
      ],
    };
  }

  private savePoints() {
    // @ts-ignore
    const selectedStudent: Student | undefined = this.students.find(
      // @ts-ignore
      (s: Student) => s.name === this.student
    );

    if (selectedStudent === undefined) {
      alert("Kein*e Schüler*in ausgewählt");
      return;
    }

    const studentId: string = selectedStudent.id;
    // @ts-ignore
    TaskService.setStudentPoints(this.task.id, studentId, this.points)
      .then(() => {
        this.resetPopup();
      })
      .catch((e: any) => alert(e));
  }

  private resetPopup() {
    const container: edomElement = edom.findById("AddStudentTaskPointsPopup")!
      .parent!;

    edom.findById("AddStudentTaskPointsPopup")!.delete();

    this.points = 0.0;
    this.student = "";

    edom.fromTemplate([this.instructions()], container);
  }

  public unload() {}
}
