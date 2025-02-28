class Button implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "button",
      classes: ["button"],
      text: "Hello World!"
    };
  }

  public unload() {}
}
