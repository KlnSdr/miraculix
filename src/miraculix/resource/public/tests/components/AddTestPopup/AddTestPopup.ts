class AddTestPopup implements Component {
  public static show() {
    new AddTestPopup().render(edom.body);
  }
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "Neuer Test",
      new AddTest().instructions()
    ).instructions();
  }

  public unload() {}
}
