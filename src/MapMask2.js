/**
 * Created by liudonghui on 17/1/7.
 */
/**
 * 一直覆盖在当前地图视野的覆盖物
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param
 * {
 *     map 地图实例对象
 *     elementTag 覆盖物容器的标签类型，默认是div，我们这canvas用的多
 * }
 */

function MapMask(options) {
    BMap.Overlay.apply(this);
    this.options = options || {};
    this.initElement();
    this._map = options.map;
}

MapMask.prototype = new BMap.Overlay();
MapMask.prototype.constructor = MapMask;

MapMask.prototype.initialize = function(map) {
    this._map = map;
    var elementTag = this.options.elementTag || "div";
    var element = this.element = document.createElement(elementTag);
    // var size = map.getSize();
    element.width = 100;
    element.height = 100;
    element.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "width:" + 100 + "px;" + "height:" + 100 + "px;" + "background:red;opacity:0.2";
    map.getPanes().labelPane.appendChild(this.element);
    var me = this;
    /*
     map.addEventListener('moving', function() {
     me.draw();
     });
     */
    // map.addEventListener('resize', function(e) {
    //     var size = e.size;
    //     element.style.width = size.width + "px";
    //     element.style.height = size.height + "px";
    //     element.width = size.width;
    //     element.height = size.height;
    //     me.draw();
    // });
    this.getBoundary();
    return this.element;
}

MapMask.prototype.getBoundary = function () {
    var width =  this.element.width;
    var height =  this.element.height;
    var pixel = this._map.pointToOverlayPixel(this.options.center);
    var minLatLng = this._map.overlayPixelToPoint(new BMap.Pixel(
        pixel.x - width/2,
        pixel.y + height/2
    ));
    var maxLatLng = this._map.overlayPixelToPoint(new BMap.Pixel(
        pixel.x + width/2,
        pixel.y - height/2
    ));

    this.boundary = new BMap.Bounds(minLatLng, maxLatLng);
}

MapMask.prototype.initElement = function(map) {
}

MapMask.prototype.draw = function() {
    var map = this._map;
    // var bounds = map.getBounds();
    // var sw = bounds.getSouthWest();
    // var ne = bounds.getNorthEast();
    // var pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915));
    // this.element.style.left = pixel.x + "px";
    // this.element.style.top = pixel.y + "px";
    // debugger;
    this.resetElement();
    // this.dispatchEvent('draw');
}

MapMask.prototype.resetElement = function () {
    var boundary = this.boundary;

    var elemAttr = this.getElemOffset();
    this.element.width = elemAttr.width;
    this.element.height = elemAttr.height;

    this.element.style.width = elemAttr.width + 'px';
    this.element.style.height = elemAttr.height + 'px';

    this.element.style.left = (elemAttr.maxOffset.x - elemAttr.width) + 'px';
    this.element.style.top = (elemAttr.minOffset.y - elemAttr.height) + 'px';
    // function getX(x) {
    //     return (x * grid - nwMc.x) / zoomUnit;
    // }
    //
    // function getY(y) {
    //     return (nwMc.y - y * grid) / zoomUnit;
    // }
}

MapMask.prototype.getElemOffset = function () {
    var boundary = this.boundary;
    if (boundary) {
        var minOffset = this._map.pointToOverlayPixel(boundary.getSouthWest()),
            maxOffset = this._map.pointToOverlayPixel(boundary.getNorthEast());
        return {
            minOffset: minOffset,
            maxOffset: maxOffset,
            width: maxOffset.x - minOffset.x,
            height: minOffset.y - maxOffset.y
        }
    }
};

MapMask.prototype.getContainer = function() {
    return this.element;
}

MapMask.prototype.show = function() {
    this._map.addOverlay(this);
}

MapMask.prototype.hide = function() {
    this._map.removeOverlay(this);
}
