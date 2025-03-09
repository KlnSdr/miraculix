class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
    location.assign("{{CONTEXT}}/tests")
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["app"],
      text: "Sie werden weitergeleitet..."
    };
  }

  public unload() {}
}
