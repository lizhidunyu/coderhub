const config = require("./app/config.js");
require("./app/database");
const app = require("./app/index.js");
app.listen(config.APP_PORT, () => {
  console.log("服务器启动~");
});
// app.listen(8000, () => {
//   console.log("服务器启动!!!");
// });
