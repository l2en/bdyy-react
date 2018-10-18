// 比较两个日期字符串大小
export function compareDate(dateStr1, dateStr2) {
  const date1 = new Date(Date.parse(dateStr1));
  const date2 = new Date(Date.parse(dateStr2));
  return date1 <= date2;
}

// 日期对象转日期字符串
export function dateToString(date, mode) {
  switch (mode) {
    case 'yyyy-mm-dd':
      return `${date.getFullYear()}-${foo(date.getMonth() + 1)}-${foo(date.getDate())}`;
    case 'yy-mm-dd':
      return `${date
        .getFullYear()
        .toString()
        .substring(2, 4)}-${foo(date.getMonth() + 1)}-${foo(date.getDate())}`;
    case 'yyyy':
      return `${date.getFullYear()}`;
    default:
      return 'wrong mode';
  }
}

// 将日期中的month和date自动补全到两位的函数
function foo(str) {
  const strTemp = `00${str}`;
  return strTemp.substring(strTemp.length - 2, strTemp.length);
}
