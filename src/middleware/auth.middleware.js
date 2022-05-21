const jwt = require("jsonwebtoken");
const errorType = require("../constants/error-types");
const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const md5password = require("../utils/password-handle");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  console.log("验证登录的middleware~");

  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名或密码是否为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  // 3.判断用户是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];
  // user
  //  {
  //   id: 2,
  //   name: 'lucy',
  //   password: 'e10adc3949ba59abbe56e057f20f883e',
  //   createAt: 2022-05-18T08:35:36.000Z,
  //   updateAt: 2022-05-18T08:35:36.000Z
  // }

  if (!user) {
    const error = new Error(errorType.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  // 4.判断密码是否和数据库中的密码是一致的(加密)
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.PASSWORD_IS_INCORRECT);
    return ctx.app.emit("error", error, ctx);
  }

  // 把用户信息放到ctx的user属性身上
  ctx.user = user;

  await next();
};

// 封装一个授权的函数
const verifyAuth = async (ctx, next) => {
  console.log("verifyAuth -- 验证授权的middleware~");

  // 1.获取Token
  // 服务器拿到客服端发过来的token令牌，判断是否有
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
    return;
  }

  // 2.验证Token
  // 用公钥解密
  // 判断是否有效
  try {
    const token = authorization.replace("Bearer ", "");
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    // 向其他接口发送请求的时候，去验证token，将token解析为
    // { id: 7, name: 'Lucy', iat: 1652496783, exp: 1652583183 }
    // 再添加到ctx.user属性上
    // 可以判断用户是否是登录的
    // 如果是登录的,可以通过令牌拿到用户信息
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

// 验证是否有权限修改动态
/* 
1.很多的内容都需要验证权限:修改、删除动态/评论
2.接口:业务接口系统/后台管理系统接口
一对一：user -> role
多对多：role -> menu(删除动态/修改动态)

*/

// 解决方案一:闭包
// const verifyPermission = (tableName) => {
//   async (ctx, next) => {
//     console.log("verifyPermission -- 验证授权的middleware~~");

//     // 获取参数
//     const { momentId } = ctx.params;
//     const { id } = ctx.user;

//     // 查询是否具备权限
//     try {
//       const isPermission = await authService.checkResource(
//         tableName,
//         momentId,
//         id
//       );
//       if (!isPermission) {
//         throw new Error();
//       }
//       await next();
//     } catch (err) {
//       const error = new Error(errorType.UNPERMISSION);
//       return ctx.app.emit("error", error, ctx);
//     }
//   };
// };

// 登录的用户只能修改自己发布的动态或者评论
// 找到这条动态、评论的id和用户的id，进行联合查询，看看有没有数据
// 如果有的话，才准许查询
const verifyPermission = async (ctx, next) => {
  console.log("verifyPermission -- 验证授权的middleware~~");

  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "s");
  const resourceId = ctx.params[resourceKey];

  const { id } = ctx.user;

  // 查询是否具备权限
  try {
    const isPermission = await authService.checkResource(
      tableName,
      resourceId,
      id
    );
    if (!isPermission) {
      throw new Error();
    }
    await next();
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission,
};
