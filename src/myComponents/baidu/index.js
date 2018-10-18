import React, { Component } from 'react';
import BMap from 'BMap';
import styles from './index.less';

class BaiduMap extends Component {
  static defaulProps = {
    mapSize: {
      width: '800px',
      height: '650px',
    },
    visible: false,
    title: '',
    footer: null,
    closable: true,
    zoom: 11,
    onCancle: () => {},
    onOk: () => {},
  };

  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.showRoutie();
    }, 300);
  }

  showRoutie = () => {
    const { PointArr } = this.props;
    const aimPoints = PointArr.filter(item => item.description);
    const p = Math.ceil(aimPoints.length / 2);
    const map = new BMap.Map('map'); //    创建Map实例
    map.centerAndZoom(new BMap.Point(aimPoints[p].x, aimPoints[p].y), 12);
    map.addControl(new BMap.MapTypeControl()); //    添加地图类型控件
    map.setCurrentCity('成都'); //    设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //    开启鼠标滚轮缩放
    const pointList = [];
    for (let i = 0; i < aimPoints.length; i += 1) {
      if (aimPoints[i].type === 1) {
        const startPoint = new BMap.Point(aimPoints[i].x, aimPoints[i].y);
        startPoint.description = aimPoints[i].description || '无';
        pointList[0] = startPoint;
      }

      if (aimPoints[i].type === 3) {
        const viaPoint = new BMap.Point(aimPoints[i].x, aimPoints[i].y);
        viaPoint.description = aimPoints[i].description || '无';
        pointList.push(viaPoint);
      }
    }

    if (pointList.length === aimPoints.length - 1) {
      for (let i = 0; i < aimPoints.length; i += 1) {
        if (aimPoints[i].type === 2) {
          const endPoint = new BMap.Point(aimPoints[i].x, aimPoints[i].y);
          endPoint.description = aimPoints[i].description || '无';
          pointList.push(endPoint);
        }
      }
    }

    for (let c = 0; c < pointList.length; c += 1) {
      const marker = new BMap.Marker(pointList[c]);
      map.addOverlay(marker);
      // 将途经点按顺序添加到地图上
      const label = new BMap.Label(pointList[c].description, { offset: new BMap.Size(20, -10) });
      marker.setLabel(label);
    }

    const group = Math.floor(pointList.length / 11);
    const mode = pointList.length % 11;
    const driving = new BMap.DrivingRoute(map, {
      onSearchComplete: () => {
        if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
          const plan = driving.getResults().getPlan(0);
          const num = plan.getNumRoutes();
          for (let j = 0; j < num; j += 1) {
            const pts = plan.getRoute(j).getPath(); // 通过驾车实例，获得一系列点的数组
            const polyline = new BMap.Polyline(pts);
            map.addOverlay(polyline);
          }
        }
      },
    });
    for (let i = 0; i < group; i += 1) {
      const waypoints = pointList.slice(i * 11 + 1, (i + 1) * 11);
      driving.search(pointList[i * 11], pointList[(i + 1) * 11 - 1], { waypoints }); // waypoints表示途经点
    }
    if (mode !== 0) {
      const waypoints = pointList.slice(group * 11, pointList.length - 1); // 多出的一段单独进行search
      driving.search(pointList[group * 11], pointList[pointList.length - 1], {
        waypoints,
      });
    }
  };

  addMarker = (map, point, name) => {
    const marker = new BMap.Marker(point);
    const label = new BMap.Label(name, {
      offset: new BMap.Size(20, -10),
    });
    marker.setLabel(label);
    map.addOverlay(marker);
  };

  render() {
    const { onClose } = this.props;
    return (
      <div className={styles.show}>
        <span className={styles.close} onClick={onClose}>
          x
        </span>
        <div className={styles.bmap} id="map" />
      </div>
    );
  }
}

export default BaiduMap;
