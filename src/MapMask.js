/**
 * Created by liudonghui on 17/1/7.
 */

(function (domain) {
    var MapMask = function (options) {
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
        var size = map.getSize();
        element.width = size.width;
        element.height = size.height;
        element.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "width:" + size.width + "px;" + "height:" + size.height + "px";
        map.getPanes().labelPane.appendChild(this.element);
        var me = this;
        /*
         map.addEventListener('moving', function() {
         me.draw();
         });
         */
        map.addEventListener('resize', function(e) {
            var size = e.size;
            element.style.width = size.width + "px";
            element.style.height = size.height + "px";
            element.width = size.width;
            element.height = size.height;
            me.draw();
        });
        return this.element;
    }

    MapMask.prototype.initElement = function(map) {
    }

    MapMask.prototype.draw = function() {
        var map = this._map;
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
        this.element.style.left = pixel.x + "px";
        this.element.style.top = pixel.y + "px";
        this.dispatchEvent('draw');
    }

    MapMask.prototype.getContainer = function() {
        return this.element;
    }

    MapMask.prototype.show = function() {
        this._map.addOverlay(this);
    }

    MapMask.prototype.hide = function() {
        this._map.removeOverlay(this);
    }

    domain.MapMask = MapMask;
})(window.canvasBaiduMap)