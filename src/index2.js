/**
 * Created by liudonghui on 17/1/7.
 */
var options = options || {};
var defaultOptions = {
    arcSize: 1,
    dataName: "nj-taxi.html",
    lineWidth: 0.02,
    zoom: 13,
    center: new BMap.Point(116.404, 39.915)
}
options = $.extend(defaultOptions, options);

var grid = 1;

// 创建Map实例
var map = new BMap.Map("map", {
    "vectorMapLevel": 19,
    "enableMapClick": false
});

map.getContainer().style.background = "#081734";

// 地图自定义样式
map.setMapStyle({
    styleJson: [{
        "featureType": "water",
        "elementType": "all",
        "stylers": {
            "color": "#044161"
        }
    }, {
        "featureType": "land",
        "elementType": "all",
        "stylers": {
            "color": "#091934"
        }
    }, {
        "featureType": "boundary",
        "elementType": "geometry",
        "stylers": {
            "color": "#064f85"
        }
    }, {
        "featureType": "railway",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "color": "#004981"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#005b96",
            "lightness": 1
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
            "color": "#004981",
            "lightness": -39
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#00508b"
        }
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "green",
        "elementType": "all",
        "stylers": {
            "color": "#056197",
            "visibility": "off"
        }
    }, {
        "featureType": "subway",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "manmade",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "local",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "boundary",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#029fd4"
        }
    }, {
        "featureType": "building",
        "elementType": "all",
        "stylers": {
            "color": "#1a5787"
        }
    }, {
        "featureType": "label",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffff"
        }
    }, {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#1e1c1c"
        }
    }, {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }]
});

map.centerAndZoom(options.center, options.zoom); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); //启用滚轮放大缩小

var baseCanvas = new MapMask({
    map: map,
    elementTag: "div",
    center: options.center
});
baseCanvas.show();