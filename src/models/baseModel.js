class BaseModel {
  /**
   * 子类构造传入对应的Model类
   * @param Model
   */
  constructor(model) {
    this.Model = model;
  }

  /**
   * 获取当前model
   */
  getModel() {
    return this.Model;
  }

  /**
   * 使用 Model 的 静态方法 create() 添加 doc
   *
   * @param obj 构造实体的对象
   * @returns {Promise}
   */
  create(obj) {
    return new Promise((resolve, reject) => {
      let entity = new this.Model(obj);
      this.Model.create(entity, (error, result) => {
        if (error) {
          console.log('create error --> ', error);
          reject(error);
        } else {
          console.log('create result --> ', result);
          resolve(result);
        }
      });
    });
  }

  /**
   * 使用 Model save() 添加 doc
   *
   * @param obj 构造实体的对象
   * @returns {Promise}
   */
  save(obj) {
    return new Promise((resolve, reject) => {
      let entity = new this.Model(obj);
      entity.save((error, result) => {
        if (error) {
          console.log('save error --> ', error);
          reject(error);
        } else {
          console.log('save result --> ', result);
          resolve(result);
        }
      });
    });
  }

  /**
   * 查询所有符合条件 docs
   *
   * @param condition 查找条件
   * @param constraints
   * @returns {Promise}
   */
  findAll(condition, constraints) {
    return new Promise((resolve, reject) => {
      this.Model.find(condition, constraints ? constraints : null, (error, results) => {
        if (error) {
          console.log('findAll error --> ', error);
          reject(error);
        } else {
          console.log('findAll results --> ', results);
          resolve(results);
        }
      });
    });
  }

  /**
   * 查找符合条件的第一条 doc
   *
   * @param condition
   * @param constraints
   * @returns {Promise}
   */
  findOne(condition, constraints) {
    return new Promise((resolve, reject) => {
      this.Model.findOne(condition, constraints ? constraints : null, (error, result) => {
        if (error) {
          console.log('findOne error --> ', error);
          reject(error);
        } else {
          console.log('findOne result --> ', result);
          resolve(result);
        }
      });
    });
  }

  /**
   * 查找排序之后的第一条
   *
   * @param condition
   * @param orderColumn
   * @param orderType
   * @returns {Promise}
   */
  findOneByOrder(condition, orderColumn, orderType) {
    return new Promise((resolve, reject) => {
      this.Model.findOne(condition)
        .sort({[orderColumn]: orderType})
        .exec(function(error, record) {
          if (error) {
            console.log('findOneByOrder error --> ', error);
            reject(error);
          } else {
            console.log('findOneByOrder record --> ', record);
            resolve(record); 
          }
        });
    });
  }

  /**
   * 更新 docs
   *
   * @param condition 查找条件
   * @param updater 更新操作
   * @returns {Promise}
   */
  update(condition, updater) {
    return new Promise((resolve, reject) => {
      this.Model.update(condition, updater, (error, results) => {
        if (error) {
          console.log('update error --> ', error);
          reject(error);
        } else {
          console.log('update results --> ', results);
          resolve(results);
        }
      });
    });
  }

  /**
   * 移除 doc
   *
   * @param condition 查找条件
   * @returns {Promise}
   */
  deleteOne(condition) {
    return new Promise((resolve, reject) => {
      this.Model.deleteOne(condition, (error, result) => {
        if (error) {
            console.log('deleteOne error --> ', error);
            reject(error);
        } else {
          console.log('deleteOne result --> ', result);
          resolve(result);
        }
      });
    });
  }
  
  /**
   * 移除 doc
   *
   * @param condition 查找条件
   * @returns {Promise}
   */
  deleteMany(condition) {
    return new Promise((resolve, reject) => {
      this.Model.deleteMany(condition, (error, result) => {
        if (error) {
            console.log('deleteMany error --> ', error);
            reject(error);
        } else {
          console.log('deleteMany result --> ', result);
          resolve(result);
        }
      });
    });
  }
  
  /**
   * 获取数量 doc
   *
   * @param condition 查找条件
   * @returns {Promise}
   */
  count(condition) {
    return new Promise((resolve, reject) => {
      this.Model.count(condition, (error, result) => {
        if (error) {
          console.log('count error --> ', error);
        } else {
          console.log('count result --> ', result);
          resolve(result);
        }
      })
    })
  }
}

module.exports = BaseModel;
