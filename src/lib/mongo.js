const config = require('config-lite')(__dirname);
const mongoose = require('mongoose');

// debug 模式
// mongoose.set('debug', true);

// 使用Node自带的Promise代替mongoose的Promise
mongoose.Promise = global.Promise;

 // 配置 plugin。此处配置 plugin 的话是全局配置，推荐在 每个 Model 内 自己定义
// mongoose.plugin(require('./plugin').updatedAt);

  /**
   * 配置 MongoDb options
   */
 function getMongoOptions() {
    let options = {};
    if (config.mongodb.user) options.user = config.mongodb.user;
    if (config.mongodb.pass) options.pass = config.mongodb.pass;
    return options;
}

/**
 * 创建 Mongo 连接，内部维护了一个连接池，全局共享
 */
mongoose.connect(config.mongodb.uri, getMongoOptions());

const mongoClient = mongoose.connection;

/**
 * Mongo 连接成功回调
 */
mongoClient.on('connected', function () {
    console.log('Mongoose connected to ' + config.mongodb.uri);
});

/**
 * Mongo 连接失败回调
 */
mongoClient.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * Mongo 关闭连接回调
 */
mongoClient.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

/**
 * 关闭 Mongo 连接
 */
function close() {
    mongoClient.close();
}

module.exports = {
    mongoClient: mongoClient,
    close: close,
};

