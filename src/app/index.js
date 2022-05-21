const Koa = require("koa");
const useRoutes = require("../router/index");
const bodyParser = require("koa-bodyparser");
const errorHandler = require("./error-handle");

const app = new Koa();

app.useRoutes = useRoutes;

// 注册第三方中间件,解析json数据
app.use(bodyParser());
// 路由导入
app.useRoutes();
// 处理错误
app.on("error", errorHandler);

module.exports = app;
