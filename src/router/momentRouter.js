const Router = require("koa-router");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const { verifyLabelExists } = require("../middleware/label.middleware.js");
const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo,
} = require("../controller/moment.controller.js");

const momentRouter = new Router({ prefix: "/moment" });

// 发布动态
momentRouter.post("/", verifyAuth, create);
// 获取动态列表 (这个接口是需要展示动态以及评论的个数)
// 分页查询，需要传递query参数 offset size
momentRouter.get("/", list);
// 获取单个动态（需要动态的信息＋发布者的形象＋［评论的信息｛评论者的信息｝，｛｝］）
// 这种相当于对于单个动态，将动态和评论的接口一起写
momentRouter.get("/:momentId", detail);
// 修改动态
momentRouter.patch("/:momentId", verifyAuth, verifyPermission, update);
// 删除动态
momentRouter.delete("/:momentId", verifyAuth, verifyPermission, remove);
// 给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelExists,
  addLabels
);
// 动态配图
// 在查看单条动态或者动态列表的时候，会跳转到这个接口，根据需求返回不同格式的图片
momentRouter.get("/images/:filename", fileInfo);

module.exports = momentRouter;
