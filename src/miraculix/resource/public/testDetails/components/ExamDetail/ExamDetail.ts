class ExamDetail implements Component {
  // @ts-ignore
  private readonly exam: Test;
  private maxPoints: number = 0.0;

  // @ts-ignore
  constructor(exam: Test) {
    this.exam = exam;
    this.maxPoints = ExamDetail.calcMaxPoints(exam);
  }

  // @ts-ignore
  public static calcMaxPoints(exam: Test): number {
    // @ts-ignore
    return exam.tasks.reduce((acc: number, task: Task) => {
      if (task.subtasks.length > 0) {
        // @ts-ignore
        return task.subtasks.reduce((accc: number, subtask: Task) => {
          return accc + subtask.points;
        }, 0.0);
      }
      return acc + task.points;
    }, 0.0);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.loadData(), 50);

    return {
      tag: "div",
      id: "ExamDetail",
      classes: ["taskDetail"],
      text: "lade Daten...",
    };
  }

  private loadData() {
    // @ts-ignore
    TestsService.getAllPoints(this.exam.id)
      // @ts-ignore
      .then((result: ExamResult) => this.renderWithData(result.results))
      .catch((e: any) => alert(e));
  }

  // @ts-ignore
  private renderWithData(data: StudentResult[]) {
    const container: edomElement = edom.findById("ExamDetail")!;
    container.text = "";

    edom.fromTemplate(
      [
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
              children: data.map(
                ({ student, points }: { student: string; points: number }) =>
                  this.studentLine(student, points)
              ),
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
          {
            tag: "th",
            text: "Punkte",
          },
        ],
      },
    ];
  }

  private studentLine(student: string, points: number): edomTemplate {
    return {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: student,
        },
        {
          tag: "td",
          text: points.toFixed(1) + "/" + this.maxPoints.toFixed(1),
        },
      ],
    };
  }

  public unload() {}
}
