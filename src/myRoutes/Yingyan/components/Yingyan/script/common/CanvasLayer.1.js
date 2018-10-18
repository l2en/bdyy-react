/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param 
 * {
 *     map 地图实例对象
 * }
 */
import BMap from 'BMap';

function CanvasLayer(options) {
  this.options = options || {};
  this.paneName = this.options.paneName || 'labelPane';
  this.zIndex = this.options.zIndex || 0;
  this._map = options.map;
  this._lastDrawTime = null;
  this.show();
}

CanvasLayer.prototype = new BMap.Overlay();

CanvasLayer.prototype.initialize = function (map) {
  this._map = map;
  var canvas = this.canvas = document.createElement("canvas");
  var ctx = this.ctx = this.canvas.getContext('2d');
  canvas.style.cssText = "position:absolute;" +
    "left:0;" +
    "top:0;" +
    "z-index:" + this.zIndex + ";";
  this.adjustSize();
  this.adjustRatio(ctx);
  map.getPanes()[this.paneName].appendChild(canvas);
  var that = this;
  map.addEventListener('resize', function () {
    that.adjustSize();
    that._draw();
  });
  //  this.canvas;
}

CanvasLayer.prototype.adjustSize = function () {
  var size = this._map.getSize();
  var canvas = this.canvas;
  canvas.width = size.width;
  canvas.height = size.height;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
}

CanvasLayer.prototype.adjustRatio = function (ctx) {
  var backingStore = ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
  var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
  var canvasWidth = ctx.canvas.width;
  var canvasHeight = ctx.canvas.height;
  ctx.canvas.width = canvasWidth * pixelRatio;
  ctx.canvas.height = canvasHeight * pixelRatio;
  ctx.canvas.style.width = canvasWidth + 'px';
  ctx.canvas.style.height = canvasHeight + 'px';
  ctx.scale(pixelRatio, pixelRatio);
};

CanvasLayer.prototype.draw = function () {
  var self = this;
  var args = arguments;

  clearTimeout(self.timeoutID);
  self.timeoutID = setTimeout(function () {
    self._draw.apply(self, args);
  }, 15);
}

CanvasLayer.prototype._draw = function () {
  var map = this._map;
  var size = map.getSize();
  var center = map.getCenter();
  if (center) {
    var pixel = map.pointToOverlayPixel(center);
    this.canvas.style.left = pixel.x - size.width / 2 + 'px';
    this.canvas.style.top = pixel.y - size.height / 2 + 'px';
    this.dispatchEvent('draw');
    this.options.update && this.options.update.apply(this, arguments);
    // if (this.options.update.type == 'updateBack') {
    //   this.updateBack(this.options.update.val)
    // } else if (this.options.update.type == 'update') {
    //   this.update(this.options.update.val)
    // } else {
    //   this.updatePointer(this.options.update.val)
    // }

  }
}

CanvasLayer.prototype.getContainer = function () {
  return this.canvas;
}

CanvasLayer.prototype.show = function () {
  if (!this.canvas) {
    this._map.addOverlay(this);   // 当调用map.addOverlay时会自动调用initialize方法 
  }
  this.canvas.style.display = "block";
}

CanvasLayer.prototype.hide = function () {
  this.canvas.style.display = "none";
  // this._map.removeOverlay(this);
}

CanvasLayer.prototype.setZIndex = function (zIndex) {
  this.canvas.style.zIndex = zIndex;
}

CanvasLayer.prototype.getZIndex = function () {
  return this.zIndex;
}

/**
  * CanvasLayer 函数
  * 
  * @returns
  */
CanvasLayer.prototype.updatePointer = (draw) => {
  var map = this._map;
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

CanvasLayer.prototype.updateBack = (draw) => {
  console.log('updateBack', draw)
  var map = this._map;
  var starttime = draw.starttime;
  var endtime = draw.endtime;
  var totalPoints = draw.totalPoints;
  var nextArray = [];
  // canvas 从哪里绘制 ? 待解决！ 
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

CanvasLayer.prototype.update = (draw) => {
  var map = this._map;
  console.log('update', draw)
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
    imgStart.src = startpoint;
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

export default CanvasLayer;
