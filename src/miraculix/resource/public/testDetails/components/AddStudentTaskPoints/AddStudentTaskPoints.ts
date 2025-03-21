class AddStudentTaskPoints implements Component {
  private points: number = 0.0;
  private student: string = "";

  private readonly taskId: string;
  // @ts-ignore
  private readonly students: Student[];

  // @ts-ignore
  constructor(taskId: string, students: Student[]) {
    this.students = students;
    this.taskId = taskId;
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
          ""
        ).instructions(),
        {
          tag: "label",
          text: "Punkte",
        },
        // @ts-ignore
        new Input((val: string) => {
          this.points = parseFloat(val.replace(",", "."));
        }, "0.0").instructions(),
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
    TaskService.addNewPoints(this.taskId, studentId, this.points)
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
