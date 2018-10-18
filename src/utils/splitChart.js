const splitChart = (text, splitType = '/') => {
  let str = '';
  text.map((item, index) => {
    if (index === text.length - 1) {
      str += item;
    }
    str += `${item}${splitType}`;
  });
  return str;
};

export default splitChart;
