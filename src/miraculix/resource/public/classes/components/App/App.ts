class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["app"],
      children: [
        // @ts-ignore
        new Navbar().instructions(),
        new ClassesContainer().instructions()
      ]
    };
  }

  public unload() {}
}
