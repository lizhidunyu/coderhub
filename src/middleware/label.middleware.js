const labelService = require("../service/label.service");

const verifyLabelExists = async (ctx, next) => {
  console.log("verifyLabelExists -- 验证标签是否存在的中间件middleware~");
  // 1.取出要添加的所有标签
  const { labels } = ctx.request.body;
  // 2.判断每一个标签在label表中是否存在
  const newLabels = [];
  for (let name of labels) {
    // 标签名是否已经在数据库中
    const labelResult = await labelService.getLabelByName(name);
    const label = { name };
    if (!labelResult) {
      // 如果还没有出现在标签的数据表中
      // 1.创建标签数据
      const result = await labelService.create(name);
      label.id = result.insertId;
    } else {
      // 如果已经出现标签的数据表中
      // 2.拿到查到的数据中的id
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }
  ctx.labels = newLabels;
  // 将添加到动态的标签的信息（标签名，标签的id）都组装到数组中
  // 添加到ctx.labels属性身上
  console.log(ctx.labels);
  await next();
};

module.exports = { verifyLabelExists };
