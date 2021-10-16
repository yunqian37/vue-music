const registerRouter = require('./backend/router')

module.exports = {
  css: {
    loaderOptions:{
      sass: {
        // 全局引入变量和mixin node-sass版本5.0.0搭配sass-loader版本10.1.0否则会报错
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  // 代理设置
  devServer: {
    // // 配置自动打开页面
    // port: 8080,
    // host: '192.168.3.21',
    open: true,
    before(app) {
      registerRouter(app)
    }
  }
}
