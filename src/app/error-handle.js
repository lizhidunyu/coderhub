const errorType = require("../constants/error-types");
const { login } = require("../controller/auth.controller");

const errorHandler = (error, ctx) => {
  let status, message;
  // 使用常量的话就可以针对不同的错误情况进行case处理了
  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; // Bad Request
      message = "用户名或者密码不能为空";
      break;
    case errorType.USER_ALREADY_EXISTS:
      status = 409; // Conflict
      message = "用户已经存在";
      break;
    case errorType.USER_DOES_NOT_EXISTS:
      status = 400; //参数错误
      message = "用户名不存在";
      break;
    case errorType.PASSWORD_IS_INCORRECT:
      status = 400; //参数错误
      message = "密码不正确";
      break;
    case errorType.UNAUTHORIZATION:
      status = 401; //参数错误
      message = "无效的token";
      break;
    case errorType.UNPERMISSION:
      status = 401; //参数错误
      message = "您不具备操作的权限";
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
