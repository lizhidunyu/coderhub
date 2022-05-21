// Node中自带的库
const crypto = require("crypto");

const md5password = (password) => {
  // 返回一个对象
  const md5 = crypto.createHash("md5");
  // 利用对象对密码进行加密
  // md5.update(password)生成一个对象
  // .digest()拿到结果 hex转成十六进制
  const result = md5.update(password).digest("hex");
  return result;
};

module.exports = md5password;
