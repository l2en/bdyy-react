import React, { Component } from 'react';
import BMap from 'BMap';

import './static/css/normalize.css';
import './static/css/animate.css';
import './static/icheck-1.x/square/blue.css';
import './static/css/common.less';

// import './static/icheck-1.x/icheck.min.js';
// import './script/common/mapControl.js';
// import './script/common/commonfun.js';
// import './script/control/monitor.js';
// import './script/control/trackcontrol.js';

const searchicon = require('./static/images/searchicon.png');
const clearsearch_2x = require('./static/images/clearsearch_2x.png');
const searchicon_2x = require("./static/images/searchicon_2x.png");
class Yingyan extends Component {
  state = {

  }

  componentDidMount() {
    setTimeout(() => { this.initMap() }, 1000)
  }

  // initMap = () => {
  //   let that = this;
  // let infoBoxScript = document.createElement('script');
  // infoBoxScript.src = 'http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js';
  // document.getElementsByTagName('head')[0].appendChild(infoBoxScript);
  // let canvasScript = document.createElement('script');
  // canvasScript.src = '../../static/javascript/CanvasLayer.js';
  // document.getElementsByTagName('head')[0].appendChild(canvasScript);
  // let mapvScript = document.createElement('script');
  // mapvScript.src = 'http://mapv.baidu.com/build/mapv.js';
  // document.getElementsByTagName('head')[0].appendChild(mapvScript);
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

  initMap = () => {
    const map = new BMap.Map('mapContainer'); //    创建Map实例
    map.centerAndZoom(new BMap.Point(120.212111, 34.213232), 12);
    map.addControl(new BMap.MapTypeControl()); //    添加地图类型控件
    map.setCurrentCity('成都'); //    设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //    开启鼠标滚轮缩放
  }

  render() {
    return (
      <div>
        <div className="Manager_content">
          <div className="main">
            <div className="trunk">
              <div className="trackControl visible">
                {/*<!--  地图  -->*/}
                <div className="map" id="mapContainer" style={{ width: '100%', height: '100vh' }}>
                </div>
                {/*<!--  左边框  -->*/}
                <div className="manage">
                  <div className="manageControl">
                    {/*<!-- 标题  -->*/}
                    <div className="manageTop">
                      <div className="serviceName">百度鹰眼路线管理</div>
                      <div className="toggleInManage" id="toggleInManage"></div>
                    </div>
                    {/*<!--  内容  -->*/}
                    <div className="collapse in">
                      <div className="manageBottom">

                        {/*<!--  切换的tab  -->*/}
                        <div className="manageTab visible">
                          <div className="monitorTab">实时监控
											<div className="monitorTabIcon"></div>
                          </div>
                          <div className="trackTab">轨迹查询
											<div className="trackTabIcon"></div>
                          </div>
                          <div className="pointerTabRight" id="pointerTab"></div>
                        </div>

                        {/*<!--实时监控-->*/}
                        <div className="monitor hidden ">
                          <div className="monitorSearch">
                            <input className="searchInputMonitor" placeholder="请输入关键字" id="searchInputMonitor2" />
                            <img src={searchicon} className="searchBtnMonitor" id="searchBtnMonitor2" />
                            <div className="lineMonitor"></div>
                            <img src="./static/images/clearsearch.png" className="clearSearchBtnMonitor hideCommon" id="clearSearchBtnMonitor2" />
                          </div>
                          <div className="monitorList">
                            <div className="monitorAll monitorTab2">全部<span></span></div>
                            <div className="monitorOnline monitorTab2">在线<span></span></div>
                            <div className="monitorOffline monitorTab2">离线<span></span></div>
                            <div className="monitorBottomLineLeft"></div>
                          </div>
                          <div className="monitorAllContent visible">
                            <div className="monitorFrame" id="monitorList"></div>
                            <div className="monitorPage">
                              <div className="jumpPage">
                                <input type="text" className="inputPage" id="inputPage2" defaultValue="1" />
                                <span className="pageNumber">/ <span id="allPage2">0</span>页</span>
                                <span className="goPage" id="goPage2">GO</span>
                              </div>
                              <div className="switchPage">
                                <span className="lastPageOff" id="prevPage2"></span>
                                <span className="nextPageOn" id="nextPage2"></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/*<!--  轨迹查询  -->*/}
                        <div className="track visible">
                          {/*<!--  时间选择  -->*/}
                          <div className="trackDatetime">
                            <div className="input-append date" id="datetimepicker">
                              <input type="text" className="datetimeInput" id="datetimeInput" value="" size="16" date-format="yyyy-mm-dd" />
                              <span className="add-on datetimeBtn"><i className="icon-th"></i></span>
                            </div>
                          </div>
                          {/*<!--  搜索  -->*/}
                          <div className="trackSearch">
                            <input className="searchInputMonitor" id="searchInputMonitor" placeholder="请输入关键字" />
                            <img src={searchicon_2x} className="searchBtnMonitor" id="searchBtnMonitor" />
                            <div className="lineMonitor"></div>
                            <img src={clearsearch_2x} className="clearSearchBtnMonitor hideCommon" id="clearSearchBtnMonitor" />
                          </div>
                          {/*<!--  列表  -->*/}
                          <div className="trackContent">
                            <div className="monitorFrame" id="trackList"></div>
                            <div className="monitorPage">
                              <div className="jumpPage">
                                <input type="text" className="inputPage" id="inputPage" defaultValue="1" />
                                <span className="pageNumber">/ <span id="allPage">0</span>页</span>
                                <span className="goPage" id="goPage">GO</span>
                              </div>
                              <div className="switchPage">
                                <span className="lastPageOff" id="prevPage"></span>
                                <span className="nextPageOff" id="nextPage"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*<!--轨迹时间线-->*/}
                <div className="timeline">
                  <div className="timelineControl">
                    <div className="timelinePlay" id="timelinePlay"></div>
                    <div className="timelineSlow" id="timelineSlow"></div>
                    <div className="timelineQuick" id="timelineQuick"></div>
                  </div>
                  <div className="timelineMain" id="timelineMain">
                    <div className="timelineProgress" id="timelineProgress"></div>
                    <div className="runPart" id="runPart"></div>
                    <div className="timelineLabel blank" id="timelineLabel">
                      <div className="timelineLabelcontent">0:0</div>
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
                <div className="trackAnalysis">
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
                        <input type="checkbox" id="denoise" checked disabled />
                        <label htmlFor="denoise">去噪</label>
                      </div>
                      <div className="processControlItem">
                        <input type="checkbox" id="vacuate" checked disabled />
                        <label htmlFor="vacuate">抽稀</label>
                      </div>
                      <div className="processControlItem">
                        <input type="checkbox" id="mapmatch" disabled />
                        <label htmlFor="mapmatch">绑路</label>
                      </div>
                    </div>
                    <div className="processControl">
                      <div className="optionsTitle">交通方式</div>
                      <div className="trafficMethodItem">
                        <input type="radio" name="trafficMethod" id="byCar" checked disabled />
                        <label htmlFor="byCar">驾车</label>
                      </div>
                      <div className="trafficMethodItem">
                        <input type="radio" name="trafficMethod" id="byBike" disabled />
                        <label htmlFor="byBike">骑行</label>
                      </div>
                      <div className="trafficMethodItem">
                        <input type="radio" name="trafficMethod" id="byWalk" disabled />
                        <label htmlFor="byWalk">步行</label>
                      </div>
                    </div>
                  </div>

                  <div className="trackAnalysisBehavior trackPanel hidden">
                    <div className="behaviorClose closePanel"></div>
                    <div className="behaviorTile">驾驶行为分析</div>
                    <div className="behaviorSwitchOff"></div>
                    <div className="behaviorControl">
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <input type="checkbox" id="speeding" disabled />
                          <label htmlFor="speeding">超速</label>
                        </div>
                      </div>
                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <input type="checkbox" id="acceleration" disabled />
                          <label htmlFor="acceleration">急变速</label>
                        </div>
                      </div>
                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <input type="checkbox" id="steering" disabled />
                          <label htmlFor="steering">急转弯</label>
                        </div>
                      </div>
                      <div className="controlItemLine"></div>
                      <div className="behaviorControlItem">
                        <div className="controlItemNumOff controlItemNum">0</div>
                        <div className="controlItemBot">
                          <input type="checkbox" id="staypoint" disabled />
                          <label htmlFor="staypoint">停留</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*<!--视野设备数量-->*/}
                <div className="boundcontrol hidden">
                  <div className="boundsearch_title">全部显示</div>
                  <div className="boundOff" id="boundBtn"></div>
                  <div className="boundsearch_total">当前视野设备数量：<span>0</span></div>
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
