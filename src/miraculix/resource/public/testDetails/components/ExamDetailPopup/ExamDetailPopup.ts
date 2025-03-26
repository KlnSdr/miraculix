class ExamDetailPopup implements Component {
  // @ts-ignore
  private readonly exam: Test;

  // @ts-ignore
  public static show(exam: Test) {
    new ExamDetailPopup(exam).render(edom.body);
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
      this.exam.title,
      new ExamDetail(this.exam).instructions()
    ).instructions();
  }

  public unload() {}
}
