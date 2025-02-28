class Input implements Component {
  private readonly onInput: (val: string) => void;
  private readonly initialValue: string;
  public constructor(
    onInput: (val: string) => void = () => {},
    initialValue: string = "",
  ) {
    this.onInput = onInput;
    this.initialValue = initialValue;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "input",
      classes: ["input"],
      value: this.initialValue,
      handler: [
        {
          id: "onChange",
          type: "input",
          body: (self: edomElement) => {
            this.onInput((self as edomInputElement).value);
          },
        },
      ],
    };
  }

  public unload() {}
}
