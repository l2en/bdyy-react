import React, { Component } from 'react';
import BMap from 'BMap';
import { Message } from 'antd';
import styles from './index.less';
import start from 'assets/start.png';
import via from 'assets/via.png';
import end from 'assets/end.png';

let newMapLine_tempArr = [];

class NewMapLine extends Component {
  static defaulProps = {
    title: '',
    footer: null,
    closable: true,
    zoom: 11,
    onCancle: () => {},
    onOk: () => {},
    onCloseMask: () => {},
  };

  state = {
    instantiationMap: {},
    addType: '',
    site: [],
    showRemark: false,
    isChecked: false,
    distance: '',
  };

  componentDidMount() {
    newMapLine_tempArr = [];
    setTimeout(() => {
      const map = new BMap.Map('lineSetMap'); //  创建Map实例
      this.setState({
        instantiationMap: map,
      });
      map.addControl(new BMap.MapTypeControl()); //  添加地图类型控件
      map.setCurrentCity('北京'); //  设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //  开启鼠标滚轮缩放
      map.centerAndZoom(new BMap.Point(104.072086, 30.663483), 8); //  初始化地图,设置中心点坐标和地图级别
      this.removeAllOverlays();
    }, 300);
  }

  mapEvent = e => {
    const { instantiationMap, addType, site } = this.state;
    const map = instantiationMap;
    const _this = this;
    let myIcon;
    map.removeEventListener('click', this.mapEvent);
    if (addType === 1) {
      myIcon = new BMap.Icon(start, new BMap.Size(30, 30));
      for (let i = 0; i < site.length; i += 1) {
        if (site[i].type === 1) {
          Message.warning('已存在起点');
          map.removeEventListener('click', this.mapEvent);
          return;
        }
      }
    }
    if (addType === 3) {
      myIcon = new BMap.Icon(via, new BMap.Size(30, 30));
      let viaNum = 0;
      for (let i = 0; i < site.length; i += 1) {
        if (site[i].type === 3) {
          viaNum++;
        }
      }
      if (viaNum >= 5) {
        Message.warning('已存在5个途径点');
        map.removeEventListener('click', this.mapEvent);
        return;
      }
    }
    if (addType === 2) {
      myIcon = new BMap.Icon(end, new BMap.Size(30, 30));
      for (let i = 0; i < site.length; i += 1) {
        if (site[i].type === 2) {
          Message.warning('已存在终点');
          map.removeEventListener('click', this.mapEvent);
          return;
        }
      }
    }

    const point = new BMap.Point(e.point.lng, e.point.lat);
    const coor = {};
    coor.x = e.point.lng;
    coor.y = e.point.lat;
    coor.type = addType;
    coor.description = '';
    newMapLine_tempArr.push(coor);
    this.setState({ site: newMapLine_tempArr });
    const removeMarker = function(e, ee, marker) {
      map.removeOverlay(marker);
      for (let x = 0; x < site.length; x += 1) {
        if (marker.point.lat === site[x].y && marker.point.lng === site[x].x) {
          const filterSite = site.slice(x, 1);
          newMapLine_tempArr = filterSite;
          _this.setState({ site: filterSite });
        }
      }
    };

    //  创建右键菜单
    const markerMenu = new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除', removeMarker.bind(marker)));

    //  添加点
    const marker = new BMap.Marker(point, { icon: myIcon });
    map.addOverlay(marker);

    //  绑定删除事件到右键
    marker.addContextMenu(markerMenu);
    this.setState({
      showRemark: true,
    });
    map.removeEventListener('click', this.mapEvent);
  };

  //  获取起点
  handleStartPoint = () => {
    const { instantiationMap } = this.state;
    const map = instantiationMap;
    Message.info('请选择1个起点');
    this.setState(
      {
        addType: 1,
      },
      () => {
        map.addEventListener('click', this.mapEvent);
      }
    );
  };

  //  新建关键途经点
  handleViaPoint = () => {
    const { instantiationMap } = this.state;
    const map = instantiationMap;
    Message.info('请选择1-5个关键途经点');
    this.setState(
      {
        addType: 3,
      },
      () => {
        map.addEventListener('click', this.mapEvent);
      }
    );
  };

  //  新建终点
  handleEndPoint = () => {
    const { instantiationMap } = this.state;
    const map = instantiationMap;
    Message.info('请选择1个终点');
    this.setState(
      {
        addType: 2,
      },
      () => {
        map.addEventListener('click', this.mapEvent);
      }
    );
  };

  componentWillUnmount() {
    const { instantiationMap } = this.state;
    const map = instantiationMap;
    this.removeAllOverlays();
    map.removeEventListener('click', this.mapEvent);
  }

  //  清空所有标注点
  removeAllOverlays = () => {
    const { instantiationMap } = this.state;
    const map = instantiationMap;
    const overlays = map.getOverlays();
    for (let i = 0; i < overlays.length; i += 1) {
      map.removeOverlay(overlays[i]);
    }
  };

  //  备注添加
  enterEvent = e => {
    if (e.keyCode === 13) {
      newMapLine_tempArr[newMapLine_tempArr.length - 1].description = e.target.value;
      this.setState({
        site: newMapLine_tempArr,
      });
      e.target.value = '';
    }
  };

  //  查看规划路线
  showRoutie = () => {
    this.setState({
      isChecked: true,
    });
    const { instantiationMap, site } = this.state;
    const map = instantiationMap;
    const pointList = [];
    for (let i = 0; i < site.length; i += 1) {
      if (site[i].type === 1) {
        const point = new BMap.Point(site[i].x, site[i].y);
        point.description = site[i].description || '无';
        pointList.push(point);
      }
    }
    for (let i = 0; i < site.length; i += 1) {
      if (site[i].type !== 1 && site[i].type !== 2) {
        const point = new BMap.Point(site[i].x, site[i].y);
        point.description = site[i].description || '无';
        pointList.push(point);
      }
    }
    for (let i = 0; i < site.length; i += 1) {
      if (site[i].type === 2) {
        const point = new BMap.Point(site[i].x, site[i].y);
        point.description = site[i].description || '无';
        pointList.push(point);
      }
    }

    map.addControl(new BMap.MapTypeControl()); //    添加地图类型控件
    map.setCurrentCity('成都'); //    设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //    开启鼠标滚轮缩放

    const p = Math.ceil(site.length / 2);
    map.centerAndZoom(new BMap.Point(site[p].x, site[p].y), 8);

    // 循环显示点对象
    for (let c = 0; c < pointList.length; c += 1) {
      const marker = new BMap.Marker(pointList[c].description);
      map.addOverlay(marker);
      // 将途经点按顺序添加到地图上
      let label = new BMap.Label(c + 1, { offset: new BMap.Size(20, -10) });
      marker.setLabel(label);
    }

    const group = Math.floor(pointList.length / 11);
    const mode = pointList.length % 11;
    const allPts = [];
    const driving = new BMap.DrivingRoute(map, {
      onSearchComplete: results => {
        if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
          const distance = results.getPlan(0).getDistance(true);
          this.setState({ distance });
          const plan = driving.getResults().getPlan(0);
          const num = plan.getNumRoutes();
          for (let j = 0; j < num; j += 1) {
            const pts = plan.getRoute(j).getPath(); // 通过驾车实例，获得一系列点的数组
            for (let x = 0; x < pts.length; x += 1) {
              allPts.push(pts[x]);
            }
            const polyline = new BMap.Polyline(pts);
            map.addOverlay(polyline);
          }
          const step = Math.floor(allPts.length / 93);
          for (let v = 0; v < 93; v += 1) {
            const tmpObj = {};
            tmpObj.x = allPts[v * step].lng;
            tmpObj.y = allPts[v * step].lat;
            tmpObj.type = 4;
            newMapLine_tempArr.push(tmpObj);
          }
        }
      },
    });

    //  分段绘制路线（百度限制途经点最多为10个，这里是预先做兼容！）
    for (let i = 0; i < group; i += 1) {
      const waypoints = pointList.slice(i * 11 + 1, (i + 1) * 11);
      driving.search(pointList[i * 11], pointList[(i + 1) * 11 - 1], { waypoints: waypoints }); // waypoints表示途经点
    }

    // 多出的一段单独进行search
    if (mode !== 0) {
      const waypoints = pointList.slice(group * 11, pointList.length - 1);
      driving.search(pointList[group * 11], pointList[pointList.length - 1], {
        waypoints: waypoints,
      });
    }
  };

  //  添加路线点
  onOk = () => {
    const { isChecked, distance } = this.state;
    if (isChecked) {
      const { onOk } = this.props;
      onOk(newMapLine_tempArr, distance);
    } else {
      Message.info('请先确认路线无误！');
    }
  };

  render() {
    const { onCloseMask } = this.props;
    const { showRemark, site } = this.state;
    return (
      <div className={styles.show}>
        <span className={styles.close} onClick={onCloseMask}>
          x
        </span>
        <div className={styles.newMapWrapper}>
          <div id="lineSetMap" className={styles.map} />
          <div className={styles.rightBtn}>
            <button type="button" onClick={this.handleStartPoint}>
              选择起点
            </button>
            <button type="button" onClick={this.handleViaPoint}>
              选择关键途经点(1-5个)
            </button>
            <button type="button" onClick={this.handleEndPoint}>
              选择终点
            </button>
            {showRemark ? (
              <p>
                备注：<input
                  className={styles.addInput}
                  onKeyDown={this.enterEvent}
                  style={{ marginBottom: '30px' }}
                  placeholder="请输入备注"
                  type="text"
                />
              </p>
            ) : null}
            {site.filter(item => item.type === 1) ? (
              site.filter(item => item.type === 1).map((item, index) => (
                <p key={item.description}>
                  起点：<span>{item.description}</span>
                </p>
              ))
            ) : (
              <p>
                起点：<span />
              </p>
            )}

            {site.filter(item => item.type === 3) ? (
              site.filter(item => item.type === 3).map((item, index) => (
                <p key={item.description}>
                  途经点{index + 1}：<span>{item.description}</span>
                </p>
              ))
            ) : (
              <p>
                途经点：<span />
              </p>
            )}
            {site.filter(item => item.type === 2) ? (
              site.filter(item => item.type === 2).map((item, index) => (
                <p key={item.description}>
                  终点：<span>{item.description}</span>
                </p>
              ))
            ) : (
              <p>
                终点：<span />
              </p>
            )}
            {site.length >= 2 ? (
              <button type="button" className={styles.showRoutie} onClick={this.showRoutie}>
                查看路线
              </button>
            ) : null}

            <div className={styles.footer}>
              <button type="button" className={styles.footerSure} onClick={this.onOk}>
                确认
              </button>
              <button type="button" className={styles.footerCancle} onClick={onCloseMask}>
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewMapLine;
