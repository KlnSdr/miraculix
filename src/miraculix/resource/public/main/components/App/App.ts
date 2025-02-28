class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["app"],
      children: [
        new Button("primary", () => {}).instructions(),
        new Button("secondary", () => {}, ["secondaryButton"]).instructions(),
        new Button("danger", () => {}, ["dangerButton"]).instructions()
      ]
    };
  }

  public unload() {}
}
