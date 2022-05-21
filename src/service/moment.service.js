const connection = require("../app/database");

class MomentService {
  // 将数据存储到数据表中并且返回结果给中间件作为响应体的结果
  async create(userId, content) {
    const statement = `INSERT INTO moments (content,user_id) VALUES (?,?);`;
    // 将user存储到数据库中
    const [result] = await connection.execute(statement, [content, userId]);
    // console.log("将用户数据保存到数据库中", user);
    return result;
  }

  // 查询单条数据
  async getMomentById(id) {
    // 使用JSON_ARRAYAGG必须用Group By做一个分组,在navicat里面不报错,但是在mysql2里面会报错
    const statement = `
       SELECT 
        m.id id,
        m.content content,
        m.createAt createTime,
        m.updateAt updateTime,
        JSON_OBJECT('id',u.id,'name',u.name,"avataUrl",u.avatar_url) author,
        (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(JSON_OBJECT("id",c.id,"content",c.content,
        'commentId',c.comment_id,"createTime",c.createAt,
        "user",JSON_OBJECT("id",cu.id,"name",cu.name,"avataUrl",cu.avatar_url))) ,null) FROM comments c LEFT JOIN users cu ON
        c.user_id = cu.id WHERE c.moment_id = m.id ) comments,
         (SELECT JSON_ARRAYAGG(CONCAT("http://localhost:8000/moment/images/",file.filename)) FROM file WHERE m.id = file.moment_id) images,
        IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT("id",l.id,"name",l.name)),NULL  ) labels
      FROM moments m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON l.id = ml.label_id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    try {
      const [result] = await connection.execute(statement, [id]);
      return result[0];
    } catch (error) {
      // 学会打印报错信息排查
      console.log(error);
    }
  }

  // 查询多条数据
  async getMomentList(offset, size) {
    console.log(offset, size);
    const statement = `
    SELECT 
      m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
      JSON_OBJECT('id',u.id,'name',u.name) author,
      (SELECT COUNT(*) FROM comments c WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
       (SELECT JSON_ARRAYAGG(CONCAT("http://localhost:8000/moment/images/",file.filename)) FROM file WHERE m.id = file.moment_id) images
    FROM moments m
    LEFT JOIN users u ON m.user_id = u.id
    LIMIT ?,?;`;
    const [result] = await connection.execute(statement, [offset, size]);
    console.log(result);
    return result;
  }

  // 更新数据
  async update(content, momentId) {
    const statement = `UPDATE moments SET content = ? WHERE id = ?`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  // 删除数据
  async remove(momentId) {
    const statement = `DELETE FROM moments WHERE id = ?`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  // 判断某条动态是否已经和某标签建立关系
  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  // 如果没有，那么则添加关系
  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id,label_id) VALUES (?,?)`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
}
module.exports = new MomentService();
