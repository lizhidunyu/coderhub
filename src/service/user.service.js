const connection = require("../app/database");

class UserService {
  // 将数据存储到数据表中并且返回结果给中间件作为响应体的结果
  async create(user) {
    const { name, password } = user;
    const statement = "INSERT INTO users (name,password) VALUES (?,?)";
    // 将user存储到数据库中
    const result = await connection.execute(statement, [name, password]);
    // console.log("将用户数据保存到数据库中", user);
    return result[0];
  }

  // 到数据库查询是否已经登录过
  async getUserByName(name) {
    // 区分大小写，需要在查询条件前面加上binary
    const statement = `SELECT * FROM users WHERE BINARY name = ?;`;
    const result = await connection.execute(statement, [name]);
    return result[0];
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?`;
    const result = connection.execute(statement, [avatarUrl, userId]);
    return result[0];
  }
}
module.exports = new UserService();
