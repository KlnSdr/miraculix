class LoginPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["loginPanel"],
      children: [
        {
          tag: "h1",
          text: "Anmeldung",
        },
        // @ts-ignore include from students project
        new LabeledInput(
          "Loginname:",
          () => {},
          "",
          "inputUsername"
        ).instructions(),
        // @ts-ignore include from students project
        new LabeledInput(
          "Passwort:",
          () => {},
          "",
          "inputPassword",
          "password"
        ).instructions(),
        // @ts-ignore include from students project
        new Button("anmelden", () => doLogin()).instructions(),
        {
          tag: "a",
          classes: ["blocklikeLink"],
          text: "noch keinen Account?",
          target: "{{CONTEXT}}/hades/signup",
        },
      ],
    };
  }

  public unload() {}
}
