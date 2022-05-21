const Router = require("koa-router");
const { create, avatarInfo } = require("../controller/user.controller");
const { verifyUser, handlePassword } = require("../middleware/user.middleware");

const userRouter = new Router({ prefix: "/users" });

userRouter.post("/", verifyUser, handlePassword, create);
// restful风格的接口
// 查看用户的头像，凭借这个userId去查看相关的头像信息，设置相应的类型，直接fs读取图片内容作为响应体
userRouter.get("/:userId/avatar", avatarInfo);

module.exports = userRouter;
