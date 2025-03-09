class TestCard implements Component {
  // @ts-ignore
  private target: Test;
  // @ts-ignore
  private clazz: Class;

  // @ts-ignore
  constructor(t: Test, c: Class) {
    this.target = t;
    this.clazz = c;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["testCard"],
      children: [
        {
          tag: "p",
          text: this.clazz.name,
          classes: ["testCardBadge"]
        },
        {
          tag: "p",
          text: this.target.title,
        },
      ],
      // handler: [
      //   {
      //     id: "click",
      //     type: "click",
      //     body: (_self: edomElement) => TestDetailPopup.show(this.target)
      //   }
      // ]
    };
  }

  public unload() {}
}
