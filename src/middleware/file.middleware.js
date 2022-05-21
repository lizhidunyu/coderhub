const path = require("path");
const Jimp = require("jimp");
const Multer = require("koa-multer");
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file-path");

// 对头像处理
const avatarUpload = Multer({
  dest: AVATAR_PATH,
});
const avatarHandler = avatarUpload.single("avatar");

// 对图片处理
const pictureUpload = Multer({
  dest: PICTURE_PATH,
});
const pictureHandler = pictureUpload.array("picture", 9);

const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有的图像信息
    const files = ctx.req.files;
    // 2.对图像进行遍历(sharp / jimp)
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename);
      // 将图片保存成不同的大小格式，对于不同的应用场景
      // 前端传递不同的参数，后端返回大小不同的图片
      Jimp.read(file.path).then((image) => {
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      });
    }
    await next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { avatarHandler, pictureHandler, pictureResize };
