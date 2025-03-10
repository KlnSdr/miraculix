class OpenTaskButton implements Component {
  // @ts-ignore
  private readonly task: Task;

  // @ts-ignore
  constructor(task: Task) {
    this.task = task;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
  // @ts-ignore
    return new Button("", () => {
      console.log("click");
    }, ["fa", "fa-external-link"]).instructions();
  }

  public unload() {}
}
