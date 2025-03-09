interface NavbarElement {
  text: string;
  destination: string;
}

interface DynamicLink {
  text: string;
  action: () => void;
}

class Navbar implements Component {
  private static navbarElements: NavbarElement[] = [
    {
      text: "Tests",
      destination: "{{CONTEXT}}/tests",
    },
    {
      text: "Klassen",
      destination: "{{CONTEXT}}/classes",
    },
  ];
  private dynamicLinks: DynamicLink[];

  public constructor(dynamicLinks: DynamicLink[] = []) {
    this.dynamicLinks = dynamicLinks;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["navbar"],
      children: [
        {
          tag: "div",
          classes: ["navLeft"],
          children: [
            ...(this.dynamicLinks.length > 0
              ? [
                  ...this.dynamicLinks.map((link: DynamicLink) =>
                    new Button(link.text, link.action).instructions()
                  ),
                  {
                    tag: "div",
                    classes: ["verticalNavbarLine"],
                  },
                ]
              : []),
            ...Navbar.navbarElements.map((element: NavbarElement) =>
              new NavbarButton(element.text, element.destination).instructions()
            ),
          ],
        },
        {
          tag: "div",
          classes: ["navRight"],
          children: [
            // new NavbarButton("", "{{CONTEXT}}/settings", ["fa", "fa-cog"]).instructions(),
            // new NavbarButton("", "{{CONTEXT}}/info", ["fa", "fa-info-circle"]).instructions(),
            new NavbarButton("", "{{CONTEXT}}/logout", [
              "fa",
              "fa-sign-out",
            ]).instructions(),
          ],
        },
      ],
    };
  }

  public unload() {}
}
