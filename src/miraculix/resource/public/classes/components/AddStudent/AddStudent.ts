class AddStudent implements Component {
  private name: string;
  // @ts-ignore
  private readonly clazz: Class;
  private readonly initalName: string;
  private readonly initalId: string;

  private caller: ClassDetail;

  constructor(
    // @ts-ignore
    clazz: Class,
    initalId: string,
    initalName: string,
    caller: ClassDetail
  ) {
    this.clazz = clazz;
    this.initalId = initalId;
    this.initalName = initalName;
    this.name = initalName;
    this.caller = caller;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      edom.findById("inputName")?.focus();
    }, 50);
    return {
      tag: "div",
      children: [
        {
          tag: "label",
          text: "Name:",
        },
        {
          id: "inputName",
          // @ts-ignore
          ...new Input((val: string) => {
            this.name = val;
          }, this.initalName).instructions(),
        },
        // @ts-ignore
        new Button("speichern", (self: edomElement) =>
          this.createNewStudent(self)
        ).instructions(),
      ],
      handler: [
        {
          type: "unload",
          id: "ondelete",
          body: (_: edomElement) => this.caller.refresh(),
        },
      ],
    };
  }

  private createNewStudent(self: edomElement) {
    // @ts-ignore
    StudentService.createOrUpdate(this.name, this.initalId)
      // @ts-ignore
      .then((student: Student) => {
        if (this.initalId === "") {
          // @ts-ignore
          return ClassService.addStudent(student, this.clazz);
        } else {
          return null;
        }
      })
      .then(() => {
        console.log("updated");
        // @ts-ignore
        Popup.close(self);
      })
      .catch((e: any) => alert(e));
  }

  public unload() {}
}
