class AddClass implements Component {
  private name: string = "";

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      edom.findById("inputName")?.focus();
    }, 100);
    return {
      tag: "div",
      children: [
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
        // @ts-ignore
        new Button("speichern", (self: edomElement) => {
          // @ts-ignore
          Popup.close(self);
          this.createNewClass();
        }).instructions(),
      ],
    };
  }

  private createNewClass() {
    // @ts-ignore
    ClassService.save(this.name)
      .then(() => {
        edom.findById("ClassesContainerContainer")?.delete();
        new ClassesContainer().render(edom.findById("app")!);
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  public unload() {}
}
