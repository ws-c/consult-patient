declare module 'id-validator' {
  // 默认导出的，class是es6的类语法，对应 es5 的构造函数
  export default class {
    // es6 类中的方法，对应 es5 的原型方法
    isValid(id: tring): boolean
    getInfo(id: tring): {
      sex: number
    }
  }
}
