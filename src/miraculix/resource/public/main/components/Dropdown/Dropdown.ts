class Dropdown implements Component {
  private readonly options: string[];
  private readonly onInput: (val: string) => void;
  private readonly initialValue: string;
  private readonly selectId: string = Math.random().toString(36);

  public constructor(
    onInput: (val: string) => void = () => {},
    options: string[] = [],
    initialValue: string = "",
  ) {
    this.onInput = onInput;
    this.options = options;
    this.initialValue = initialValue;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      const select: HTMLSelectElement = document.getElementById(
        this.selectId,
      ) as HTMLSelectElement;
      select.value = this.initialValue;
    }, 100);
    return {
      tag: "select",
      classes: ["select"],
      id: this.selectId,
      handler: [
        {
          id: "onChange",
          type: "change",
          body: (self: edomElement) => {
            this.onInput((self.element as HTMLSelectElement).value);
          },
        },
      ],
      children: ["", ...this.options].map((option: string) => {
        return {
          tag: "option",
          text: option,
          classes: ["option"],
        };
      }),
    };
  }

  public unload() {}
}
