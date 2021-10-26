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
    // 配置自动打开页面
    open: true,
    before(app) {
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/'
}
