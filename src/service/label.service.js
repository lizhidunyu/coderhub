const connection = require("../app/database");

class labelService {
  // 创建标签
  async create(name) {
    const statement = `INSERT INTO label (name) VALUES (?)`;
    const [result] = await connection.execute(statement, [name]);
    return result;
  }

  // 动态中添加标签，如果不存在就添加到标签数据表中
  async getLabelByName(name) {
    const statement = `SELECT * FROM label where name=?`;
    const [result] = await connection.execute(statement, [name]);
    return result[0];
  }

  // 展示标签
  async getLabels(limit, offset) {
    const statement = `SELECT * FROM label limit ?,?`;
    const [result] = await connection.execute(statement, [offset, limit]);
    return result;
  }
}

module.exports = new labelService();
