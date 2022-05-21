const fs = require("fs");
const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");
const { PICTURE_PATH } = require("../constants/file-path");

class momentController {
  // 创建动态
  async create(ctx, next) {
    // 1.获取数据(user_id,content,)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 2.将数据插入到数据库之中
    const result = await momentService.create(userId, content);

    ctx.body = result;
  }

  // 查看单条动态
  async detail(ctx, next) {
    // 1.获取动态的详情
    const momentId = ctx.params.momentId;

    // 2.根据id去查询这条数据
    const result = await momentService.getMomentById(momentId);
    ctx.body = result;
  }

  // 查看多条动态
  async list(ctx, next) {
    // 查看多条数据，无法一次查询完，需要分页查询
    const { offset, size } = ctx.query;
    // 去数据库查询数据
    const result = await momentService.getMomentList(offset, size);
    ctx.body = result;
  }

  // 修改动态的信息
  async update(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    const content = ctx.request.body.content;
    const { id } = ctx.user;
    // 2.修改内容
    const result = await momentService.update(content, momentId);

    ctx.body = result;
  }

  // 删除动态的信息
  async remove(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    // 2.修改内容
    const result = await momentService.remove(momentId);
    ctx.body = result;
  }

  // 添加标签
  // 将标签信息与动态信息对应起来放到关系表中
  async addLabels(ctx, next) {
    // 1.获取标签列表和动态momentId
    const { labels } = ctx;
    const { momentId } = ctx.params;

    // 2.添加所有的标签
    for (let label of labels) {
      // 2.1 判断标签是否和动态有过关系了
      const isExist = await momentService.hasLabel(momentId, label.id);
      // 如果改动态还没有添加该条标签
      if (!isExist) {
        // 返回false,表示没有存在，需要添加新的数据
        const result = await momentService.addLabel(momentId, label.id);
      }
    }
    ctx.body = "添加标签成功~~~";
  }

  async fileInfo(ctx, next) {
    const { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    // 根据前端传递过来的参数，返回不同格式大小的图片
    const { type } = ctx.query;
    if (type) {
      const types = ["small", "middle", "large"];
      if (types.some((item) => item.type === type)) {
        filename = filename + "-" + type;
      }
    }
    // 设置响应的类型
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new momentController();
