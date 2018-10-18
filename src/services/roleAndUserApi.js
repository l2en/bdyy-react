import request from '../utils/request';
// 获取全部角色(不带权限)
export async function getRoleList() {
  return request(`/JYLogisticsClient/api/role/allInfo`, {
    method: 'GET',
  });
}

// 获取用户列表
export async function getUserList(params) {
  return request(`/JYLogisticsClient/api/user/allInfo`, {
    method: 'POST',
    body: params,
  });
}

// 根据手机号查询单个用户
export async function getUser(params) {
  return request(`/JYLogisticsClient/api/user/info`, {
    method: 'POST',
    body: params,
  });
}

// 授予本公司用户一个角色
export async function bindUserRole(params) {
  return request(`/JYLogisticsClient/api/role/bindUserRole`, {
    method: 'POST',
    body: params,
  });
}

// 解除角色
export async function terminate(params) {
  return request(`/JYLogisticsClient/api/role/terminate`, {
    method: 'POST',
    body: params,
  });
}


// 解除角色
export async function bindOutsideUser(params) {
  return request(`/JYLogisticsClient/api/role/bindOutsideUser`, {
    method: 'POST',
    body: params,
  });
}