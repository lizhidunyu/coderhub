const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize,
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo,
} = require("../controller/file.controller");

const fileRouter = new Router({ prefix: "/upload" });
// 上传头像接口，将头像相关信息保存到avatar表中，同时将url添加到users表中
fileRouter.post("/avatar", verifyAuth, avatarHandler, saveAvatarInfo);
// 上传动态图像接口(将相关信息保存到file表中)
fileRouter.post(
  "/picture",
  verifyAuth,
  pictureHandler,
  pictureResize,
  savePictureInfo
);

module.exports = fileRouter;
