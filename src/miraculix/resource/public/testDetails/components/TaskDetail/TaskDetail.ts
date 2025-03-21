class TaskDetail implements Component {
  // @ts-ignore
  private readonly task: Task;
  private readonly classId: string;
  // @ts-ignore
  private students: Student[] = [];

  // @ts-ignore
  constructor(classId: string, task: Task) {
    this.task = task;
    this.classId = classId;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      this.loadData();
    }, 50);

    return {
      tag: "div",
      classes: ["taskDetail"],
      id: "TaskDetail",
      children: [
        {
          tag: "label",
          text: "lade Daten...",
        },
      ],
    };
  }

  private loadData() {
    // @ts-ignore
    ClassService.getClassById(this.classId)
      // @ts-ignore
      .then((clazz: Class) => StudentService.getStudentsOfClass(clazz))
      // @ts-ignore
      .then((students: Student[]) => {
        this.students = students;
        return Promise.all([
          // @ts-ignore
          ...this.task.subtasks.map((t: Task) => {
            return Promise.all(
              // @ts-ignore
              students.map((s: Student) =>
                // @ts-ignore
                TaskService.getPoints(t.id, s.id)
              )
            );
          }),
          Promise.all(
            // @ts-ignore
            students.map((s: Student) =>
              // @ts-ignore
              TaskService.getPoints(this.task.id, s.id)
            )
          ),
        ]);
      })
      .then((res: Array<number | null>[]) => {
        this.renderWithData(res);
      })
      .catch((e: any) => {
        alert(e);
      });
  }

  private renderWithData(points: Array<number | null>[]) {
    const container: edomElement = edom.findById("TaskDetail")!;

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    edom.fromTemplate(
      [
        this.task.subtasks.length === 0
          ? // @ts-ignore
            new Button(
              "",
              (_self: edomElement) => {
                AddStudentTaskPointsPopup.show(this.task.id, this.students);
              },
              ["fa", "fa-plus"]
            ).instructions()
          : null,
        {
          tag: "table",
          classes: ["studentTable"],
          children: [
            {
              tag: "thead",
              children: this.generateTableHeader(),
            },
            {
              tag: "tbody",
              children: this.students
                // @ts-ignore
                .map((s: Student, index: number) =>
                  this.studentLine(s, points, index)
                )
                .filter((e) => e != null),
            },
          ],
        },
      ].filter((e) => e != null),
      container
    );
  }

  private generateTableHeader(): edomTemplate[] {
    return [
      {
        tag: "tr",
        children: [
          {
            tag: "th",
            text: "Name",
          },
          // @ts-ignore
          ...this.task.subtasks.map((t: Task) => {
            return {
              tag: "th",
              text: t.title.replace(this.task.title, "").trim(),
            };
          }),
          {
            tag: "th",
            text: "Punkte",
          },
        ],
      },
    ];
  }

  private studentLine(
    // @ts-ignore
    student: Student,
    points: Array<number | null>[],
    index: number
  ): edomTemplate | null {
    if (points === null) {
      return null;
    }

    return {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: student.name,
        },
        ...points.map((pts: (number | null)[]) => {
          return {
            tag: "td",
            text: pts[index]?.toFixed(1) ?? "",
          };
        }),
      ],
    };
  }

  public unload() {}
}
