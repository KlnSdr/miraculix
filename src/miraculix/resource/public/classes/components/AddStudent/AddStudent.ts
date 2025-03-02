class AddStudent implements Component {
  private name: string = "";
  // @ts-ignore
  private readonly clazz: Class;

  // @ts-ignore
  constructor(clazz: Class) {
    this.clazz = clazz;
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
          }, "").instructions(),
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
    StudentService.create(this.name)
      // @ts-ignore
      .then((student: Student) => {
        // @ts-ignore
        return ClassService.addStudent(student, this.clazz);
      })
      .then(() => {
        console.log("updated");
      })
      .catch((e: any) => alert(e));
  }

  public unload() {}
}
