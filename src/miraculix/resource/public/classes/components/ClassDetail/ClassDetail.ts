class ClassDetail implements Component {
  // @ts-ignore
  private readonly clazz: Class;

  // @ts-ignore
  constructor(clazz: Class) {
    this.clazz = clazz;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.loadStudents(), 100);
    return {
      tag: "div",
      id: "ClassDetail",
      children: [
        {
          tag: "p",
          text: "lade Daten...",
        },
      ],
    };
  }

  private loadStudents() {
    const container: edomElement = edom.findById("ClassDetail")!;

    // @ts-ignore
    StudentService.getStudentsOfClass(this.clazz)
      // @ts-ignore
      .then((students: Student[]) => {
        while (container.children.length > 0) {
          container.children[0].delete();
        }

        edom.fromTemplate(
          [
            // @ts-ignore
            new Button("", () => AddStudentPopup.show(this.clazz), [
              "fa",
              "fa-plus",
            ]).instructions(),
            // @ts-ignore
            new Button("", () => {}, [
              "fa",
              "fa-trash",
              "dangerButton",
            ]).instructions(),
            this.generateStudentTable(students),
          ],
          container
        );
      })
      .catch((e: any) => {
        alert(e);
      });

    edom.fromTemplate([], container);
  }

  // @ts-ignore
  private generateStudentTable(students: Student[]): edomTemplate {
    return {
      tag: "table",
      classes: ["studentTable"],
      children: [
        {
          tag: "tbody",
          // @ts-ignore
          children: students.map((s: Student) => this.studentLine(s)),
        },
      ],
    };
  }

  // @ts-ignore
  private studentLine(student: Student): edomTemplate {
    return {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: student.name,
        },
        {
          tag: "td",
          children: [
            // @ts-ignore
            new Button("", () => {}, ["fa", "fa-pencil"]).instructions(),
          ],
        },
        {
          tag: "td",
          children: [
            // @ts-ignore
            new Button("", () => {}, [
              "fa",
              "fa-trash",
              "dangerButton",
            ]).instructions(),
          ],
        },
      ],
    };
  }

  public unload() {}
}
