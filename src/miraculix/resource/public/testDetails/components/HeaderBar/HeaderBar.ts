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
        {
          tag: "div",
          classes: ["headerButtonBar"],
          children: [
            // @ts-ignore
            new Button("", (_) => AddTaskPopup.show(this.exam.id), [
              "fa",
              "fa-plus",
            ]).instructions(),
            new OpenExamDetailsButton(this.exam).instructions(),
            new OpenExamStatsButton(this.exam).instructions(),
            // @ts-ignore
            new Button("", (_: any) => this.openDeleteConfirm(), [
              "fa",
              "fa-trash",
              "dangerButton",
            ]).instructions(),
          ],
        },
      ],
    };
  }

  private openDeleteConfirm() {
    // @ts-ignore
    new Popup("Datenverlust!!!", {
      tag: "div",
      classes: ["deletePopup"],
      children: [
        {
          tag: "p",
          text: `Soll "${this.exam.title}" wirklich gelöscht werden?`,
          classes: ["deletePopupText"],
        },
        // @ts-ignore
        new Button("ja, löschen", (_: any) => this.doDelete(), [
          "dangerButton",
          "deletePopupDeleteButton",
        ]).instructions(),
        // @ts-ignore
        new Button("nein, behalten", (self: edomElement) => Popup.close(self), [
          "deletePopupCancelButton",
        ]).instructions(),
      ],
    }).render(edom.body);
  }

  private doDelete() {
    // @ts-ignore
    TestsService.delete(this.exam.id)
      .then(() => {
        location.assign("{{CONTEXT}}/tests");
      })
      .catch((e: any) => alert(e));
  }

  public unload() {}
}
