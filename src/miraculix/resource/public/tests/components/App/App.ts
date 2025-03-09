class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      id: "app",
      classes: ["app"],
      children: [
        // @ts-ignore
        new Navbar().instructions(),
        new TestsContainer().instructions(),
      ],
    };
  }

  public unload() {}
}
