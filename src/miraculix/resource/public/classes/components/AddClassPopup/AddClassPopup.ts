class AddClassPopup implements Component {
  public static show() {
    new AddClassPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "Neue Klasse",
      new AddClass().instructions()
    ).instructions();
  }

  public unload() {}
}
