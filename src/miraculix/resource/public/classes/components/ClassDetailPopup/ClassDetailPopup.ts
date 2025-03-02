class ClassDetailPopup implements Component {
  // @ts-ignore
  private readonly clazz: Class;

  // @ts-ignore
  public static show(clazz: Class) {
    new ClassDetailPopup(clazz).render(edom.body);
  }

  // @ts-ignore
  constructor(clazz: Class) {
    this.clazz = clazz;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      this.clazz.name,
      new ClassDetail(this.clazz).instructions()
    ).instructions();
  }

  public unload() {}
}
