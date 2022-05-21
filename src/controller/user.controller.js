const fs = require("fs");
const userService = require("../service/user.service");
const fileService = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");

class UserController {
  // 创建用户
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    // 查询数据
    const result = await userService.create(user);
    // 返回数据
    ctx.body = result;
  }

  // 获取头像信息
  async avatarInfo(ctx, next) {
    // 1.用户的头像
    const { userId } = ctx.params;
    const avaterInfo = await fileService.getAvatarByUserId(userId);
    // 2.提供图像信息
    // 必须设置文件类型为图片,浏览器会在窗口展示
    // 否则浏览器就会直接下载下来
    ctx.response.set("content-type", avaterInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avaterInfo.filename}`);
  }
}

module.exports = new UserController();
