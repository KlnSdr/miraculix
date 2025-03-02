class ClassCard implements Component {
  // @ts-ignore
  private target: Class;

  // @ts-ignore
  constructor(c: Class) {
    this.target = c;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["classCard"],
      children: [
        {
          tag: "p",
          text: this.target.name
        }
      ],
      handler: [
        {
          id: "click",
          type: "click",
          body: (_self: edomElement) => ClassDetailPopup.show(this.target)
        }
      ]
    };
  }

  public unload() {}
}
