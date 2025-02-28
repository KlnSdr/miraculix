interface Class {
  id: string;
  name: string;
}

class ClassService {
  private static classes: Class[] | null = [
    { id: "42", name: "9b" },
    { id: "43", name: "10b" },
    { id: "44", name: "11b" },
    { id: "45", name: "12b" },
    { id: "46", name: "13b" },
    { id: "47", name: "14b" },
    { id: "48", name: "15b" },
    { id: "49", name: "16b" },
  ];

  public static getClasses(): Promise<Class[]> {
    return new Promise((resolve, reject) => {
      if (this.classes !== null) {
        resolve(this.classes);
      }
    });
  }
}
