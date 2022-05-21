const { AVATAR_PATH } = require("../constants/file-path");
const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { avatarInfo } = require("./user.controller");
const { APP_PORT, APP_HOST } = require("../app/config");

class fileController {
  async saveAvatarInfo(ctx, next) {
    //   1.获取图像相关信息
    // 由于中间件处理,所有文件相关的信息都被放到了ctx.req.file身上
    const { mimetype, filename, size } = ctx.req.file;
    const { id } = ctx.user;

    //   2.将图像数据保存到avatar表之中
    await fileService.createAvatar(filename, mimetype, size, id);

    //   3.将我们的图片地址保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id);

    //   4.返回结果
    ctx.body = "上传头像成功~~";
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    // 2.将图像信息保存到数据库中
    for (let file of files) {
      const { mimetype, filename, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }
    ctx.body = "动态配图上传成功~~~";
  }
}

module.exports = new fileController();
