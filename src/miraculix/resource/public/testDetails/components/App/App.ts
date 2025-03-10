class App implements Component {
  // @ts-ignore
  private readonly examData: Test;

  // @ts-ignore
  constructor(data: Test) {
    this.examData = data;
  }

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
        new TestDetailContainer(this.examData).instructions()
      ],
    };
  }

  public unload() {}
}
