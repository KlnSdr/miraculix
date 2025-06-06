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
          text: "Tests",
        },
        // @ts-ignore
        new Button("", (_) => AddTestPopup.show(), [
          "fa",
          "fa-plus",
        ]).instructions(),
        {
          tag: "div",
          id: this.id,
          classes: [],
          children: [
            {
              tag: "label",
              text: "lade Daten",
            },
            {
              tag: "div",
              classes: ["loader"],
            },
          ],
        },
      ],
    };
  }

  private loadTests() {
    Promise.all([
      // @ts-ignore
      TestsService.getAll(),
      // @ts-ignore
      ClassService.getClasses(),
    ])
      // @ts-ignore
      .then(([ts, cs]: [Test[], Class[]]) => {
        const container: edomElement = edom.findById(this.id)!;
        container.applyStyle("testsContainer");

        while (container.children.length > 0) {
          container.children[0].delete();
        }

        edom.fromTemplate(
          cs
            // @ts-ignore
            .map((c: Class) =>
              ts
                // @ts-ignore
                .filter((t: Test) => t.clazz == c.id)
                // @ts-ignore
                .map((t: Test) => new TestCard(t, c).instructions())
            )
            .flat(),
          container
        );
      })
      .catch((e: any) => {
        alert(e);
      });
  }

  public unload() {}
}
