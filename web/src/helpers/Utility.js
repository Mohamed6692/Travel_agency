import moment from "moment";

export const formatToDate = (timestamp) => {
  return moment(timestamp).format("LL");
};

export const formatToTime = (timestamp) => {
  return moment(timestamp).format("h:mm A");
};

export const formatTimeAgo = (timestamp) => {
  return moment(timestamp).fromNow();
};

export const countDown = (EndDate) => {
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  const Today = new Date();
  var distance = EndDate - Today;
  var expired = false;
  if (distance < 0) {
    expired = true;
  }

  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);
  return { days, hours, minutes, seconds, expired };
};
