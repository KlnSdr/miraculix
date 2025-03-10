class AddTask implements Component {
  // @ts-ignore
  private data: Task = {
    title: "",
    points: 0.0,
    subtasks: [],
  };
  private subtaskCounter: number = 0;
  private readonly examId: string;

  constructor(examId: string) {
    this.examId = examId;
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
          tag: "div",
          classes: ["addTask"],
          children: [
            {
              tag: "label",
              text: "Bezeichnung:",
            },
            {
              id: "inputName",
              // @ts-ignore
              ...new Input((val: string) => {
                this.data = {
                  ...this.data,
                  title: val,
                };
              }, "").instructions(),
            },
            // @ts-ignore
            new Checkbox("Teilaufgaben:", (val: boolean) => {
              const container: edomElement = edom.findById("outDataInput")!;
              while (container.children.length > 0) {
                container.children[0].delete();
              }

              this.subtaskCounter = 0;
              this.data = {
                ...this.data,
                points: 0.0,
                subtasks: [],
              };

              edom.fromTemplate(
                val ? this.renderSubTasks() : this.renderTopLevelTask(),
                container
              );
            }).instructions(),
          ],
        },
        {
          tag: "div",
          id: "outDataInput",
          classes: ["addTask"],
          children: this.renderTopLevelTask(),
        },
        {
          tag: "div",
          classes: ["addTask"],
          children: [
            {
              tag: "label",
            },
            // @ts-ignore
            new Button("speichern", (self: edomElement) => {
              // @ts-ignore
              Popup.close(self);
              this.saveTask();
            }).instructions(),
          ],
        },
      ],
    };
  }

  private saveTask() {
    // @ts-ignore
    this.data.subtasks = this.data.subtasks.map((t: Task) => {
      return {
        ...t,
        title: `${this.data.title} ${t.title}`,
      };
    });
    // @ts-ignore
    TestsService.addTask(this.examId, this.data)
      // @ts-ignore
      .then((test: Test) => {
        edom.findById("TestDetailContainer")!.delete();
        new TestDetailContainer(test).render(edom.findById("app")!);
      })
      .catch((e: any) => alert(e));
  }

  private renderTopLevelTask(): edomTemplate[] {
    return [
      {
        tag: "label",
        text: "Punkte:",
      },
      {
        id: "inputPoints",
        // @ts-ignore
        ...new Input((val: string) => {
          this.data = {
            ...this.data,
            points: parseFloat(val.replace(",", ".")),
          };
        }, "").instructions(),
      },
    ];
  }

  private renderSubTasks(): edomTemplate[] {
    return [
      // @ts-ignore
      new Button(
        "",
        (_self: edomElement) => {
          const conainer: edomElement = edom.findById("outDataInput")!;
          this.subtaskCounter++;
          this.data.subtasks.push({
            title: this.toLetters(this.subtaskCounter),
            subtasks: [],
            points: 0.0,
          });
          const index = this.subtaskCounter - 1;
          edom.fromTemplate(
            [
              {
                tag: "label",
                text: `${this.toLetters(this.subtaskCounter)}) Punkte:`,
              },
              // @ts-ignore
              new Input((val: string) => {
                this.data.subtasks[index].points = parseFloat(
                  val.replace(",", ".")
                );
              }, "").instructions(),
            ],
            conainer
          );
        },
        ["fa", "fa-plus", "smallFlexButton"]
      ).instructions(),
      {
        tag: "label",
      },
    ];
  }

  private toLetters(num: number): string {
    "use strict";
    var mod = num % 26,
      pow = (num / 26) | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, "Z");
    return (pow ? this.toLetters(pow) + out : out).toLowerCase();
  }

  public unload() {}
}
