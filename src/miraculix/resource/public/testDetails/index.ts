function startup() {
  edom.init();
  // @ts-ignore
  new App(data).render(edom.body);
}
