const labelService = require("../service/label.service");

class labelController {
  async create(ctx, next) {
    const { name } = ctx.request.body;
    const result = await labelService.create(name);
    ctx.body = result;
  }

  // 展示标签的接口
  async list(ctx, next) {
    const { limit, offset } = ctx.query;
    const result = await labelService.getLabels(limit, offset);
    ctx.body = result;
  }
}

module.exports = new labelController();
