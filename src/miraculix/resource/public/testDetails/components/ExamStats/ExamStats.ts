class ExamStats implements Component {
  // @ts-ignore
  private readonly exam: Test;

  private labels: string[] = [];
  private valuesAbs: number[] = [];
  private valuesPercent: number[] = [];
  private average: string = "-1";
  private median: string = "-1";
  private maxPoints: number = 0.0;

  // @ts-ignore
  constructor(exam: Test) {
    this.exam = exam;
    this.maxPoints = ExamDetail.calcMaxPoints(exam);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.loadData(), 50);

    return {
      tag: "div",
      id: "ExamStats",
      classes: ["taskDetail"],
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
    TestsService.getAllPoints(this.exam.id)
      // @ts-ignore
      .then((result: ExamResult) => {
        this.prepareData(result.results);
        this.renderWithDataNumbers();
      })
      .catch((e: any) => alert(e));
  }

  // @ts-ignore
  private prepareData(data: StudentResult[]) {
    const dat: (number | null)[] = data.map((v) =>
      parseFloat(v.points.toFixed(1))
    );

    const unNullSums: number[] = dat.filter((v) => v !== null);
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

    for (let i = 0.0; i <= this.maxPoints; i += 0.5) {
      labels.push(i.toFixed(1));
      valuesAbs.push(dat.filter((v) => v === i).length);
      valuesPercent.push(
        (100 * dat.filter((v) => v === i).length) / dat.length
      );
      dat.forEach((v: number | null, index: number) => {
        if (v === i) {
          dat[index] = null;
        }
      });
    }

    valuesAbs.unshift(dat.filter((v) => v !== null).length);
    valuesPercent.unshift(
      (100 * dat.filter((v) => v !== null).length) / dat.length
    );

    this.labels = labels;
    this.valuesAbs = valuesAbs;
    this.valuesPercent = valuesPercent;
  }

  private renderWithDataNumbers() {
    const container: edomElement = edom.findById("ExamStats")!;

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
    const container: edomElement = edom.findById("ExamStats")!;

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
