const commentService = require("../service/comment.service.js");

class commentController {
  // 发布评论
  async create(ctx, next) {
    //   1.获取参数
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;

    // 2.插入到数据库之中
    const result = await commentService.create(momentId, content, id);
    ctx.body = result;
  }

  // 发布评论的评论
  async reply(ctx, next) {
    //   1.获取参数
    const { momentId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;

    // 2.插入到数据库之中
    const result = await commentService.reply(momentId, content, commentId, id);
    ctx.body = result;
  }

  // 修改评论
  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    // ctx.body = "修改评论" + commentId + content;

    const result = await commentService.update(commentId, content);
    ctx.body = result;
  }

  // 删除评论
  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await commentService.remove(commentId);
    ctx.body = result;
  }

  // 获取评论列表
  async list(ctx,next) {
    const {momentId} = ctx.query;
    const result = await commentService.getCommentsByMomentId(momentId)
    ctx.body = result
  }
}

module.exports = new commentController();
