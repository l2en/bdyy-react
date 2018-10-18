import React, { Component } from 'react';
import BMap from 'BMap';
import $ from 'jquery';

import './static/css/normalize.less';
import './static/css/animate.less';
import './static/icheck-1.x/square/blue.less';
import './static/css/common.less';

// import './static/icheck-1.x/icheck.min.js';
import mapControl from './script/common/mapControl.js';
import commonfun from './script/common/commonfun.js';
import CanvasLayer from './script/common/CanvasLayer.js';
// import './script/control/monitor.js';
// import trackControlFn from './script/control/trackcontrol.js';
let map = {};
console.log(BMap)
/*获取DOM*/
let $timelineProgress, 
    $runPart, 
    $analysis, 
    $trackPanel, 
    $analysisTitle, 
    $behaviorInput,
    $processInput,         // 轨迹纠偏 input
    $controlItemNum          // 驾车行为显示数字文本

const searchicon = require('./static/images/searchicon.png');
const clearsearch_2x = require('./static/images/clearsearch_2x.png');
const searchicon_2x = require("./static/images/searchicon_2x.png");
const reqStartpoint = require('./static/images/startpoint.png');
const reqEndpoint = require('./static/images/endpoint.png')
const url = 'http://yingyan.baidu.com/api/v3',     // 百度鹰眼V3请求地址(绘制路线)
  url2 = 'http://api.map.baidu.com/geocoder/v2',  // 正地理编码服务，讲具体地址转换成经纬度
  url3 = 'http://yingyan.baidu.com/api/v2';    // 百度鹰眼V2请求地址
let draw = {
  totalPoints: [],            // 所有秒回点
  starttime: '',              // 开始时间
  endtime: '',               //  结束时间
  first: false,              // 判断是否是第一次绘制轨迹
};
let timeline = {
  timeCount: [],           // 时间轴显示的小时数量
  timeNumber: [],          // 时间轴显示的时间数字标识
  // 播放速度，常规速度为0.1/frame 
  // 减速为 0.08,0.06,0.04,0.02,0.01 
  // 加速为 0.12,0.14,0.16,0.18,0.20
  playSpeed: [0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2],
  playSpeedIndex: 5,                 //当前播放速度位置
  progress: 0,                       // 时间轴位置
  currentProgress: 0,              // 当前时间轴位置
  currentPageX: 0,                 // 当前时间轴位置对应的pageX
  hovertime: '0:0',           // 浮动时间
  caliperAPosition: 0,           // 卡尺A位置
  caliperBPosition: 721,         // 卡尺B位置 
  timelineLong: 721,             // 时间轴长度
  caliperAclientX: 0,             // 卡尺A的clientX
  caluperCurrent: '',           // 当前拖动的卡尺
  initTimeStamp: 0,            // 当天起始时间时间错
  initMouseX: 0,            // 初始鼠标拖动位置
  dataPart: [],                 // 当前有数据的时间段数组
};
let track = {
  size: 10,            // 一页数
  trackProcess: {         // 轨迹纠偏状态对象
    is_processed: '0',
    need_denoise: '1',
    need_vacuate: '1',
    need_mapmatch: '0',
    transport_mode: '1'
  },
  behavior: {              // 当前轨迹驾驶行为分析
    behaviorSpeeding: 0,
    behaviorAcceleration: 0,
    behaviorSteering: 0
  },
  trackBehaviorSortData: [],         // 异步加载的驾驶分析排序数据
  trackBehaviorPointData: {                // 实际返回给view的驾驶分析数据
    harsh_acceleration: [],
    harsh_breaking: [],
    harsh_steering: [],
    speeding: []
  },
  // 异步加载的驾驶分析数据计数
  trackBehaviorDataCount: 0,
  behaviorCheck: ['0', '0', '0', '0'],          // 驾驶行为四个checkbox状态，0未选中 1选中
  trackStayRouteSortData: [],         // 异步加载的停留点排序数据
  trackStayRoutePointData: [],            // 实际返回给view的停留点数据
  trackStayRouteDataCount: 0,           // 异步加载的停留点数据计数
  transport_mode: [
    'driving',
    'riding',
    'walking'
  ],
  trackList: [],              // 当前track列表
  trackIndex: '',              // 当前实体index
  currentTrackPageIndex: 1,     // 当前track页码
  searchQuery: '',              // 查询关键字
  trackPageTotal: 0,           //track总页数
  start_time: 0,            // 当前选中开始时间
  end_time: 0,              // 当前结束时间
  selectTrack: '',          // 选择的tarck name
  trackRouteDataCount: 0,             // 异步加载的选中的轨迹数据计数
  trackRouteSortData: [],             // 异步加载的选中的轨迹排序数据
  trackRoutePointData: [],           // 实际返回给view的轨迹数据
  trackRouteNoZero: [],              // 实际返回过滤掉00点 
  trackSearching: 0,                 //标记正在轨迹检索 0未检索 1正在检索
  staypointSearching: 0,           //标记正在停留点检索 0未检索 1正在检索
  analysisbehaviorSearching: 0,      //标记正在轨迹分析检索 0未检索 1正在检索
};
const ak = 'RK99nKWU9pLqeoQPE9yv5fjKFyXT4yCt';
const service_id = '203819';
let _this;


class Yingyan extends Component {
  state = {

  }

  componentDidMount() {
    _this = this;
    console.clear()
    setTimeout(() => {
      this.initMap()
      this.onSelecttrack('马化腾')
      $timelineProgress = $('#timelineProgress');
      $runPart = $('#runPart');
      $analysis = $('.analysis');                  // 轨迹纠偏 驾车行为展开
      $trackPanel = $('.trackPanel');                   // 轨迹纠偏 驾车行为面板
      $analysisTitle = $('.analysisTitle');         // 轨迹纠偏 驾车行为 title
      $behaviorInput = $('.behaviorControl input');          // 驾车行为 input
      $processInput = $('.processControl input');         // 轨迹纠偏 input
      $controlItemNum = $('.controlItemNum');          // 驾车行为显示数字文本
      this.initTrackAnalysis();
    }, 1000);
  }

    /**
   * 开关轨迹纠偏, 驾驶行为分析面板
   *
   * @param {object} event 事件对象 
   */
  handleTogglePanel = ($dom, $this) => {
    var index = $dom.index($this);
    var $trackPanelCurrent = $trackPanel.eq(index);
    if ($trackPanelCurrent.hasClass('hidden')) {
      $trackPanel.removeClass('visible').addClass('hidden');
      $trackPanelCurrent.removeClass('hidden').addClass('visible');
      $analysis.removeClass('analysisHeaderPointOffUp').addClass('analysisHeaderPointOffDown')
        .eq(index).removeClass('analysisHeaderPointOffDown').addClass('analysisHeaderPointOffUp');
    } else {
      $trackPanelCurrent.addClass('hidden').removeClass('visible');
      $analysis.eq(index).addClass('analysisHeaderPointOffDown').removeClass('analysisHeaderPointOffUp');
    }
  }
   /**
   * 修改纠偏选项后重新加载路径
   *
   * @param {object} 更新轨迹纠偏状态
   */
  updateTrackProcess = () => {
    this.onSelecttrack('马化腾');
    // getTracklist();
  }

    /**
   * 切换轨迹纠偏总开关
   *
   * @param {object} event 事件对象 
   */
  handleProcessSwitch = ($this) => {
    const _this = this;
    if ($this.hasClass('processSwitchOff')) {
      $analysisTitle.eq(0).removeClass('analysisHeaderTitle1Off').addClass('analysisHeaderTitle1On');
      $this.removeClass('processSwitchOff').addClass('processSwitchOn');
      $processInput.iCheck('enable');
      track.trackProcess.is_processed = '1';
      _this.updateTrackProcess();
    } else {
      $analysisTitle.eq(0).removeClass('analysisHeaderTitle1On').addClass('analysisHeaderTitle1Off');
      $this.removeClass('processSwitchOn').addClass('processSwitchOff');
      $processInput.iCheck('disable');
      track.trackProcess.is_processed = '0';
      _this.updateTrackProcess();
    }
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

    /**
   * 切换驾驶分析总开关
   * @param {object} event 事件对象 
   */
  handleBehaviorSwitch = ($this) => {
    const _this = this
    if ($this.hasClass('behaviorSwitchOff')) {
      $analysisTitle.eq(1).removeClass('analysisHeaderTitle2Off').addClass('analysisHeaderTitle2On');
      $this.removeClass('behaviorSwitchOff').addClass('behaviorSwitchOn');
      $('.icheckbox_square-blue').removeClass('disabled')
      $behaviorInput.attr('disabled',false)
      _this.updateAnalysisBehavior();
    } else {
      $analysisTitle.eq(1).removeClass('analysisHeaderTitle2On').addClass('analysisHeaderTitle2Off');
      $this.removeClass('behaviorSwitchOn').addClass('behaviorSwitchOff');
      $('.icheckbox_square-blue').addClass('disabled')
      $behaviorInput.attr('disabled',true)
      _this.updateAnalysisBehavior(['0', '0', '0', '0']);
    }
  }

  // 右上角超速、急变速、急转弯、停留公共方法
  handleBehaviorCheck = (dom,controlItemNum)=>{
    if($('.trackAnalysisBehavior').find('.behaviorSwitchOff')[length]) return;
    if(dom.parent('.icheckbox_square-blue').hasClass('checked')){
      track.behaviorCheck[controlItemNum] = '0';
      $controlItemNum.eq(controlItemNum).removeClass('controlItemNumOn').addClass('controlItemNumOff');
      dom.parent('.icheckbox_square-blue').removeClass('checked');
      _this.updateAnalysisBehavior();
    }else {
      track.behaviorCheck[controlItemNum] = '1';
      $controlItemNum.eq(controlItemNum).removeClass('controlItemNumOff').addClass('controlItemNumOn');
      dom.parent('.icheckbox_square-blue').addClass('checked');
      _this.updateAnalysisBehavior();
    }
  }

  // 右上角路线分析初始化
  initTrackAnalysis = () => {
    const _this = this;
    // 展开关闭
    $analysis.on('click', function (e) {
      _this.handleTogglePanel($analysis, $(this));
    });
    $analysisTitle.on('click', function (e) {
      _this.handleTogglePanel($analysisTitle, $(this));
    });
    $('.closePanel').on('click', function (e) {
      $(this).parent().removeClass('visible').addClass('hidden');
      $analysis.removeClass('analysisHeaderPointOffUp').addClass('analysisHeaderPointOffDown')
    });

    // // 选择选项初始化
    // $('.processControl input, .behaviorControl input').iCheck({
    //   checkboxClass: 'icheckbox_square-blue',
    //   radioClass: 'iradio_square-blue',
    //   increaseArea: '20%' // optional
    // });

    // 轨迹纠偏,选择选项
    $('.processSwitchOff').on('click', function (e) {
      _this.handleProcessSwitch($(this));
    });

    // 去燥
    // $('#denoise').on('ifChecked', function (event) {
    //   track.trackProcess.need_denoise = '1';
    //   updateTrackProcess();
    // })
    //   .on('ifUnchecked', function (event) {
    //     track.trackProcess.need_denoise = '0';
    //     updateTrackProcess();
    //   });

    // 抽空
    // $('#vacuate').on('ifChecked', function (event) {
    //   track.trackProcess.need_vacuate = '1';
    //   updateTrackProcess();
    // })
    //   .on('ifUnchecked', function (event) {
    //     track.trackProcess.need_vacuate = '0';
    //     updateTrackProcess();
    //   });

    // 绑路
    // $('#mapmatch').on('ifChecked', function (event) {
    //   track.trackProcess.need_mapmatch = '1';
    //   updateTrackProcess();
    // })
    //   .on('ifUnchecked', function (event) {
    //     track.trackProcess.need_mapmatch = '0';
    //     updateTrackProcess();
    //   });

    // 驾驶方式
    // $('#byCar').on('ifChecked', function (event) {
    //   track.trackProcess.transport_mode = '1';
    //   updateTrackProcess();
    // });
    // $('#byBike').on('ifChecked', function (event) {
    //   track.trackProcess.transport_mode = '2';
    //   updateTrackProcess();
    // });
    // $('#byWalk').on('ifChecked', function (event) {
    //   track.trackProcess.transport_mode = '3';
    //   updateTrackProcess();
    // });

    // toggleCheck = (_this) => {
    //   // $(_this).
    // }

    // 驾驶行为分析,选择选项
    $('.behaviorSwitchOff').on('click', function (e) {
      _this.handleBehaviorSwitch($(this));
    });
    // 超速
    $('#speeding, #speeding+ins').on('click', function (event) {
      _this.handleBehaviorCheck($('#speeding'), 0);
    })
    // 急变速
    $('#acceleration, #acceleration+ins').on('click', function (event) {
      _this.handleBehaviorCheck($('#acceleration'), 1);
    })
    // 急转弯
    $('#steering, #steering+ins').on('click', function (event) {
      _this.handleBehaviorCheck($('#steering'), 2);
    })
    // 停留
    $('#staypoint, #staypoint+ins').on('click', function (event) {
      _this.handleBehaviorCheck($('#staypoint'), 3);
    })
  }

  initMap = () => {
    map = new BMap.Map('mapContainer'); //    创建Map实例
    map.centerAndZoom(new BMap.Point(104.072381, 30.663694), 12);
    map.addControl(new BMap.MapTypeControl()); //    添加地图类型控件
    map.setCurrentCity('成都'); //    设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //    开启鼠标滚轮缩放
    window.map = map;
  }

  // =============================  轨迹
  /**
   * 选中某个轨迹
   *  参数: 实体名字
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
        'transport_mode=' + track.transport_mode[track.trackProcess.transport_mode - 1],
        'start_time': '1539713400', // 当天零点时间戳
        'end_time': '1539791400' // 当天23:59时间戳
    };

    var count = 1;
    const _this = this;
    tempTimeArr.map(function (item) {
      // params.start_time = item.start_time;
      // params.end_time = item.end_time;
      _this.reTrackRoute(params, 1, count++);
      _this.reTrackRoute(params, 2, count++);
    });
  }

  /**
* 重新绘制路线
* 
* @param {any} paramsr
* @param {any} page_index
*/
  reTrackRoute = (paramsr, page_index, count) => {
    console.log('重新绘制路线数据======>', paramsr)
    const _this = this;
    // paramsr = {}
    // paramsr.ak = ak;
    // paramsr.service_id = service_id
    // paramsr.entity_name = '马化腾'
    // paramsr.start_time = new Date(new Date().toLocaleDateString()).getTime()+'' // 当天零点时间戳
    // paramsr.end_time = new Date(new Date().toLocaleDateString()).getTime() + 86399999 + '' // 当天23:59时间戳
                        
    console.log('重新绘制路线param', paramsr)
    paramsr.page_index = page_index;
    // const track = track;
    $.ajax({
      type: "GET",
      url: url + "/track/gettrack",
      dataType: 'jsonp',
      data: paramsr,
      success: function (data) {
        console.log('====>>>>>>>>获取地点数据', track)
        track.trackRouteDataCount+=1;
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
            console.log('==========即将显示的点', track.trackRouteNoZero)
            _this.drawTrack(track.trackRouteNoZero);
            _this.listenTrackRoute(track.trackRouteNoZero);
          }
        }
        if (track.trackRouteDataCount === 12) {
          track.trackRouteDataCount = 0;
          track.trackSearching = 0;
        }
      },
      error: function (data) {
        console.log('获取绘制路线失败', data);
      }
    });
  }

  // getColorBySpeed = (speed) => {
  //   var color = '';
  //   var red = 0;
  //   var green = 0;
  //   var blue = 0;
  //   speed = speed > 100 ? 100 : speed;
  //   switch (Math.floor(speed / 25)) {
  //     case 0:
  //       red = 187;
  //       green = 0;
  //       blue = 0;
  //       break;
  //     case 1:
  //       speed = speed - 25;
  //       red = 187 + Math.ceil((241 - 187) / 25 * speed);
  //       green = 0 + Math.ceil((48 - 0) / 25 * speed);
  //       blue = 0 + Math.ceil((48 - 0) / 25 * speed);
  //       break;
  //     case 2:
  //       speed = speed - 50;
  //       red = 241 + Math.ceil((255 - 241) / 25 * speed);
  //       green = 48 + Math.ceil((200 - 48) / 25 * speed);
  //       blue = 48 + Math.ceil((0 - 48) / 25 * speed);
  //       break;
  //     case 3:
  //       speed = speed - 75;
  //       red = 255 + Math.ceil((22 - 255) / 25 * speed);
  //       green = 200 + Math.ceil((191 - 200) / 25 * speed);
  //       blue = 0 + Math.ceil((43 - 0) / 25 * speed);
  //       break;
  //     case 4:
  //       red = 22;
  //       green = 191;
  //       blue = 43;
  //       break;
  //   }

  //   red = red.toString(16).length === 1 ? '0' + red.toString(16) : red.toString(16);
  //   green = green.toString(16).length === 1 ? '0' + green.toString(16) : green.toString(16);
  //   blue = blue.toString(16).length === 1 ? '0' + blue.toString(16) : blue.toString(16);
  //   color = '#' + red + green + blue;
  //   return color;
  // }

  /**
    * CanvasLayer 函数
    * 
    * @returns
    */
  updatePointer() {
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    var ctx = this.canvas ? this.canvas.getContext('2d') : null;
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

  updateBack() {
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    // canvas 从哪里绘制 ? 待解决！ 
    // var ctx = this.canvas ?  this.canvas.getContext('2d') : null;
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

  update(){
    const _this = this;
    var starttime = draw.starttime;
    var endtime = draw.endtime;
    var totalPoints = draw.totalPoints;
    var nextArray = [];
    var ctx = this.canvas ? this.canvas.getContext('2d') : null;
    let getColorBySpeed = (speed) => {
      var color = '';
      var red = 0;
      var green = 0;
      var blue = 0;
      speed = speed > 100 ? 100 : speed;
      switch (Math.floor(speed / 25)) {
        case 0:
          red = 187;
          green = 0;
          blue = 0;
          break;
        case 1:
          speed = speed - 25;
          red = 187 + Math.ceil((241 - 187) / 25 * speed);
          green = 0 + Math.ceil((48 - 0) / 25 * speed);
          blue = 0 + Math.ceil((48 - 0) / 25 * speed);
          break;
        case 2:
          speed = speed - 50;
          red = 241 + Math.ceil((255 - 241) / 25 * speed);
          green = 48 + Math.ceil((200 - 48) / 25 * speed);
          blue = 48 + Math.ceil((0 - 48) / 25 * speed);
          break;
        case 3:
          speed = speed - 75;
          red = 255 + Math.ceil((22 - 255) / 25 * speed);
          green = 200 + Math.ceil((191 - 200) / 25 * speed);
          blue = 0 + Math.ceil((43 - 0) / 25 * speed);
          break;
        case 4:
          red = 22;
          green = 191;
          blue = 43;
          break;
      }
  
      red = red.toString(16).length === 1 ? '0' + red.toString(16) : red.toString(16);
      green = green.toString(16).length === 1 ? '0' + green.toString(16) : green.toString(16);
      blue = blue.toString(16).length === 1 ? '0' + blue.toString(16) : blue.toString(16);
      color = '#' + red + green + blue;
      return color;
    }

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
            partImgStart.src = __uri(reqStartpoint);
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
            partImgEnd.src = __uri(reqEndpoint);
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
      imgStart.src = reqStartpoint;
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
      imgEnd.src = reqEndpoint;
      imgEnd.onload = function () {
        var width = [4, 8];
        ctx.drawImage(imgEnd, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - 10, map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 30);
        ctx.font = 'lighter 14px arial';
        ctx.fillStyle = 'white';
        ctx.fillText(lines, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - width[lines >= 10 ? 1 : 0], map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 15);
      };
    }
  }

  /**
* 绘制轨迹线路
* 
* @param {Array} data 轨迹数据 可选
* @param {number} starttime 时间区间起点 可选
* @param {number} endtime 时间区间终点 可选
*/
  drawTrack = (data, starttime, endtime) => {
    const _this = this;
    let pointCollection;
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
      // 画底层路线
      window.canvasLayerBack = new CanvasLayer({
        map: map,
        update:  _this.updateBack
        // update:  {type:'updateBack', val:draw}
      });

      // 画着色路线
      window.canvasLayer = new CanvasLayer({
        map: map,
        // update:  {type:'update',val:draw}
        update: _this.update
      });

      // 更新点
      window.CanvasLayerPointer = new CanvasLayer({
        map: map,
        // update:  {type:'updatePointer', val:draw}
        update:  _this.updatePointer
      });
    }

    console.log('查看window', window)

    mapControl.removeBehaviorOverlay();
    this.onBehavioranalysis();
    this.onGetstaypoint();

    if (typeof (pointCollection) !== 'undefined') {
      map.removeOverlay(pointCollection);
    }
    var options = {
      size: BMAP_POINT_SIZE_SMALL,
      shape: BMAP_POINT_SHAPE_CIRCLE,
      color: '#000'
    };
    pointCollection = new BMap.PointCollection(totalPoints, options);  // 初始化PointCollection   这里是渲染重点！！！！！
    pointCollection.addEventListener('mouseover', function (e) {
      mapControl.addTrackPointOverlay(e.point, 'trackpointOverlay');
    });
    pointCollection.addEventListener('mouseout', function (e) {
      mapControl.removeTrackPointOverlay('trackpointOverlay');
    });
    pointCollection.addEventListener('click', function (e) {
      mapControl.removeTrackInfoBox();
      _this.onGetaddress(e.point);
      mapControl.removeTrackPointOverlay('trackpointonOverlay');
      mapControl.addTrackPointOverlay(e.point, 'trackpointonOverlay');
    });
    console.log('-------渲染显示的点信息', data, 'startTime', starttime, 'endTime', endtime);
    console.log('map=======>>>>', map)
    console.log('pointCollection=======>>>>', pointCollection)
   
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
    pxPart[j].start_time = this.getPxByTime(data[0].loc_time);
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i + 1].loc_time - data[i].loc_time <= 5 * 60) {
        timePart[j].end_time = data[i + 1].loc_time;
        pxPart[j].end_time = this.getPxByTime(data[i + 1].loc_time);
      } else {
        j++;
        timePart[j] = {};
        timePart[j].start_time = data[i + 1].loc_time;
        pxPart[j] = {};
        pxPart[j].start_time = this.getPxByTime(data[i + 1].loc_time);
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
    this.setRunningPointByProgress(pxPart[0].start_time - 0);
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
                this.drawAnalysisBehavior(track.trackBehaviorPointData);
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
   * 
     * getstaypoint，获取停留点
     *
     */
  onGetstaypoint = () => {
    const _this = this;
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
                this.drawStaypoint(track.trackStayRoutePointData);
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

  /**
  * 进行地址解析
  *
  * @param {Object} point 点对象
  */
  onGetaddress = (point) => {
    const _this = this;
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
        var infoBoxObject = _this.getTrackPointInfo(data, point);
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
 *  根据时间戳获取时间轴像素位置
 *
 * @param {number} time 时间戳 
 * @return {number} 像素位置
 */
  getPxByTime = (time) => {
    var px = 0;
    // 像素 = (当前时间戳 + （北京时区 * 60 * 60））% 一天的秒) / (一个时间轴像素代表的秒数)
    px = (time + 28800) % 86400 / 120;
    return px;
  }


  /**
   * 根据时间轴位置设置轨迹点位置
   *
   * @param {number} progress 时间戳 
   */
  setRunningPointByProgress = (progress) => {
    const _this = this;
    var point = _this.getPointByTime(_this.getTimeByPx(progress + 0));
    if (point.loc_time !== undefined) {
      this.setRunningPoint(point);
    }
  }

  /**
 * 根据时间轴位置获取对应数据中时间点
 *
 * @param {number} px 像素位置 
 * @return {number} 时间戳
 */
  getTimeByPx = (px) => {
    var time = 0;
    time = (px) * 120 + timeline.initTimeStamp;
    return time;
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
* 根据数据点绘制实时位置
*
* @param {object} data 数据点 
*/
  setRunningPoint = (data) => {
    var update = function () {
      var ctx = this.canvas ? this.canvas.getContext("2d") : null;
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
      // update:  {type:'update',val:draw},
      zIndex: 10
    });
  }

  // initMap = () => {
  //   let that = this;
  // let infoBoxScript = document.createElement('script');
  // infoBoxScript.src = 'http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js',
  // document.getElementsByTagName('head')['0'].appendChild(infoBoxScript);
  // let canvasScript = document.createElement('script');
  // canvasScript.src = '../../static/javascript/CanvasLayer.js',
  // document.getElementsByTagName('head')['0'].appendChild(canvasScript);
  // let mapvScript = document.createElement('script');
  // mapvScript.src = 'http://mapv.baidu.com/build/mapv.js',
  // document.getElementsByTagName('head')['0'].appendChild(mapvScript);
  // mapvScript.onload = function () {
  //     that.initBoundsearch();
  //     initMonitor();           // 监控初始化
  // };
  // window.map = new BMap.Map("mapContainer", {enableMapClick: false});    // 创建Map实例
  // map.centerAndZoom(new BMap.Point(116.404, 39.915), 10);  // 初始化地图,设置中心点坐标和地图级别
  // map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
  // this.initLocation();
  // this.initControl();
  // this.initOverlay();

  // const map = new BMap.Map('mapContainer'); //    创建Map实例
  // map.centerAndZoom(new BMap.Point(116.404, 39.915), 10);
  // map.addControl(new BMap.MapTypeControl()); //    添加地图类型控件
  // map.setCurrentCity('成都'); //    设置地图显示的城市 此项是必须设置的
  // map.enableScrollWheelZoom(true); //    开启鼠标滚轮缩放
  // }


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

  render() {
    return (
      <div>
        <div className="Manager_content">
          <div className="main">
            <div className="trunk">
              <div className="trackControl visible">
                {/*<!--  地图  -->*/}
                <div className="map" id="mapContainer">
                </div>


                {/*<!--轨迹时间线-->*/}
                <div className="timeline visible">
                  <div className="timelineControl">
                    <div className="timelinePlay" id="timelinePlay"></div>
                    <div className="timelineSlow" id="timelineSlow"></div>
                    <div className="timelineQuick" id="timelineQuick"></div>
                  </div>
                  <div className="timelineMain" id="timelineMain">
                    <div className="timeHour timeHourFirst"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour"></div>
                    <div className="timeHour timeHourFinal"></div>
                    <div className="timeNumber" style={{ left: '-1px' }}>'0'</div>
                    <div className="timeNumber" style={{ left: '28.5px' }}>1</div>
                    <div className="timeNumber" style={{ left: '58px' }}>2</div>
                    <div className="timeNumber" style={{ left: '87.5px' }}>3</div>
                    <div className="timeNumber" style={{ left: '117px' }}>4</div>
                    <div className="timeNumber" style={{ left: '146.5px' }}>5</div>
                    <div className="timeNumber" style={{ left: '176px' }}>6</div>
                    <div className="timeNumber" style={{ left: '205.5px' }}>7</div>
                    <div className="timeNumber" style={{ left: '235px' }}>8</div>
                    <div className="timeNumber" style={{ left: '264.5px' }}>9</div>
                    <div className="timeNumber" style={{ left: '294px' }}>10</div>
                    <div className="timeNumber" style={{ left: '323.5px' }}>11</div>
                    <div className="timeNumber" style={{ left: '353px' }}>12</div>
                    <div className="timeNumber" style={{ left: '382.5px' }}>13</div>
                    <div className="timeNumber" style={{ left: '412px' }}>14</div>
                    <div className="timeNumber" style={{ left: '441.5px' }}>15</div>
                    <div className="timeNumber" style={{ left: '471px' }}>16</div>
                    <div className="timeNumber" style={{ left: '500.5px' }}>17</div>
                    <div className="timeNumber" style={{ left: '530px' }}>18</div>
                    <div className="timeNumber" style={{ left: '559.5px' }}>19</div>
                    <div className="timeNumber" style={{ left: '589px' }}>20</div>
                    <div className="timeNumber" style={{ left: '618.5px' }}>21</div>
                    <div className="timeNumber" style={{ left: '648px' }}>22</div>
                    <div className="timeNumber" style={{ left: '677.5px' }}>23</div>
                    <div className="timeNumber" style={{ left: '707px' }}>24</div>
                    <div className="timelineProgress" id="timelineProgress"></div>
                    <div className="runPart" id="runPart"></div>
                    <div className="timelineLabel blank" id="timelineLabel" style={{ left: '171px' }}>
                      <div className="timelineLabelcontent">5:42</div>
                      <div className="timelineLabelpointer"></div>
                    </div>
                    <div className="caliperA" id="caliperA">
                      <div className="caliperLine"></div>
                      <div className="caliperPointerA" id="caliperPointerA"></div>
                    </div>
                    <div className="caliperB" id="caliperB">
                      <div className="caliperLine"></div>
                      <div className="caliperPointerB" id="caliperPointerB"></div>
                    </div>
                    <div className="caliperPartA" id="caliperPartA"></div>
                    <div className="caliperPartB" id="caliperPartB"></div>
                  </div>
                </div>

                {/*<!--轨迹纠偏，驾驶行为分析-->*/}
                <div className="trackAnalysis visible">
                  <div className="trackAnalysisHeader">
                    <div className="analysisHeaderTitle1Off analysisTitle">轨迹纠偏</div>
                    <div className="analysisHeaderPointOffDown analysis"></div>
                    <div className="analysisHeaderLine"></div>
                    <div className="analysisHeaderTitle2Off analysisTitle">驾驶行为分析</div>
                    <div className="analysisHeaderPointOffDown analysis"></div>
                  </div>
                  <div className="trackAnalysisProcess trackPanel hidden">
                    <div className="processClose closePanel"></div>
                    <div className="processTile">轨迹纠偏</div>
                    <div className="processSwitchOff"></div>
                    <div className="processControl">
                      <div className="processControlItem">
                        <div className="icheckbox_square-blue checked disabled" style={{ position: 'relative' }}>
                          <input type="checkbox" id="denoise" checked="" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins>
                        </div>
                        <label htmlFor="denoise">去噪</label>
                      </div>
                      <div className="processControlItem">
                        <div className="icheckbox_square-blue checked disabled" style={{ position: 'relative' }}><input type="checkbox" id="vacuate" checked="" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins></div>
                        <label htmlFor="vacuate">抽稀</label>
                      </div>
                      <div className="processControlItem">
                        <div className="icheckbox_square-blue disabled" style={{ position: 'relative' }}>
                          <input type="checkbox" id="mapmatch" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins>
                        </div>
                        <label htmlFor="mapmatch">绑路</label>
                      </div>
                    </div>
                    <div className="processControl">
                      <div className="optionsTitle">交通方式</div>
                      <div className="trafficMethodItem">
                        <div className="iradio_square-blue checked disabled" style={{ position: 'relative' }}>
                          <input type="radio" name="trafficMethod" id="byCar" checked="" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins>
                        </div>
                        <label htmlFor="byCar">驾车</label>
                      </div>
                      <div className="trafficMethodItem">
                        <div className="iradio_square-blue disabled" style={{ position: 'relative' }}>
                          <input type="radio" name="trafficMethod" id="byBike" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins>
                        </div>
                        <label htmlFor="byBike">骑行</label>
                      </div>
                      <div className="trafficMethodItem">
                        <div className="iradio_square-blue disabled" style={{ position: 'relative' }}>
                          <input type="radio" name="trafficMethod" id="byWalk" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                          <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }}></ins>
                        </div>
                        <label htmlFor="byWalk">步行</label>
                      </div>
                    </div>
                  </div>
                  <div className="trackAnalysisBehavior trackPanel hidden">
                    <div className="behaviorClose closePanel"></div>
                    <div className="behaviorTile">驾驶行为分析</div>
                    <div className="behaviorSwitchOff"></div>
                    <div className="behaviorControl">
                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <div className="icheckbox_square-blue disabled" style={{ position: 'relative' }}>
                            <input type="checkbox" id="speeding" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                            <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} ></ins>
                          </div>
                          <label htmlFor="speeding">超速</label>
                        </div>
                      </div>

                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <div className="icheckbox_square-blue disabled" style={{ position: 'relative' }}>
                            <input type="checkbox" id="acceleration" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                            <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} ></ins>
                          </div>
                          <label htmlFor="acceleration">急变速</label>
                        </div>
                      </div>

                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <div className="icheckbox_square-blue disabled" style={{ position: 'relative' }}>
                            <input type="checkbox" id="steering" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                            <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} ></ins>
                          </div>
                          <label htmlFor="steering">急转弯</label>
                        </div>
                      </div>

                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <div className="icheckbox_square-blue disabled" style={{ position: 'relative' }}>
                            <input type="checkbox" id="staypoint" disabled="" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} />
                            <ins className="iCheck-helper" style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'block', width: '140%', height: '140%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: '0' }} ></ins>
                          </div>
                          <label htmlFor="staypoint">停留</label>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Yingyan;
