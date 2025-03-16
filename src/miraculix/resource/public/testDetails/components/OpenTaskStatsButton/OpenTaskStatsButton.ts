class OpenTaskStatsButton implements Component {
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
    }, ["fa", "fa-pie-chart", "statsButton"]).instructions();
  }

  public unload() {}
}
