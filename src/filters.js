export default {
  toMoney: function(money = 0) {
    return parseFloat(money).toFixed(2);
  },
  // 没有时间点
  toDate: function(time) {
    let d = new Date(time * 1000); //根据时间戳生成的时间对象
    let value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    return value;
  },
  // 有时间点
  toTime: function(time) {
    let d = new Date(time * 1000); //根据时间戳生成的时间对象
    let value =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1 >= 10
        ? d.getMonth() + 1
        : `0${(d.getMonth() + 1).toString()}`) +
      "-" +
      (d.getDate() + 1 >= 10
        ? d.getDate() + 1
        : `0${(d.getDate() + 1).toString()}`) +
      " " +
      (d.getHours() + 1 >= 10
        ? d.getHours() + 1
        : `0${(d.getHours() + 1).toString()}`) +
      ":" +
      (d.getMinutes() + 1 >= 10
        ? d.getMinutes() + 1
        : `0${(d.getMinutes() + 1).toString()}`) +
      ":" +
      (d.getSeconds() + 1 >= 10
        ? d.getSeconds() + 1
        : `0${(d.getSeconds() + 1).toString()}`);
    return value;
  },
  // JS格式化数字（每三位加逗号）
  toThousands: function(number) {
    var number = (number || 0).toString(),
      result = "",
      isDecimals = false,
      last_result = "";
    if (number.indexOf(".") != -1) {
      last_result = `.${number.split(".")[1]}`;
      number = number.split(".")[0];
      isDecimals = true;
    }
    while (number.length > 3) {
      result = "," + number.slice(-3) + result;
      number = number.slice(0, number.length - 3);
    }
    if (number) {
      result = number + result;
    }
    if (isDecimals) {
      return result + last_result;
    } else {
      return result;
    }
  }
};
