class HeaderBar implements Component {
  private readonly examTitle: string;

  constructor(examTitle: string) {
    this.examTitle = examTitle;
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
          text: this.examTitle,
        },
        // @ts-ignore
        new Button("", (_) => AddTaskPopup.show(), [
          "fa",
          "fa-plus",
        ]).instructions(),
      ],
    };
  }

  public unload() {}
}
