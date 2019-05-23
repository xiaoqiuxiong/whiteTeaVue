export default {
  toMoney: function (money = 0) {
    return parseFloat(money).toFixed(2)
  },
  // 没有时间点
  toDate: function (time) {
    let d = new Date(time * 1000); //根据时间戳生成的时间对象
    let value= (d.getFullYear()) + "-" +
      (d.getMonth() + 1) + "-" +
      (d.getDate());
    return value
  },
  // 有时间点
  toTime: function (time) {
    let d = new Date(time * 1000); //根据时间戳生成的时间对象
    let value= (d.getFullYear()) + "-" +
      (d.getMonth() + 1) + "-" +
      (d.getDate()) + " " +
      (d.getHours()) + ":" +
      (d.getMinutes()) + ":" +
      (d.getSeconds());
    return value
  }
}
