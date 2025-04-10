function startup() {
    edom.init();
    initUI();
}

function initUI() {
    edom.fromTemplate([new App().instructions()], edom.body);
}
