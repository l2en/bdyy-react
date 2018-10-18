/**
 * 0 成功且有数据
 * 1 成功没数据
 * 6 新建时数据重复
 * 500 服务器无响应
 */
import { Message } from 'antd';

const handleResData = (response, callback, msg = '') => {
  let resData = [];
  switch (Number(response.code)) {
    case 0:
      resData = response.data;
      break;
    case 1:
      msg ? Message.info(msg) : Message.success('暂无数据');
      resData = [];
      break;
    case 6:
      msg ? Message.success(msg) : Message.success('数据已存在');
      resData = response.data;
      break;
    case 500:
      msg ? Message.success(msg) : Message.error('服务器暂无响应');
      resData = [];
      break;
    default:
      null;
      break;
  }
};
export { handleResData };
