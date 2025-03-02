class AddStudentPopup implements Component {
  //@ts-ignore
  private readonly clazz: Class;

  //@ts-ignore
  public static show(clazz: Class) {
    new AddStudentPopup(clazz).render(edom.body);
  }
  
  //@ts-ignore
  constructor(clazz: Class) {
    this.clazz = clazz;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      "Neue*r Schüler*in",
      new AddStudent(this.clazz).instructions()
    ).instructions();
  }

  public unload() {}
}
