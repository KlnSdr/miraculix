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
      children: [
        new HeaderBar(this.examData.title).instructions(),
        {
          tag: "p",
          id: "outClazz",
          text: "Klasse: ...",
        },
        // @ts-ignore
        ...this.examData.tasks.map((task: Task) =>
          new TaskLine(task).instructions()
        ),
      ],
    };
  }

  public unload() {}
}
