class ExamStatsPopup implements Component {
  // @ts-ignore
  private readonly exam: Test;

  // @ts-ignore
  public static show(exam: Test) {
    new ExamStatsPopup(exam).render(edom.body);
  }

  // @ts-ignore
  constructor(exam: Test) {
    this.exam = exam;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      this.exam.title + " - Statistik",
      new ExamStats(this.exam).instructions()
    ).instructions();
  }

  public unload() {}
}
