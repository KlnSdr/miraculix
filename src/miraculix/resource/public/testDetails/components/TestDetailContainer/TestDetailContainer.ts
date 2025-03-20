class TestDetailContainer implements Component {
  // @ts-ignore
  private readonly examData: Test;

  // @ts-ignore
  constructor(examData: Test) {
    this.examData = examData;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      // @ts-ignore
      ClassService.getClasses()
        // @ts-ignore
        .then((cs: Class[]) => {
          edom.findById("outClazz")!.text = `Klasse: ${
            // @ts-ignore
            cs.find((c: Class) => c.id === this.examData.clazz).name
          }`;
        })
        .catch((e: any) => alert(e));
    }, 50);
    return {
      tag: "div",
      classes: ["testDetailContainer"],
      id: "TestDetailContainer",
      children: [
        new HeaderBar(this.examData.title, this.examData.id).instructions(),
        {
          tag: "p",
          id: "outClazz",
          text: "Klasse: ...",
        },
        ...this.examData.tasks
          // @ts-ignore
          .sort((a: Task, b: Task) => {
            const numA: number = parseInt(a.title.replace(/[^0-9]/g, ""));
            const numB: number = parseInt(b.title.replace(/[^0-9]/g, ""));

            if (numA < numB) {
              return -1;
            } else if (numA == numB) {
              return a.title.localeCompare(b.title);
            }
            return 1;
          })
          // @ts-ignore
          .map((task: Task) => new TaskLine(this.examData.clazz, task).instructions()),
      ],
    };
  }

  public unload() {}
}
