const Router = require("koa-router");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const {
  create,
  reply,
  update,
  remove,
  list,
} = require("../controller/comment.controller");

const commentRouter = new Router({ prefix: "/comment" });

// 发布评论
// 对动态进行评论
commentRouter.post("/", verifyAuth, create);
// 回复评论
// 对评论进行评论
// params主要是对于哪条动态的评论
// body里面具体是对于哪条动态
commentRouter.post("/:commentId/reply", verifyAuth, reply);
// 修改评论
commentRouter.patch("/:commentId", verifyAuth, verifyPermission, update);
// 删除评论
commentRouter.delete("/:commentId", verifyAuth, verifyPermission, remove);
// 获取评论列表
// 单个动态的评论信息
// 将动态和评论分开写，而我们这个接口主要负责评论的数据
// 评论信息　＋　评论者信息　（相当于对复合接口的一个拆分）
commentRouter.get("/", list);

module.exports = commentRouter;
