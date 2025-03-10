class AddTest implements Component {
  private name: string = "";
  private clazz: string = "";
  private id: string = Math.random().toString(36);
  // @ts-ignore
  private classes: Class[] = [];

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      edom.findById("inputName")?.focus();
    }, 50);
    this.loadClasses();
    return {
      tag: "div",
      id: this.id,
      classes: ["AddTestPopupBody"],
      children: [
        {
          tag: "p",
          text: "lade Klassen...",
        },
      ],
    };
  }

  private loadClasses() {
    // @ts-ignore
    ClassService.getClasses()
      // @ts-ignore
      .then((cs: Class[]) => {
        this.classes = cs;

        const container: edomElement = edom.findById(this.id)!;
        while (container.children.length > 0) {
          container.children[0].delete();
        }

        edom.fromTemplate(
          [
            {
              tag: "label",
              text: "Klasse:",
            },
            // @ts-ignore
            new Dropdown(
              (val: string) => {
                this.clazz = val;
              },
              // @ts-ignore
              cs.map((c: Class) => c.name),
              ""
            ).instructions(),
            {
              tag: "label",
              text: "Bezeichnung:",
            },
            {
              id: "inputName",
              // @ts-ignore
              ...new Input((val: string) => {
                this.name = val;
              }, "").instructions(),
            },
            {
              tag: "label"
            },
            // @ts-ignore
            new Button("speichern", (self: edomElement) => {
              // @ts-ignore
              Popup.close(self);
              this.createNewTest();
            }).instructions(),
          ],
          container
        );
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  private createNewTest() {
    // @ts-ignore
    TestsService.save(
      this.name,
      // @ts-ignore
      this.classes.find((c: Class) => c.name == this.clazz).id
    )
      .then(() => {
        edom.findById("TestsContainerContainer")?.delete();
        new TestsContainer().render(edom.findById("app")!);
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  public unload() {}
}
