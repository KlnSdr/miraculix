class Popup implements Component {
  private readonly body: edomTemplate | null;
  private readonly title: string;

  constructor(title: string, body: edomTemplate | null = null) {
    this.title = title;
    this.body = body;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["popupBackground"],
      children: [
        {
          tag: "div",
          classes: ["popupBody"],
          children: [
            {
              tag: "div",
              classes: ["popupHeader"],
              children: [
                {
                  tag: "h1",
                  classes: ["popupTitle"],
                  text: this.title,
                },
                new Button("", (self: edomElement) =>
                  Popup.close(self),
                  ["fa", "fa-times"]
                ).instructions(),
              ],
            },
            ...(this.body !== null ? [this.body] : []),
          ],
        },
      ],
    };
  }

  public static changeTitle(target: edomElement, title: string) {
    if (target.classes.includes("popupBackground")) {
      Popup.changeTitle(target.children[0].children[0].children[0], title);
      return;
    }

    if (target.classes.includes("popupTitle")) {
      target.text = title;
      return;
    }

    if (target.tag.toLowerCase() === "body" || target.parent === undefined) {
      console.error("can't change popup title");
      return;
    }

    Popup.changeTitle(target.parent, title);
  }

  public static close(self: edomElement) {
    if (self.tag.toLowerCase() === "body" || self.parent === undefined) {
      return;
    }

    if (self.parent.classes.includes("popupBackground")) {
      self.parent.delete();
      return;
    }

    Popup.close(self.parent);
  }

  public unload() {}
}
