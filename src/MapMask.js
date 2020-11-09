/**
 * Created by liudonghui on 17/1/7.
 */

(function (domain) {
  var MapMask = function (options) {
    BMap.Overlay.apply(this, arguments);
    this.options = options || {};
    this._map = options.map;
  }

  MapMask.prototype = new BMap.Overlay();
  MapMask.prototype.constructor = MapMask;

  MapMask.prototype.initialize = function (map) {
    this._map = map;
    var elementTag = this.options.elementTag || "div";
    var element = this.element = document.createElement(elementTag);
    var size = map.getSize();
    element.width = size.width;
    element.height = size.height;
    element.style.cssText = "position: absolute;" + "left: 0;" + "top: 0;";
    element.style.width = size.width;
    element.style.height = size.height;
    element.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    map.getPanes().labelPane.appendChild(this.element);
    var me = this;
    map.addEventListener('resize', function (e) {
      element.width = e.size.width;
      element.height = e.size.height;
      element.style.width = e.size.width;
      element.style.height = e.size.height;
      me.draw();
    });
    return this.element;
  }

  MapMask.prototype.draw = function () {
    var map = this._map;
    var size = map.getSize();
    // var bounds = map.getBounds();
    // var sw = bounds.getSouthWest();
    // var ne = bounds.getNorthEast();
    // var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
    // this.element.style.left = pixel.x + "px";
    // this.element.style.top = pixel.y + "px";
    var pixel = map.pointToOverlayPixel(map.getCenter());
    this.element.style.left = pixel.x - size.width / 2 + "px";
    this.element.style.top = pixel.y - size.height / 2 + "px";
    this.dispatchEvent('draw');
  }

  MapMask.prototype.getContainer = function () {
    return this.element;
  }

  MapMask.prototype.show = function () {
    this._map.addOverlay(this);
  }

  MapMask.prototype.hide = function () {
    this._map.removeOverlay(this);
  }

  domain.MapMask = MapMask;
})(window.canvasBaiduMap)