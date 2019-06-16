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
  toTime: function(timestamp) {
    let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "-";
    let M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    let D = date.getDate() + " ";
    let h = date.getHours();
    h = h < 10 ? `0${h}` : h;
    let m = date.getMinutes();
    m = m < 10 ? `0${m}` : m;
    let s = date.getSeconds();
    s = s < 10 ? `0${s}` : s;
    return Y + M + D + h + ":" + m + ":" + s;
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
