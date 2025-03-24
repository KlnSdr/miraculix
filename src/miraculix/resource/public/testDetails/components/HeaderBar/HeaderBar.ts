class HeaderBar implements Component {
  // @ts-ignore
  private readonly exam: Test;

  // @ts-ignore
  constructor(exam: Test) {
    this.exam = exam;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["headerBar"],
      children: [
        {
          tag: "h1",
          children: [
            {
              tag: "a",
              text: "Tests",
              target: "{{CONTEXT}}/tests",
            },
          ],
        },
        {
          tag: "h1",
          text: "/",
        },
        {
          tag: "h1",
          text: this.exam.title,
        },
        // @ts-ignore
        new Button("", (_) => AddTaskPopup.show(this.exam.id), [
          "fa",
          "fa-plus",
        ]).instructions(),
        new OpenExamDetailsButton(this.exam.clazz, this.exam).instructions(),
        new OpenExamStatsButton(this.exam).instructions(),
      ],
    };
  }

  public unload() {}
}
