class BarChart implements Component {
  private readonly data: number[];
  private readonly labels: string[];

  constructor(labels: string[], data: number[]) {
    this.data = data;
    this.labels = labels;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    const id: string = Math.random().toString(36);

    setTimeout(() => {
      // @ts-ignore
      new Chart(id, {
        type: "bar",
        data: {
          labels: this.labels,
          datasets: [
            {
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(89, 89, 255,1.0)",
              borderColor: "rgba(89, 89, 255,1.0)",
              data: this.data,
            },
          ],
        },
        options: {
          legend: { display: false },
          scales: {
            yAxes: [{ ticks: { min: 0 } }],
          },
        },
      });
    }, 10);

    return {
      tag: "canvas",
      id: id,
      classes: ["chart"],
    };
  }

  public unload() {}
}
