class ClassDetail implements Component {
  // @ts-ignore
  private clazz: Class;

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
            new Button("", () => AddStudentPopup.show(this.clazz, this), [
              "fa",
              "fa-plus",
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
            new Button("", () => this.editStudent(student.id, student.name), [
              "fa",
              "fa-pencil",
            ]).instructions(),
          ],
        },
        {
          tag: "td",
          children: [
            // @ts-ignore
            new Button(
              "",
              () => this.deleteStudent(this.clazz.id, student.id),
              ["fa", "fa-trash", "dangerButton"]
            ).instructions(),
          ],
        },
      ],
    };
  }

  private editStudent(studentId: string, studentName: string) {
    AddStudentPopup.show(this.clazz, this, studentId, studentName);
  }

  private deleteStudent(classId: string, studentId: string) {
    // @ts-ignore
    StudentService.delete(classId, studentId)
      .then(() => {
        this.clazz.students.splice(
          this.clazz.students.findIndex((s: string) => s === studentId),
          1
        );
        this.refresh();
      })
      .catch((e: any) => alert(e));
  }

  public refresh() {
    const container: edomElement = edom.findById("ClassDetail")!;
    while (container.children.length > 0) {
      container.children[0].delete();
    }
    this.refreshData();
  }

  private refreshData() {
    // @ts-ignore
    ClassService.getClassById(this.clazz.id)
      // @ts-ignore
      .then((clazz: Class) => {
        this.clazz = clazz;
        this.loadStudents();
      })
      .catch((e: any) => alert(e));
  }

  public unload() {}
}
