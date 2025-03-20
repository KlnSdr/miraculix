class TaskService {
  public static addNewPoints(
    taskId: string,
    studentId: string,
    points: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/tasks/id/${taskId}/student/id/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: points }),
      })
        .then((response: Response) => {
          if (response.status !== 201) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          resolve();
        })
        .catch((e: any) => reject(e));
    });
  }

  public static getPoints(
    taskId: string,
    studentId: string
  ): Promise<number | null> {
    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/tasks/id/${taskId}/student/id/${studentId}`)
        .then((response: Response) => {
          if (response.status === 404) {
            resolve(null);
          } else if (response.status === 200) {
            return response.json();
          } else {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
        })
        .then(({ points }: { points: number }) =>
          resolve(parseFloat(points.toFixed(2)))
        )
        .catch(reject);
    });
  }
}
