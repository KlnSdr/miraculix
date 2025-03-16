class AddStudentTaskPointsPopup implements Component {
  public static show() {
    new AddStudentTaskPointsPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "",
      new AddStudentTaskPoints().instructions()
    ).instructions();
  }

  public unload() {}
}
