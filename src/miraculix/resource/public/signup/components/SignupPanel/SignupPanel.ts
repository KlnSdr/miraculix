class SignupPanel implements Component {
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
          text: "Registrierung",
        },
        // @ts-ignore include from students project
        new LabeledInput(
          "Loginname:",
          () => {},
          "",
          "inputUsername"
        ).instructions(),
        // @ts-ignore include from students project
        new LabeledInput("E-Mail:", () => {}, "", "inputMail").instructions(),
        // @ts-ignore include from students project
        new LabeledInput(
          "Passwort:",
          () => {},
          "",
          "inputPassword",
          "password"
        ).instructions(),
        // @ts-ignore include from students project
        new LabeledInput(
          "Passwort bestätigen:",
          () => {},
          "",
          "inputPasswordRepeat",
          "password"
        ).instructions(),
        // @ts-ignore include from students project
        new Button("anmelden", () => doSignup()).instructions(),
        {
          tag: "a",
          classes: ["blocklikeLink"],
          text: "bereits einen Account?",
          target: "{{CONTEXT}}/hades/login",
        },
      ],
    };
  }

  public unload() {}
}
