const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaStatic = require('koa-static');

const app = new Koa();
app.use(koaStatic(path.join(__dirname)));

app.listen(3003, (_) => {
    console.log('server', 'App (pro) is going to be running on port 3003.');
});
