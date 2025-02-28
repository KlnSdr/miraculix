class NavbarButton implements Component {
  private readonly text: string;
  private readonly destination: string;
  private readonly additionalClasses: string[];

  public constructor(text: string, destination: string, classes: string[] = []) {
    this.text = text;
    this.destination = destination;
    this.additionalClasses = classes;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return new Button(this.text, () => {
      window.location.assign(this.destination);
    }, this.additionalClasses).instructions();
  }

  public unload() {}
}
