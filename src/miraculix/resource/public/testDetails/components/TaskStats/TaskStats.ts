class TaskStats implements Component {
  // @ts-ignore
  private readonly task: Task;
  private readonly classId: string;

  private labels: string[] = [];
  private valuesAbs: number[] = [];
  private valuesPercent: number[] = [];
  private average: string = "-1";
  private median: string = "-1";

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
          text: "lade Daten",
        },
        { tag: "div", classes: ["loader"] },
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
        if (res.length > 1) {
          for (let i = 0; i < res[0].length; i++) {
            let sum: number = 0.0;

            for (let j = 0; j < res.length - 1; j++) {
              sum += res[j][i] ?? 0.0;
            }
            res[res.length - 1][i] = sum;
          }
        }
        this.prepareData(res);
        this.renderWithDataNumbers();
      })
      .catch((e: any) => {
        alert(e);
      });
  }

  private prepareData(points: Array<number | null>[]) {
    const sums: (number | null)[] = points[points.length - 1].filter(
      (v) => v !== null
    );
    const maxPoints: number = this.task.subtasks.reduce(
      // @ts-ignore
      (acc: number, val: Task) => acc + val.points,
      this.task.points
    );

    const unNullSums: number[] = sums.filter((v) => v !== null);
    unNullSums.sort();

    this.average = (
      unNullSums.reduce((acc: number, val: number) => acc + val, 0.0) /
      unNullSums.length
    ).toFixed(1);

    this.median = (
      unNullSums.length % 2 === 0
        ? (unNullSums[unNullSums.length / 2 - 1] +
            unNullSums[unNullSums.length / 2]) /
          2
        : unNullSums[(unNullSums.length + 1) / 2 - 1]
    ).toFixed(1);

    const labels: string[] = ["?"];
    const valuesAbs: number[] = [];
    const valuesPercent: number[] = [];

    for (let i = 0.0; i <= maxPoints; i += 0.5) {
      labels.push(i.toFixed(1));
      valuesAbs.push(sums.filter((v) => v === i).length);
      valuesPercent.push(
        (100 * sums.filter((v) => v === i).length) / sums.length
      );
      sums.forEach((v: number | null, index: number) => {
        if (v === i) {
          sums[index] = null;
        }
      });
    }

    valuesAbs.unshift(sums.filter((v) => v !== null).length);
    valuesPercent.unshift(
      (100 * sums.filter((v) => v !== null).length) / sums.length
    );

    this.labels = labels;
    this.valuesAbs = valuesAbs;
    this.valuesPercent = valuesPercent;
  }

  private renderWithDataNumbers() {
    const container: edomElement = edom.findById("TaskDetail")!;

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    edom.fromTemplate(
      [
        // @ts-ignore
        new Button("", (_) => this.renderWithDataPercent(), [
          "fa",
          "fa-percent",
          "rightMargin",
        ]).instructions(),
        {
          tag: "label",
          text: "Durchschnitt: " + this.average,
        },
        {
          tag: "label",
          text: ", Median: " + this.median,
        },
        new BarChart(this.labels, this.valuesAbs).instructions(),
      ],
      container
    );
  }

  private renderWithDataPercent() {
    const container: edomElement = edom.findById("TaskDetail")!;

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    edom.fromTemplate(
      [
        // @ts-ignore
        new Button("", (_) => this.renderWithDataNumbers(), [
          "fa",
          "fa-hashtag",
          "rightMargin",
        ]).instructions(),
        {
          tag: "label",
          text: "Durchschnitt: " + this.average,
        },
        {
          tag: "label",
          text: ", Median: " + this.median,
        },
        new BarChart(this.labels, this.valuesPercent).instructions(),
      ],
      container
    );
  }

  public unload() {}
}
