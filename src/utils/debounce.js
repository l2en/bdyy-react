
// const debounce =(fn, delay) => {
//   console.log('fn',fn)
//   let timer = null;
//   return function() {
//     let context = this;
//     let args = arguments;

//     clearTimeout(timer);
//     timer = setTimeout(function() {
//       fn.apply(context, args);
//     }, delay);
//   }
// }

const debounce = (fn, delay) => {
  var lastTime = 0
  let context = this;
  let args = arguments;
  return function () {
    var nowTime = new Date().getTime();
    if (nowTime - lastTime > delay) {
      console.log(1111)
      fn.apply(context, args);
      lastTime = nowTime;
    }
  }
}

export default debounce;
