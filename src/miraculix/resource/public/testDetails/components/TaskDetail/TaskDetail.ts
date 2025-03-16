class TaskDetail implements Component {
  // @ts-ignore
  private readonly task: Task;

  // @ts-ignore
  constructor(task: Task) {
    this.task = task;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["taskDetail"],
      children: [
        this.task.subtasks.length === 0
          ? // @ts-ignore
            new Button(
              "",
              (_self: edomElement) => {
                AddStudentTaskPointsPopup.show();
              },
              ["fa", "fa-plus"]
            ).instructions()
          : null,
        {
          tag: "table",
          classes: ["studentTable"],
          children: [
            {
              tag: "thead",
              children: this.generateTableHeader(),
            },
            {
              tag: "tbody",
              children: [],
            },
          ],
        },
      ].filter((e) => e != null),
    };
  }

  private generateTableHeader(): edomTemplate[] {
    return [
      {
        tag: "tr",
        children: [
          {
            tag: "th",
            text: "Name",
          },
          // @ts-ignore
          ...this.task.subtasks.map((t: Task) => {
            return {
              tag: "th",
              text: t.title.replace(this.task.title, "").trim(),
            };
          }),
          {
            tag: "th",
            text: "Punkte",
          },
        ],
      },
    ];
  }

  public unload() {}
}
