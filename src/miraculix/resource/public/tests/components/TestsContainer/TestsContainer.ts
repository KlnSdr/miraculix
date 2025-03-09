class TestsContainer implements Component {
  private readonly id: string = "TestsContainer";
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      this.loadTests();
    }, 100);
    return {
      tag: "div",
      classes: ["testsContainerContainer"],
      id: "TestsContainerContainer",
      children: [
        {
          tag: "h1",
          text: "Tests"
        },
        // @ts-ignore
        new Button("", _ => AddTestPopup.show(), ["fa", "fa-plus"]).instructions(),
        {
          tag: "div",
          id: this.id,
          classes: ["testsContainer"]
        }
      ]
    };
  }

  private loadTests() {
    // @ts-ignore
    TestsService.getAll()
      // @ts-ignore
      .then((ts: Test[]) => {
      const container: edomElement = edom.findById(this.id)!;

      edom.fromTemplate(
        // @ts-ignore
        ts.map((t: Test) => new TestCard(t).instructions())
      , container);
      })
      .catch((e: any) => {
        alert(e);
      });
  }

  public unload() {}
}
