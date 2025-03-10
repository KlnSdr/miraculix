class AddTaskPopup implements Component {
  public static show() {
    new AddTaskPopup().render(edom.body);
  }
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "Neue Aufgabe",
      new AddTask().instructions()
    ).instructions();
  }

  public unload() {}
}
