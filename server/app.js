import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import historyApiFallback from 'koa2-history-api-fallback';
import bodyparser from 'koa-bodyparser';
import api from './routes/api.js';

const app = new Koa();

const PORT = process.env.HTTP_PORT || 4000;
const IP = process.env.HTTP_IP || '0.0.0.0';
// app.use(historyApiFallback());
app.use(
    serve(path.resolve(__dirname, '../dist'), {
        maxage: 1000 * 60 * 60 * 24 * 30, // a month
    }),
);
app.use(bodyparser());
app.use(api());
let koa2_timeout = async function (ctx, next) {
    let tmr = null;
    const timeout = 5 * 60 * 1000;// 设置超时时间
    await Promise.race([
        new Promise((resolve, reject) => {
            tmr = setTimeout(() => {
                let e = new Error('Request timeout');
                e.status = 408;
                reject(e);
            }, timeout);
        }),
        new Promise((resolve, reject) => {
            // 使用一个闭包来执行下面的中间件
            (async function () {
                await next();
                clearTimeout(tmr);
                resolve();
            }());
        })
    ]);
};
app.use(koa2_timeout);

app.listen(PORT, IP, () => {
    console.log(`app started at http://${IP || 'localhost'}:${PORT}`);
});

export default app;
