class AddStudentPopup implements Component {
  //@ts-ignore
  private readonly clazz: Class;
  private readonly studentID: string;
  private readonly studentName: string;
  private readonly caller: ClassDetail;

  public static show(
    //@ts-ignore
    clazz: Class,
    caller: ClassDetail,
    initialStudentId: string = "",
    initialStudentName: string = ""
  ) {
    new AddStudentPopup(clazz, caller, initialStudentId, initialStudentName).render(
      edom.body
    );
  }

  constructor(
    //@ts-ignore
    clazz: Class,
    caller: ClassDetail,
    initialStudentId: string,
    initialStudentName: string
  ) {
    this.clazz = clazz;
    this.caller = caller;
    this.studentID = initialStudentId;
    this.studentName = initialStudentName;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore
    return new Popup(
      this.studentID === "" ? "Neue*r Schüler*in" : "Schüler*in bearbeiten",
      new AddStudent(
        this.clazz,
        this.studentID,
        this.studentName,
        this.caller
      ).instructions()
    ).instructions();
  }

  public unload() {}
}
