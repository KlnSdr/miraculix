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
          // @ts-ignore
          students.map((student: Student) => {
            // TODO better display later
            return {
              tag: "p",
              text: student.name,
            };
          }),
          container
        );
      })
      .catch((e: any) => {
        alert(e);
      });

    edom.fromTemplate(
      [
        // @ts-ignore
        new Button("", () => AddStudentPopup.show(this.clazz), [
          "fa",
          "fa-plus",
        ]).instructions(),
      ],
      container
    );
  }

  public unload() {}
}
