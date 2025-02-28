class ClassesContainer implements Component {
  private readonly id: string = "ClassesContainer";
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      this.loadClasses();
    }, 100);
    return {
      tag: "div",
      classes: ["classesContainerContainer"],
      id: "ClassesContainerContainer",
      children: [
        {
          tag: "h1",
          text: "Klassen"
        },
        // @ts-ignore
        new Button("", _ => AddClassPopup.show(), ["fa", "fa-plus"]).instructions(),
        {
          tag: "div",
          id: this.id,
          classes: ["classesContainer"]
        }
      ]
    };
  }

  private loadClasses() {
    // @ts-ignore
    ClassService.getClasses()
    // @ts-ignore
    .then((cs: Class[]) => {
      const container: edomElement = edom.findById(this.id)!;

      edom.fromTemplate(
        // @ts-ignore
        cs.map((c: Class) => new ClassCard(c).instructions())
      , container);
    })
    .catch((e: any) => {
      alert(e);
    });
  }

  public unload() {}
}
