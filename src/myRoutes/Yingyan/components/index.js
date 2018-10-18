import React, { Component } from 'react';
import { connect } from 'dva';
import request from 'utils/request';

@connect(({ appUser }) => ({
  appUser,
}))
export default class Mockyy extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {

  }
  handleMock = () => {
    let body = new URLSearchParams();
    body.set('ak', 'tdTp6sFx06t2QajPplvjrMBlhF2mpiYC');
    body.set('service_id', 203819);
    body.set('entity_name', 'entity_name');
    body.set('latitude', '30.664397');
    body.set('longitude', '104.072564');
    body.set('loc_time', Math.round(new Date().getTime() / 1000));
    body.set('coord_type_input', 'coord_type_input');
    body.set('speed', '63.09');

    request('http://yingyan.baidu.com/api/v3/track/addpoint', {
      method: 'POST',
      body: body.toString(),
    }).then(resData => {

    }).catch(err => {
      console.log('捕获', err)
    })
  }
  
  render() {
    return (
      <div>
      <button onClick={this.handleMock}>模拟</button>
      </div>
    );
  }
}
