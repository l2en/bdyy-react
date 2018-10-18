// =============================  轨迹
/**
 * 选中某个轨迹
 * 
 * @param {any} name
 */
onSelecttrack = (name) => {
    if (!name || track.trackSearching === 1) return;
    track.trackSearching = 1;
    var tempTimeArr = [];
    var partTime = Math.floor((track.end_time - track.start_time) / 6);

    track.trackRoutePointData = [];
    track.trackRouteSortData = [];
    track.trackRouteNoZero = [];
    track.selectTrack = name;

    for (var i = 0; i < 6; i++) {
        tempTimeArr[i] = {
            start_time: track.start_time + i * partTime,
            end_time: track.start_time + (i + 1) * partTime - 1,
            index: i
        }
    }
    tempTimeArr[5].end_time = track.end_time;
    var params = {
        'entity_name': track.selectTrack,
        'service_id': service_id,
        'ak': ak,
        'simple_return': 0,
        'page_size': 5000,
        'is_processed': track.trackProcess.is_processed,
        'process_option': 'need_denoise=' + track.trackProcess.need_denoise + ',' +
            'need_vacuate=' + track.trackProcess.need_vacuate + ',' +
            'need_mapmatch=' + track.trackProcess.need_mapmatch + ',' +
            'transport_mode=' + track.transport_mode[track.trackProcess.transport_mode - 1]
    };
    var count = 1;
    tempTimeArr.map(function (item) {
        params.start_time = item.start_time;
        params.end_time = item.end_time;
        reTrackRoute(params, 1, count++);
        reTrackRoute(params, 2, count++);
    });
}

/**
* 重新绘制路线
* 
* @param {any} paramsr
* @param {any} page_index
*/
reTrackRoute = (paramsr, page_index, count) => {
    paramsr.page_index = page_index;
    $.ajax({
        type: "GET",
        url: url + "/track/gettrack",
        dataType: 'jsonp',
        data: paramsr,
        success: function (data) {
            console.log('====>>>>>>>>获取地点数据', data)
            track.trackRouteDataCount = track.trackRouteDataCount + 1;
            if (data.status === 0) {
                track.trackRouteSortData.push({ index: count, track: data });
                if (track.trackRouteDataCount === 12) {
                    track.trackRouteDataCount = 0;
                    track.trackRouteSortData.sort(function (a, b) { return a.index - b.index });

                    for (var i = 0; i < 12; i++) {
                        track.trackRoutePointData = track.trackRoutePointData.concat(track.trackRouteSortData[i].track.points);
                    }
                    track.trackRoutePointData.map(function (item) {
                        if (item.longitude > 1 && item.latitude > 1) {
                            track.trackRouteNoZero.push(item);
                        }
                    });
                    draw.first = true;
                    track.trackSearching = 0;
                    drawTrack(track.trackRouteNoZero);
                    listenTrackRoute(track.trackRouteNoZero);
                }
            }
            if (track.trackRouteDataCount === 12) {
                track.trackRouteDataCount = 0;
                track.trackSearching = 0;

            }
        },
        error: function () {
            console.log('获取绘制路线失败');
        }
    });
}

/**
* 绘制轨迹线路
* 
* @param {Array} data 轨迹数据 可选
* @param {number} starttime 时间区间起点 可选
* @param {number} endtime 时间区间终点 可选
*/
drawTrack = (data, starttime, endtime) => {
    if (!data) {
        data = track.trackRouteNoZero;
    }
    var totalPoints = [];
    var viewportPoints = [];

    if (data.length === 0) return;
    if (!starttime) starttime = data[0].loc_time;
    if (!endtime) endtime = data[data.length - 1].loc_time;
    draw.starttime = starttime;
    draw.endtime = endtime;

    for (var i = 0; i < data.length; i++) {
        if (data[i].loc_time >= starttime && data[i].loc_time <= endtime) {
            var tempPoint = new BMap.Point(data[i].longitude, data[i].latitude);
            tempPoint.speed = data[i].speed ? data[i].speed : 0;
            tempPoint.loc_time = data[i].loc_time;
            tempPoint.height = data[i].height || 0;
            tempPoint.radius = data[i].radius;
            tempPoint.print = track.selectTrack;
            tempPoint.printTime = commonfun.getLocalTime(data[i].loc_time);
            tempPoint.printSpeed = commonfun.getSpeed(data[i].speed);
            tempPoint.lnglat = data[i].longitude.toFixed(2) + ',' + data[i].latitude.toFixed(2);
            totalPoints.push(tempPoint);
        }
    }
    draw.totalPoints = totalPoints;
    if (draw.first) {
        map.setViewport(totalPoints, { margins: [80, 0, 0, 200] });
    }


    if (totalPoints.length > 0) {
        if (typeof (canvasLayer) !== 'undefined' || typeof (canvasLayerBack) !== 'undefined' || typeof (CanvasLayerPointer) !== 'undefined') {
            map.removeOverlay(CanvasLayerPointer);
            map.removeOverlay(canvasLayer);
            map.removeOverlay(canvasLayerBack);

        }
        window.canvasLayerBack = new CanvasLayer({
            map: map,
            update: updateBack
        });
        window.canvasLayer = new CanvasLayer({
            map: map,
            update: update
        });
        window.CanvasLayerPointer = new CanvasLayer({
            map: map,
            update: updatePointer
        });
    }

    mapControl.removeBehaviorOverlay();
    onBehavioranalysis();
    onGetstaypoint();

    if (typeof (pointCollection) !== 'undefined') {
        map.removeOverlay(pointCollection);
    }
    var options = {
        size: BMAP_POINT_SIZE_HUGE,
        shape: BMAP_POINT_SHAPE_CIRCLE,
        color: 'rgba(0, 0, 0, 0)'
    };
    window.pointCollection = new BMap.PointCollection(totalPoints, options);  // 初始化PointCollection
    pointCollection.addEventListener('mouseover', function (e) {
        mapControl.addTrackPointOverlay(e.point, 'trackpointOverlay');
    });
    pointCollection.addEventListener('mouseout', function (e) {
        mapControl.removeTrackPointOverlay('trackpointOverlay');
    });
    pointCollection.addEventListener('click', function (e) {
        mapControl.removeTrackInfoBox();
        onGetaddress(e.point);
        mapControl.removeTrackPointOverlay('trackpointonOverlay');
        mapControl.addTrackPointOverlay(e.point, 'trackpointonOverlay');
    });
    map.addOverlay(pointCollection);  // 添加Overlay
}

/**
* 绘制时间轴
*
* @param {data} 轨迹数据
*/
listenTrackRoute = (data) => {
    // this.initCaliper();
    if (data.length === 0) return;
    var timePart = [{}];
    var pxPart = [{}];
    var j = 0;
    var date = new Date(data[0].loc_time * 1000);
    timeline.initTimeStamp = data[0].loc_time - (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());
    timePart[j].start_time = data[0].loc_time;
    pxPart[j].start_time = getPxByTime(data[0].loc_time);
    for (var i = 0; i < data.length - 1; i++) {
        if (data[i + 1].loc_time - data[i].loc_time <= 5 * 60) {
            timePart[j].end_time = data[i + 1].loc_time;
            pxPart[j].end_time = getPxByTime(data[i + 1].loc_time);
        } else {
            j++;
            timePart[j] = {};
            timePart[j].start_time = data[i + 1].loc_time;
            pxPart[j] = {};
            pxPart[j].start_time = getPxByTime(data[i + 1].loc_time);
        }
    }

    timeline.dataPart = pxPart;
    timeline.progress = pxPart[0].start_time - 0;
    timeline.currentProgress = pxPart[0].start_time - 0;
    timeline.initMouseX = $timelineProgress.offset().left + 20;
    timeline.currentPageX = $timelineProgress.offset().left + 20;
    $timelineProgress.css('left', timeline.progress);
    $runPart.css({ 'left': pxPart[0].start_time + 'px', 'width': pxPart[0].end_time - pxPart[0].start_time + 'px' });

    if (typeof (canvasLayerRunning) != "undefined") {
        map.removeOverlay(canvasLayerRunning);
        canvasLayerRunning = undefined;
    }
    setRunningPointByProgress(pxPart[0].start_time - 0);
}

/* behavioranalysis，驾驶分析*/
onBehavioranalysis = () => {
    if (track.selectTrack === '' || track.analysisbehaviorSearching === 1) return;
    track.analysisbehaviorSearching = 1;
    var entity_name = track.selectTrack;
    var tempTimeArr = [];
    track.trackBehaviorSortData = [];
    track.trackBehaviorPointData = {
        harsh_acceleration: [],
        harsh_breaking: [],
        harsh_steering: [],
        speeding: []
    };
    var partTime = Math.floor((track.end_time - track.start_time) / 6);
    for (var i = 0; i < 6; i++) {
        tempTimeArr[i] = {
            start_time: track.start_time + i * partTime,
            end_time: track.start_time + (i + 1) * partTime - 1,
            index: i
        }
    }
    tempTimeArr[5].end_time = track.end_time;
    var params = {
        'entity_name': track.selectTrack,
        'service_id': service_id,
        'ak': ak
    };
    var count = 1;
    var reBehavior = function (paramsr) {
        var newParams = {
            'service_id': paramsr.service_id,
            'ak': paramsr.ak,
            'timeStamp': new Date().getTime(),
            'entity_name': paramsr.entity_name,
            'start_time': paramsr.start_time,
            'end_time': paramsr.end_time,
            'process_option': 'need_denoise=' + track.trackProcess.need_denoise + ','
                + 'need_vacuate=' + track.trackProcess.need_vacuate + ','
                + 'need_mapmatch=' + track.trackProcess.need_mapmatch + ','
                + 'transport_mode=' + track.transport_mode[track.trackProcess.transport_mode - 1]
        };
        var search = function (paramsearch, counta) {
            $.ajax({
                type: "GET",
                url: url3 + "/analysis/drivingbehavior",
                dataType: 'jsonp',
                data: paramsearch,
                success: function (data) {
                    if (data.status === 0) {
                        track.trackBehaviorSortData.push({ index: counta, data: data });
                        if (++track.trackBehaviorDataCount === 6) {
                            track.trackBehaviorDataCount = 0;
                            track.trackBehaviorSortData.sort(function (a, b) { return a.index - b.index });

                            for (var i = 0; i < 6; i++) {
                                track.trackBehaviorPointData.harsh_acceleration = track.trackBehaviorPointData.harsh_acceleration.concat(
                                    track.trackBehaviorSortData[i].data.harsh_acceleration
                                );
                                track.trackBehaviorPointData.harsh_breaking = track.trackBehaviorPointData.harsh_breaking.concat(
                                    track.trackBehaviorSortData[i].data.harsh_breaking
                                );
                                track.trackBehaviorPointData.harsh_steering = track.trackBehaviorPointData.harsh_steering.concat(
                                    track.trackBehaviorSortData[i].data.harsh_steering
                                );
                                track.trackBehaviorPointData.speeding = track.trackBehaviorPointData.speeding.concat(
                                    track.trackBehaviorSortData[i].data.speeding
                                );
                            }
                            drawAnalysisBehavior(track.trackBehaviorPointData);
                            track.analysisbehaviorSearching = 0;
                        }
                    }
                },
                error: function () {
                    console.log('获取单个实体的轨迹里程驾驶分析失败');
                }
            });
        };
        search(newParams, count++);
    };
    tempTimeArr.map(function (item) {
        params.start_time = item.start_time;
        params.end_time = item.end_time;
        reBehavior(params);
    });
}

/**
   * getstaypoint，获取停留点
   *
   */
onGetstaypoint = () => {
    if (track.selectTrack === '' || track.staypointSearching === 1) return;
    track.staypointSearching = 1;
    var entity_name = track.selectTrack;
    var tempTimeArr = [];
    track.trackStayRouteSortData = [];
    track.trackStayRoutePointData = [];
    var partTime = Math.floor((track.end_time - track.start_time) / 6);
    for (var i = 0; i < 6; i++) {
        tempTimeArr[i] = {
            start_time: track.start_time + i * partTime,
            end_time: track.start_time + (i + 1) * partTime - 1,
            index: i
        }
    }
    tempTimeArr[5].end_time = track.end_time;
    var params = {
        'entity_name': track.selectTrack,
        'service_id': service_id,
        'ak': ak
    };
    var count = 1;
    var reTrackRoute = function (paramsr) {

        var newParams = {
            'service_id': paramsr.service_id,
            'ak': paramsr.ak,
            'timeStamp': new Date().getTime(),
            'entity_name': paramsr.entity_name,
            'start_time': paramsr.start_time,
            'end_time': paramsr.end_time,
            'process_option': 'need_denoise=' + track.trackProcess.need_denoise + ','
                + 'need_vacuate=' + track.trackProcess.need_vacuate + ','
                + 'need_mapmatch=' + track.trackProcess.need_mapmatch + ','
                + 'transport_mode=' + track.transport_mode[track.trackProcess.transport_mode - 1]
        };
        var search = function (paramsearch, counta) {
            $.ajax({
                type: "GET",
                url: url3 + "/analysis/staypoint",
                dataType: 'jsonp',
                data: paramsearch,
                success: function (data) {
                    if (data.status === 0) {
                        track.trackStayRouteSortData.push({ index: counta, data: data });
                        if (++track.trackStayRouteDataCount === 6) {
                            track.trackStayRouteDataCount = 0;
                            track.trackStayRouteSortData.sort(function (a, b) { return a.index - b.index });

                            for (var i = 0; i < 6; i++) {
                                if (track.trackStayRouteSortData[i].data.stay_points !== undefined) {
                                    track.trackStayRoutePointData = track.trackStayRoutePointData.concat(track.trackStayRouteSortData[i].data.stay_points);
                                }
                            }
                            drawStaypoint(track.trackStayRoutePointData);
                            track.staypointSearching = 0;
                        }
                    }
                },
                error: function () {
                    console.log('获取单个实体的轨迹里程停留点失败');
                }
            });

        };
        search(newParams, count++);
    };
    tempTimeArr.map(function (item) {
        params.start_time = item.start_time;
        params.end_time = item.end_time;
        reTrackRoute(params);
    });
}

 /**
  * 进行地址解析
  *
  * @param {Object} point 点对象
  */
 onGetaddress = (point) => {
    var parmas = {
      location: point.lat + ',' + point.lng,
      output: 'json',
      service_id: service_id,
      ak: ak,
      timeStamp: new Date().getTime(),
    };

    $.ajax({
      type: "GET",
      url: url2 + '/',
      dataType: 'jsonp',
      data: parmas,
      timeStamp: 1495504132465,
      success: function (data) {
        var infoBoxObject = getTrackPointInfo(data, point);
        mapControl.setTrackInfoBox(infoBoxObject);
      },
      error: function () {
        console.log('获取信息地址失败');
      }
    });
  }

   /**
  * 整合轨迹点信息窗口的数据格式
  *
  * @param {Object} data 逆地址解析返回的结果
  * @param {Object} point 轨迹点对象数据
  *
  * @return {Object} 轨迹点信息窗口所需数据
  */
 getTrackPointInfo = (data, point) => {
    var address = '';
    if (data.status === 0) {
      if (data.result.formatted_address !== '') {
        address = data.result.formatted_address;
      } else {
        address = data.result.addressComponent.city + ', ' + data.result.addressComponent.country;
      }
    } else {
      address = '地址未解析成功';
    }
    var infoBoxObject = {
      point: point,
      print: point.print,
      infor: [
        ['定位:', point.lnglat],
        ['地址:', address],
        ['速度:', point.printSpeed],
        ['时间:', point.printTime],
        ['高度:', point.height + '米'],
        ['精度:', point.radius + '米']
      ]
    };
    return infoBoxObject;
  }


  /**
   * 绘制轨迹停留点
   *
   * @param {Array} data 轨迹数据 可选
   * @param {number} starttime 时间区间起点 可选
   * @param {number} endtime 时间区间终点 可选
   */
  drawStaypoint = (data) => {
    if (!data) data = track.trackStayRoutePointData;
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    $controlItemNum.eq(3).text(data.length);

    var points = [];
    for (var i = 0; i < data.length; i++) {
      points[i] = {
        latitude: data[i].stay_point.latitude,
        longitude: data[i].stay_point.longitude
      }
      var point = new BMap.Point(points[i].longitude, points[i].latitude);
      var during = data[i].end_time - data[i].start_time;
      var hour = during / 3600 >= 1 ? Math.floor(during / 3600) + '小时' : '';
      var minute = (during % 3600 / 60).toFixed(0) + '分钟';
      var value = '停留' + hour + minute;
      if (starttime <= data[i].start_time && data[i].end_time <= endtime) {
        mapControl.addBehaviorOverlay(point, 'behaviorPlace', value);
      }
    }
    updateAnalysisBehavior(track.behaviorCheck);
  }

    /**
   * 更新驾驶行为分析显示
   *
   * @param {array} 显示状态
   */
  updateAnalysisBehavior = (data) => {
    data = data || track.behaviorCheck;
    mapControl.updataBehaviorDisplay(data);
  }


  /*绘制轨迹分析点
  *
  * @param {Array} data 轨迹数据 可选
  * @param {number} starttime 时间区间起点 可选
  * @param {number} endtime 时间区间终点 可选
  */
 drawAnalysisBehavior = (data) => {
    if (!data) data = track.trackBehaviorPointData;
    var starttime = draw.starttime;
    var endtime = draw.endtime;

    track.behavior.behaviorSpeeding = data.speeding.length;
    track.behavior.behaviorAcceleration = data.harsh_acceleration.length + data.harsh_breaking.length;
    track.behavior.behaviorSteering = data.harsh_steering.length;
    $controlItemNum.eq(0).text(track.behavior.behaviorSpeeding);
    $controlItemNum.eq(1).text(track.behavior.behaviorAcceleration);
    $controlItemNum.eq(2).text(track.behavior.behaviorSteering);


    var accelerationPoints = [];
    for (var i = 0; i < data.harsh_acceleration.length; i++) {
      accelerationPoints[i] = {
        latitude: data.harsh_acceleration[i].latitude,
        longitude: data.harsh_acceleration[i].longitude
      }
      var point = new BMap.Point(accelerationPoints[i].longitude, accelerationPoints[i].latitude);
      var value = '急加速';
      let loc_time = data.harsh_acceleration[i].loc_time;
      if (starttime <= loc_time && loc_time <= endtime) {
        mapControl.addBehaviorOverlay(point, 'behaviorAccelecation', value);
      }
    }
    var breakingPoints = [];
    for (let i = 0; i < data.harsh_breaking.length; i++) {
      breakingPoints[i] = {
        latitude: data.harsh_breaking[i].latitude,
        longitude: data.harsh_breaking[i].longitude
      }
      var point = new BMap.Point(breakingPoints[i].longitude, breakingPoints[i].latitude);
      var value = '急减速';
      let loc_time = data.harsh_breaking[i].loc_time;
      if (starttime <= loc_time && loc_time <= endtime) {
        mapControl.addBehaviorOverlay(point, 'behaviorBreaking', value);
      }
    }
    var steeringPoints = [];
    for (let i = 0; i < data.harsh_steering.length; i++) {
      steeringPoints[i] = {
        latitude: data.harsh_steering[i].latitude,
        longitude: data.harsh_steering[i].longitude
      }
      var point = new BMap.Point(steeringPoints[i].longitude, steeringPoints[i].latitude);
      var value = '急转弯';
      let loc_time = data.harsh_steering[i].loc_time;
      if (starttime <= loc_time && loc_time <= endtime) {
        mapControl.addBehaviorOverlay(point, 'behaviorSteering', value);
      }
    }
    var speekingPoints = [];
    for (let i = 0; i < data.speeding.length; i++) {
      speekingPoints[i] = {
        latitude: data.speeding[i].speeding_points[0].latitude,
        longitude: data.speeding[i].speeding_points[0].longitude
      }
      var point = new BMap.Point(speekingPoints[i].longitude, speekingPoints[i].latitude);
      var value = '超速 ' + Math.floor(data.speeding[i].speeding_points[0].actual_speed) + ' | 限速 ' + data.speeding[i].speeding_points[0].limit_speed;
      let loc_time = data.speeding[i].speeding_points[0].loc_time;
      if (starttime <= loc_time && loc_time <= endtime) {
        mapControl.addBehaviorOverlay(point, 'behaviorSpeeking', value);
      }
    }
    updateAnalysisBehavior(track.behaviorCheck);
  }
  

  /**
   * 根据时间轴位置设置轨迹点位置
   *
   * @param {number} progress 时间戳 
   */
  setRunningPointByProgress = (progress) => {
    var point = getPointByTime(getTimeByPx(progress + 0));
    if (point.loc_time !== undefined) {
      setRunningPoint(point);
    }
  }


  /**
  * 根据数据点绘制实时位置
  *
  * @param {object} data 数据点 
  */
 setRunningPoint = (data) => {
    var update = function () {
      var ctx = this.canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      var point = new BMap.Point(data.lng, data.lat);
      var pixel = map.pointToPixel(point);

      ctx.beginPath();
      ctx.strokeStyle = '#d0d4d7'
      ctx.arc(pixel.x, pixel.y, 35, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(35, 152, 255, 0.14)';
      ctx.arc(pixel.x, pixel.y, 34, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = '#c2c2c4';
      ctx.arc(pixel.x, pixel.y, 8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(pixel.x, pixel.y, 7, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#1496ff';
      ctx.arc(pixel.x, pixel.y, 2.6, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (typeof (canvasLayerRunning) != 'undefined') {
      canvasLayerRunning.options.update = update;
      canvasLayerRunning._draw();
      return;
    }
    window.canvasLayerRunning = new CanvasLayer({
      map: map,
      update: update,
      zIndex: 10
    });
  }

    /**
   * 根据时间获取数据点
   *
   * @param {number} time 时间戳 
   * @return {object} 数据点
   */
  getPointByTime = (time) => {
    var point = {};
    var totalPoint = draw.totalPoints;
    if (time < totalPoint[0].loc_time) {
      point = totalPoint[0];
      return point;
    }
    if (time > totalPoint[totalPoint.length - 1].loc_time) {
      point = totalPoint[totalPoint.length - 1];
      return point;
    }
    for (var i = 0; i < totalPoint.length - 1; i++) {

      if (time >= totalPoint[i].loc_time && time <= totalPoint[i + 1].loc_time) {
        point = totalPoint[i];
        break;
      }
    }
    return point;
  }
  /**
   * CanvasLayer 函数
   * 
   * @returns
   */
  updatePointer = () => {
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    var ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (totalPoints.length !== 0) {
      var lines = 1;
      var lineObj = {};
      var pixelPart = 0;
      var pixelPartUnit = 40;
      for (var i = 0, len = totalPoints.length; i < len - 1; i = i + 1) {
        var pixel = map.pointToPixel(totalPoints[i]);
        var nextPixel = map.pointToPixel(totalPoints[i + 1]);
        pixelPart = pixelPart + Math.pow(Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2), 0.5);
        if (pixelPart <= pixelPartUnit) {
          continue;
        }
        pixelPart = 0;
        ctx.beginPath();

        if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
          // 箭头一共需要5个点：起点、终点、中心点、箭头端点1、箭头端点2

          var midPixel = new BMap.Pixel(
            (pixel.x + nextPixel.x) / 2,
            (pixel.y + nextPixel.y) / 2
          );

          // 起点终点距离
          var distance = Math.pow((Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2)), 0.5);
          // 箭头长度
          var pointerLong = 4;
          var aPixel = {};
          var bPixel = {};
          if (nextPixel.x - pixel.x === 0) {
            if (nextPixel.y - pixel.y > 0) {
              aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
              aPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
              bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
              bPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
            } else if (nextPixel.y - pixel.y < 0) {
              aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
              aPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
              bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
              bPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
            } else {
              continue;
            }
          } else {
            var k0 = ((-Math.pow(2, 0.5) * distance * pointerLong + 2 * (nextPixel.y - pixel.y) * midPixel.y) / (2 * (nextPixel.x - pixel.x))) + midPixel.x;
            var k1 = -((nextPixel.y - pixel.y) / (nextPixel.x - pixel.x));
            var a = Math.pow(k1, 2) + 1;
            var b = 2 * k1 * (k0 - midPixel.x) - 2 * midPixel.y;
            var c = Math.pow(k0 - midPixel.x, 2) + Math.pow(midPixel.y, 2) - Math.pow(pointerLong, 2);

            aPixel.y = (-b + Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
            bPixel.y = (-b - Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
            aPixel.x = k1 * aPixel.y + k0;
            bPixel.x = k1 * bPixel.y + k0;
          }
          ctx.moveTo(aPixel.x, aPixel.y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#eee';
          ctx.lineTo(midPixel.x, midPixel.y);
          ctx.lineTo(bPixel.x, bPixel.y);
          ctx.lineCap = 'round';
        }
        if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
          ctx.stroke();
        }
      }
    }
  }

  updateBack = () => {
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    var ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (totalPoints.length !== 0) {
      var lines = 1;
      var lineObj = {};

      for (var i = 0, len = totalPoints.length; i < len - 1; i++) {

        var pixel = map.pointToPixel(totalPoints[i]);
        var nextPixel = map.pointToPixel(totalPoints[i + 1]);
        ctx.beginPath();

        ctx.moveTo(pixel.x, pixel.y);
        if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
          // 绘制轨迹的时候绘制两次line，一次是底色，一次是带速度颜色的。目的是实现边框效果
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#8b8b89';
          ctx.lineTo(nextPixel.x, nextPixel.y);
          ctx.lineCap = 'round';

        } else {
          lines = lines + 1;
          var lineNum = lines;
          nextArray.push([pixel, nextPixel]);
        }
        if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
          ctx.stroke();
        }

      }
    }
  }

    update = () => {
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    var ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (totalPoints.length !== 0) {
      var lines = 1;
      var lineObj = {};
      for (var i = 0, len = totalPoints.length; i < len - 1; i++) {

        var pixel = map.pointToPixel(totalPoints[i]);
        var nextPixel = map.pointToPixel(totalPoints[i + 1]);
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
          // 绘制带速度颜色的轨迹
          ctx.lineCap = 'round';
          ctx.lineWidth = 8;
          var grd = ctx.createLinearGradient(pixel.x, pixel.y, nextPixel.x, nextPixel.y);
          var speed = totalPoints[i].speed;
          var speedNext = totalPoints[i + 1].speed;
          grd.addColorStop(0, getColorBySpeed(speed));
          grd.addColorStop(1, getColorBySpeed(speedNext));
          ctx.strokeStyle = grd;
          ctx.lineTo(nextPixel.x, nextPixel.y);
        } else {
          lines = lines + 1;
          var lineNum = lines;
          // lineObj['l' + i] = lines;
          nextArray.push([pixel, nextPixel]);
          if (totalPoints[i + 1].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
            var partImgStart = new Image();
            partImgStart.src = __uri('/static/images/startpoint.png');
            var next = nextPixel;
            partImgStart.onload = function () {
              var width = [4, 8];
              ctx.drawImage(partImgStart, next.x - 10, next.y - 30);
              ctx.font = 'lighter 14px arial';
              ctx.fillStyle = 'white';
              ctx.fillText(lineNum, next.x - width[lineNum >= 10 ? 1 : 0], next.y - 15);
            };
          }
          if (totalPoints[i].loc_time >= starttime && totalPoints[i].loc_time <= endtime) {
            var current = pixel;
            var partImgEnd = new Image();
            partImgEnd.src = __uri('/static/images/endpoint.png');
            partImgEnd.onload = function () {
              var width = [4, 8];
              ctx.drawImage(partImgEnd, current.x - 10, current.y - 30);
              ctx.font = 'lighter 14px arial';
              ctx.fillStyle = 'white';
              ctx.fillText(lineNum - 1, current.x - width[lineNum >= 10 ? 1 : 0], current.y - 15);
            };
          }
        }
        if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
          ctx.stroke();
        }

      }
    }

    if (totalPoints[0].loc_time >= starttime) {
      var imgStart = new Image();
      imgStart.src = '../../static/images/startpoint.png';
      imgStart.onload = function () {
        var width = [4, 8];
        ctx.drawImage(imgStart, map.pointToPixel(totalPoints[0]).x - 10, map.pointToPixel(totalPoints[0]).y - 30);
        ctx.font = 'lighter 14px arial';
        ctx.fillStyle = 'white';
        ctx.fillText('1', map.pointToPixel(totalPoints[0]).x - width[lines >= 10 ? 1 : 0], map.pointToPixel(totalPoints[0]).y - 15);
      };
    }
    if (totalPoints[totalPoints.length - 1].loc_time <= endtime) {
      var imgEnd = new Image();
      imgEnd.src = '../../static/images/endpoint.png';
      imgEnd.onload = function () {
        var width = [4, 8];
        ctx.drawImage(imgEnd, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - 10, map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 30);
        ctx.font = 'lighter 14px arial';
        ctx.fillStyle = 'white';
        ctx.fillText(lines, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - width[lines >= 10 ? 1 : 0], map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 15);
      };
    }
  }