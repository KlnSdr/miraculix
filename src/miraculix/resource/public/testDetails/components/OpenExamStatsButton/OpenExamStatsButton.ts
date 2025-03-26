class OpenExamStatsButton implements Component {
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
    // @ts-ignore
    return new Button("", () => ExamStatsPopup.show(this.exam), [
      "fa",
      "fa-pie-chart",
      "statsButton",
    ]).instructions();
  }

  public unload() {}
}
