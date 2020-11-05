const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaStatic = require('koa-static');

const app = new Koa();
app.use(koaStatic(path.join(__dirname)));
app.use(async (ctx, next) => {
  ctx.type = 'text/html';
  ctx.body = fs.readFileSync(path.resolve(__dirname, 'index.html'));
});

app.listen(3003, (_) => {
    console.log('server', 'App (pro) is going to be running on port 3003.');
});
