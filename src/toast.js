import { Toast } from "vant";

export function toast(message, duration = 1000, collback = function(){}) {
  Toast({
    message: `共信新零售：${message}`,
    duration,
    collback: collback()
  });
}
export function toastSuccess(message, duration = 1000, collback = function(){}) {
  Toast({
    message,
    duration,
    collback: collback()
  });
}
