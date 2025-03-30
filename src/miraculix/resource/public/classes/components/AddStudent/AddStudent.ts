class AddStudent implements Component {
  private name: string;
  // @ts-ignore
  private readonly clazz: Class;
  private readonly initalName: string;
  private readonly initalId: string;

  // @ts-ignore
  constructor(clazz: Class, initalId: string, initalName: string) {
    this.clazz = clazz;
    this.initalId = initalId;
    this.initalName = initalName;
    this.name = initalName;
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
        new Button("speichern", (self: edomElement) => {
          // @ts-ignore
          Popup.close(self);
          this.createNewStudent();
        }).instructions(),
      ],
    };
  }

  private createNewStudent() {
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
      })
      .catch((e: any) => alert(e));
  }

  public unload() {}
}
