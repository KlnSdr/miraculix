class Checkbox implements Component {
  private readonly labelText: string;
  private readonly onClick: (val: boolean) => void;
  private readonly initialValue: boolean;
  private value: boolean;

  public constructor(
    labelText: string,
    onClick: (val: boolean) => void = () => {},
    initialValue: boolean = false
  ) {
    this.labelText = labelText;
    this.onClick = onClick;
    this.initialValue = initialValue;
    this.value = initialValue;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["checkbox"],
      handler: [
        {
          type: "click",
          id: "onClick",
          body: (self: edomElement) => {
            this.value = !this.value;
            const cb: edomInputElement = self.children[1] as edomInputElement;
            cb.checked = this.value;
            this.onClick(this.value);
          },
        },
      ],
      children: [
        {
          tag: "label",
          text: this.labelText,
          classes: ["label"],
        },
        {
          tag: "input",
          classes: ["input"],
          type: "checkbox",
          checked: this.initialValue,
        },
      ],
    };
  }

  public unload() {}
}
