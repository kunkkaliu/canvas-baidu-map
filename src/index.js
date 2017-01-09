$(function () {
    var options = {};
    var animateTimer = null;
    var defaultOptions = {
        arcSize: 1,
        lineWidth: 0.2,
        zoom: 16,
        center: new BMap.Point(116.299176,40.041609)
    }
    options = $.extend(defaultOptions, options);

    var grid = 1;

// 创建Map实例
    var map = new BMap.Map("map", {
        "maxZoom": 18,
        "vectorMapLevel": 19,
        "enableMapClick": false
    });
    map.setMinZoom(11);
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

    var mercatorProjection = map.getMapType().getProjection();

    //用来显示路线层用的
    var baseCanvas = new window.canvasBaiduMap.MapMask({
        map: map,
        elementTag: "canvas"
    });
    baseCanvas.show();

    var ctx = baseCanvas.getContainer().getContext("2d");
    baseCanvas.addEventListener('draw', draw);

    //用来展示动画层用的
    var animateMask = new window.canvasBaiduMap.MapMask({
        map: map,
        elementTag: "canvas"
    });
    animateMask.show();

    var anictx = animateMask.getContainer().getContext("2d");
    animateMask.addEventListener('draw', _animate);

    map.addEventListener('dragstart', function () {
        animateTimer && clearTimeout(animateTimer);
        animateTimer = null;
    });

    map.addEventListener('zoomstart', function () {
        animateTimer && clearTimeout(animateTimer);
        animateTimer = null;
    });

    var data = null;
    var aniIndex = [];
    $.ajax({
        url: "data/data.json",
        cache: false,
        success: function (res) {
            //返回的数据用data.d获取内容
            var rs = res.rs;
            data = [];
            for (var i = 0; i < rs.length; i++) {
                var line = [];
                var item = rs[i].split(',');
                for(var j = 0; j < item.length; j+=3) {
                    if (j == 0) {
                        line.push([parseFloat(item[j])/1000000, parseFloat(item[j+1])/1000000]);
                    }else {
                        line.push([(parseFloat(item[0]) + parseFloat(item[j]))/1000000, (parseFloat(item[1])+  parseFloat(item[j+1]))/1000000]);
                    }
                }
                aniIndex.push(0);
                data.push(line);
            }
            draw();
            _animate();
            $('#loadingBox').hide();
        },
        error: function (err) {
            alert(err);
        }
    });

    function getX(x, nwMc, zoomUnit) {
        return (x * grid - nwMc.x) / zoomUnit;
    }

    function getY(y, nwMc, zoomUnit) {
        return (nwMc.y - y * grid) / zoomUnit;
    }

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (!data) {
            return;
        }

        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (ctx.canvas.width / 2) * zoomUnit, mcCenter.y + (ctx.canvas.height / 2) * zoomUnit); //左上角墨卡托坐标

        ctx.beginPath();
        ctx.strokeStyle = "rgba(103,147,255,0.2)";
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255,255,255,1)";

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.length < 2) {
                continue;
            }
            var currentPixel = mercatorProjection.lngLatToPoint(new BMap.Point(item[0][0], item[0][1]));
            ctx.moveTo(getX(currentPixel.x, nwMc, zoomUnit), getY(currentPixel.y, nwMc, zoomUnit));
            for (var j = 1; j < item.length; j++) {
                //ctx.fillRect(getX(item[j][0]), getY(item[j][1]), 10, 10);
                // currentPixel[0] += item[j][0];
                // currentPixel[1] += item[j][1];
                currentPixel = mercatorProjection.lngLatToPoint(new BMap.Point(item[j][0], item[j][1]));
                ctx.lineTo(getX(currentPixel.x, nwMc, zoomUnit), getY(currentPixel.y, nwMc, zoomUnit));
            }
        }
        ctx.lineWidth = options.lineWidth;
        ctx.stroke();
    }

    function _animate() {
        anictx.clearRect(0, 0, anictx.canvas.width, anictx.canvas.height);
        animateTimer && clearTimeout(animateTimer);
        animateTimer = null;

        if (data) {
            anictx.fillStyle = "rgba(255, 255, 255, 1)";
            var zoomUnit = Math.pow(2, 18 - map.getZoom());
            var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
            var nwMc = new BMap.Pixel(mcCenter.x - (ctx.canvas.width / 2) * zoomUnit, mcCenter.y + (ctx.canvas.height / 2) * zoomUnit); //左上角墨卡托坐标

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.length < 2) {
                    continue;
                }
                var index = aniIndex[i];
                var currentPixel = mercatorProjection.lngLatToPoint(new BMap.Point(item[index][0], item[index][1]));
                anictx.fillRect(getX(currentPixel.x, nwMc, zoomUnit) - 1, getY(currentPixel.y, nwMc, zoomUnit) - 1, options.arcSize, options.arcSize);
                aniIndex[i]++;
                if (aniIndex[i] >= item.length) {
                    aniIndex[i] = 0;
                }
            }
        }

        animateTimer = setTimeout(function() {
            _animate();
        }, 200);
    }
});