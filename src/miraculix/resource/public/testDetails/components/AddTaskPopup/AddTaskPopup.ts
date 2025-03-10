class AddTaskPopup implements Component {
  private readonly examId: string;

  constructor(examId: string) {
    this.examId = examId;
  }

  public static show(examId: string) {
    new AddTaskPopup(examId).render(edom.body);
  }
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "Neue Aufgabe",
      new AddTask(this.examId).instructions()
    ).instructions();
  }

  public unload() {}
}
