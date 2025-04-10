class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
        tag: "div",
        classes: ["app"],
        children: [
            new SignupPanel().instructions()
        ]
    };
  }

  public unload() {}
}
