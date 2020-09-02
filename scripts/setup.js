module.exports = async () => {
    const app = require('express')();
    app.use(require('express-static')('./dist'));
    global.__APP__ = app;
    global.__SERVER__ = await app.listen(3000);
}