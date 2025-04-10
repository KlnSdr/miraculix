class LabeledInput implements Component {
  private readonly labelText: string;
  private readonly onInput: (val: string) => void;
  private readonly initialValue: string;
  private readonly inputId: string;
  private readonly inputType: string;

  public constructor(
    labelText: string,
    onInput: (val: string) => void = () => {},
    initialValue: string = "",
    inputId: string | null = null,
    inputType: string = "text"
  ) {
    this.labelText = labelText;
    this.onInput = onInput;
    this.initialValue = initialValue;
    this.inputId = inputId == null ? Math.random().toString(36) : inputId;
    this.inputType = inputType;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["labeledInput"],
      children: [
        {
          tag: "label",
          text: this.labelText,
          classes: ["label"],
        },
        {
          ...new Input(this.onInput, this.initialValue).instructions(),
          type: this.inputType,
          id: this.inputId,
        },
      ],
    };
  }

  public unload() {}
}
