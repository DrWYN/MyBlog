const UserModel = require('../models/user');
const User = new UserModel();

// 新增用户
exports.createUser = (user) => {
  return User.create(user);
}

// 通过用户名获取用户信息
exports.getUserByName = (name) => {
  return User.findOne({name: name});
}

exports.delUserByName = (name) => {
  return User.deleteOne({name: name});
}
