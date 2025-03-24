class OpenExamDetailsButton implements Component {
  // @ts-ignore
  private readonly exam: Test;
  private readonly classId: string;

  // @ts-ignore
  constructor(classId: string, exam: Test) {
    this.exam = exam;
    this.classId = classId;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Button(
      "",
      () => {
        // TaskDetailPopup.show(this.classId, this.exam);
      },
      ["fa", "fa-external-link", "statsButton"]
    ).instructions();
  }

  public unload() {}
}
