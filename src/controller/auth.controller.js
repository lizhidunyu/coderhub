const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");

class authController {
  async login(ctx, next) {
    const { id, name } = ctx.user;
    // 根据登录时的id和name生成相应的token
    // 这时不可以直接用ctx.request.body里面的name,password
    // 因为密码不可以被轻易地泄露

    // 私钥进行加密
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
    });
    // 返回给客服端，等到客服端进取其他请求的时候，携带着这个token验证身份
    ctx.body = {
      id,
      name,
      token,
    };
  }

  async success(ctx, next) {
    ctx.body = "授权成功";
  }
}

module.exports = new authController();
