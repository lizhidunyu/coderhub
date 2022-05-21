const connection = require("../app/database");

class commentService {
  // 发表评论
  async create(momentId, content, userId) {
    /* 
    报错原因:
    1.没有写await
    2.中文字段的编码没有设置
    */
    try {
      const statement = `INSERT INTO comments (content,moment_id,user_id) VALUES (?,?,?);`;
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        userId,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // 回复评论
  async reply(momentId, content, commentId, userId) {
    try {
      const statement = `INSERT INTO comments (content,moment_id,comment_id,user_id) VALUES (?,?,?,?);`;
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        commentId,
        userId,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // 修改评论
  async update(commentId, content) {
    const statement = `UPDATE comments SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, commentId]);
    return result;
  }

  // 删除评论
  async remove(commentId) {
    const statement = `DELETE FROM comments WHERE id = ?`;
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }

  // 获取评论列表
  async getCommentsByMomentId(momentId) {
    // 一条动态对应的评论列表
    const statement = `
    SELECT 
      m.id,m.content,m.comment_id commentId,m.createAt createTime,
    JSON_OBJECT('id',u.id,'name',u.name) user
    FROM comments m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE moment_id = ?
    `;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }
}

module.exports = new commentService();
