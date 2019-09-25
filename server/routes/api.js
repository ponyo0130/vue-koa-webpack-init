import Router from 'koa-router';
export default function () {
    const router = Router();

    router.prefix('/monitor');
    // router.get('/', async (ctx) => {
    //     console.log('here')
    //     ctx.body = 'Hello haha';
    // });


    return router.routes();
}
