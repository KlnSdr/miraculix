class Button implements Component {
  private readonly classes: string[];
  private readonly text: string;
  private readonly onClick: (self: edomElement) => void;

  public constructor(text: string, onClick: (self: edomElement) => void, classes: string[] = []) {
    this.text = text;
    this.onClick = onClick;
    this.classes = classes;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "button",
      text: this.text,
      classes: ["button", ...this.classes],
      handler: [
        {
          id: "click",
          type: "click",
          body: this.onClick
        }
      ]
    };
  }

  public unload() {}
}
