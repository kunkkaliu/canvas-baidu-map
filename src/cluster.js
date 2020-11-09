$(function () {
  var options = {};
  var defaultOptions = {
    arcSize: 2,
    zoom: 6,
    center: new BMap.Point(102.342785, 35.312316)
  }
  options = $.extend(defaultOptions, options);

  // 创建Map实例
  var map = new BMap.Map("map", {
    "maxZoom": 18,
    "vectorMapLevel": 19,
    "enableMapClick": false
  });
  map.setMinZoom(5);
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
        "visibility": "off"
      }
    }]
  });

  map.centerAndZoom(options.center, options.zoom); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(); //启用滚轮放大缩小

  const markers = [];

  for (let i = 0; i < citys.length; i++) {
    const item = citys[i];
    const lnglat = item['lnglat'];
    markers.push(new BMap.Marker(new BMap.Point(lnglat[0], lnglat[1])));
  }

  const mcIns = new BMapLib.MarkerClusterer(map, {
    markers,
    gridSize: 200,
    maxZoom: 18,
  });
});