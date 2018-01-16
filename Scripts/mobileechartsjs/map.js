var EchartsMapComponent = {};

EchartsMapComponent.Maps = ['西藏', '青海', '宁夏', '海南', '甘肃', '贵州', '新疆', '云南', '重庆', '吉林', '山西', '天津', '江西', '广西', '陕西', '黑龙江', '内蒙古', '安徽', '北京', '福建', '上海', '湖北', '湖南', '四川', '辽宁', '河北', '河南', '浙江', '山东', '江苏', '广东', '台湾', '香港', '澳门'];

EchartsMapComponent.Map001 = function (data, optionatt) {
    this._tableData = data;
    this._tableData.sort(NumDescSort);
    var legendvalue = new Array();
    var seriesdata = new Array();
    var maxvalue = 0;
    var fields = new Array();
    var areadata = new Array();
    for (var key in this._tableData[0]) {
        if (key.length > 0 && !fields.contains(key)) {
            fields.push(key);
        }
    }
    if (fields.contains("XValue")) {
        for (var i = 0; i < this._tableData.length; i++) {
            if (!legendvalue.contains(this._tableData[i].ItemName)) {
                legendvalue.push(this._tableData[i].ItemName);
            }
            for (var m = 0; m < EchartsMapComponent.Maps.length; m++) {            
                if (this._tableData[i].XValue.indexOf(EchartsMapComponent.Maps[m]) >= 0) {                
                    if (!areadata.contains(EchartsMapComponent.Maps[m])) {
                        areadata.push(EchartsMapComponent.Maps[m]);
                    }
                }
            }
        }
        for (var i = 0; i < legendvalue.length; i++) {
            var series = {};
            series.name = legendvalue[i];
            series.type = "map";
            series.mapType = 'china';
            series.left = "25%";
            series.z = 2;
            series.itemStyle = {
                normal: { label: { show: true} },
                emphasis: { label: { show: true} }
            };
            series.mapLocation = {
                    x: 'right',
                    y: 80
                };
            var nsdata = new Array();
            var nbardata = new Array();
            for (var m = 0; m < areadata.length; m++) {
                nbardata.push(0);
                for (var j = 0; j < this._tableData.length; j++) {
                    if (legendvalue[i] == this._tableData[j].ItemName) {
                        if (this._tableData[j].XValue.indexOf(areadata[m]) >= 0) {
                            nbardata[m] += this._tableData[j].ItemCount;
                            if (nbardata[m] > maxvalue) {
                                maxvalue = nbardata[m];
                            }
                        }
                    }
                }
                var ndata = { name: areadata[m], value: nbardata[m] };
                nsdata.push(ndata);
            }
            series.data = nsdata;
            seriesdata.push(series);
        }
    }
    else {
        for (var i = 0; i < this._tableData.length; i++) {
            for (var m = 0; m < EchartsMapComponent.Maps.length; m++) {            
                if (this._tableData[i].ItemName.indexOf(EchartsMapComponent.Maps[m]) >= 0) {                
                    if (!areadata.contains(EchartsMapComponent.Maps[m])) {
                        areadata.push(EchartsMapComponent.Maps[m]);
                    }
                }
            }
        }
        var series = {};
        series.z = 2;
        series.type = "map";
        series.mapType = 'china';
        series.top = "20%";
        series.left = "20%";
        series.itemStyle = {
            normal: { label: { show: true} },
            emphasis: { label: { show: true} }
        };
        var nsdata = new Array();
        var nbardata = new Array();
        for (var m = 0; m < areadata.length; m++) {
            nbardata.push(0);
            for (var j = 0; j < this._tableData.length; j++) {
                if (this._tableData[j].ItemName.indexOf(areadata[m]) >= 0) {
                    nbardata[m] += this._tableData[j].ItemCount;
                    if (nbardata[m] > maxvalue) {
                        maxvalue = nbardata[m];
                    }
                }                    
            }
            var ndata = { name: areadata[m], value: nbardata[m] };
            nsdata.push(ndata);
        }
        series.data = nsdata;
        seriesdata.push(series);
    }
    

    var option = {
        backgroundColor: optionatt.backgroundColor,
        color: optionatt.color,
        noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
                effect: {
                    n: 0
                }
            }
        },
        title: {
            text: optionatt.Title,
            itemGap: 10,
            textStyle: {
                color: optionatt.textStyle
            },
            subtextStyle: {
                color: optionatt.subtextStyle
            },
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
        tooltip: {
            trigger: 'item',
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        dataRange: {
            min: 0,
            max: maxvalue,
            x: 'left',
            y: 'bottom',
            text: ['高', '低'],           // 文本，默认为数值文本
            calculable: true
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legendvalue
        },
        series: seriesdata
    };

    return option;
}


EchartsMapComponent.Map002 = function (data, optionatt) {
    this._tableData = data;
    this._tableData.sort(NumDescSort);
    var legendvalue = new Array();
    var seriesdata = new Array();
    var maxvalue = 0;
    var fields = new Array();
    var areadata = new Array();
    for (var key in this._tableData[0]) {
        if (key.length > 0 && !fields.contains(key)) {
            fields.push(key);
        }
    }
    if (fields.contains("XValue")) {
        for (var i = 0; i < this._tableData.length; i++) {
            if (!legendvalue.contains(this._tableData[i].ItemName)) {
                legendvalue.push(this._tableData[i].ItemName);
            }
            for (var m = 0; m < EchartsMapComponent.Maps.length; m++) {            
                if (this._tableData[i].XValue.indexOf(EchartsMapComponent.Maps[m]) >= 0) {                
                    if (!areadata.contains(EchartsMapComponent.Maps[m])) {
                        areadata.push(EchartsMapComponent.Maps[m]);
                    }
                }
            }
        }
        for (var i = 0; i < legendvalue.length; i++) {
            var series = {};
            series.name = legendvalue[i];
            series.type = "map";
            series.mapType = 'china';
            series.left = "25%";
            series.z = 2;
            series.itemStyle = {
                normal: { label: { show: true} },
                emphasis: { label: { show: true} }
            };
            series.mapLocation = {
                    x: 'right',
                    y: 80
                };
            var nsdata = new Array();
            var nbardata = new Array();
            for (var m = 0; m < areadata.length; m++) {
                nbardata.push(0);
                for (var j = 0; j < this._tableData.length; j++) {
                    if (legendvalue[i] == this._tableData[j].ItemName) {
                        if (this._tableData[j].XValue.indexOf(areadata[m]) >= 0) {
                            nbardata[m] += this._tableData[j].ItemCount;
                            if (nbardata[m] > maxvalue) {
                                maxvalue = nbardata[m];
                            }
                        }
                    }
                }
                var ndata = { name: areadata[m], value: nbardata[m] };
                nsdata.push(ndata);
            }
            series.data = nsdata;
            seriesdata.push(series);

            var series = {};
            series.name = legendvalue[i];
            series.type = "bar";
            series.barWidth = "20%";
            series.z = 1;
            series.data = nbardata;
            seriesdata.push(series);
        }
    }
    else {
        for (var i = 0; i < this._tableData.length; i++) {
            for (var m = 0; m < EchartsMapComponent.Maps.length; m++) {            
                if (this._tableData[i].ItemName.indexOf(EchartsMapComponent.Maps[m]) >= 0) {                
                    if (!areadata.contains(EchartsMapComponent.Maps[m])) {
                        areadata.push(EchartsMapComponent.Maps[m]);
                    }
                }
            }
        }
        var series = {};
        series.z = 2;
        series.type = "map";
        series.mapType = 'china';
        series.top = "20%";
        series.left = "20%";
        series.itemStyle = {
            normal: { label: { show: true} },
            emphasis: { label: { show: true} }
        };
        var nsdata = new Array();
        var nbardata = new Array();
        for (var m = 0; m < areadata.length; m++) {
            nbardata.push(0);
            for (var j = 0; j < this._tableData.length; j++) {
                if (this._tableData[j].ItemName.indexOf(areadata[m]) >= 0) {
                    nbardata[m] += this._tableData[j].ItemCount;
                    if (nbardata[m] > maxvalue) {
                        maxvalue = nbardata[m];
                    }
                }                    
            }
            var ndata = { name: areadata[m], value: nbardata[m] };
            nsdata.push(ndata);
        }
        series.data = nsdata;
        seriesdata.push(series);
        
        var series = {};
        series.z = 1;
        series.barWidth = "20%";
        series.type = "bar";
        series.data = nbardata;
        seriesdata.push(series);
    }
    

    var option = {
        backgroundColor: optionatt.backgroundColor,
        color: optionatt.color,
        noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
                effect: {
                    n: 0
                }
            }
        },
        title: {
            text: optionatt.Title,
            itemGap: 10,
            textStyle: {
                color: optionatt.textStyle
            },
            subtextStyle: {
                color: optionatt.subtextStyle
            },
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
    visualMap: {
        min: 0,
        max: maxvalue,
        left: 'right',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        colorLightness: [0.2, 100],
        color: ['#c05050','#e5cf0d','#5ab1ef'],
        dimension: 0
    },
        grid:{
        left: 45,
        right: '55%',
            borderWidth:0
        },
        xAxis : [
            {
                type : 'value',
                position: 'top',
                name: optionatt.xShowName,
                splitLine: {show:false}
            }
        ],
        yAxis : [
            {
                type : 'category',
                splitLine: {show:false},
                name: optionatt.yShowName,
                axisLabel: {
                    interval:0
                },
                data : areadata
            }
        ],
        legend: {
            orient: 'horizontal',
            x: 'center',
            y:'bottom',
            data: legendvalue
        },
        series: seriesdata
    };

    return option;
}


function NumDescSort(a,b){
    return a.ItemCount-b.ItemCount;
}



EchartsMapComponent.Map003 = function (data1, optionatt) {
    this._tableData = data1;

    
 var data = [{
    "time": 2013,
    "data": [{
        "name": "台湾",
        "value": [633.76, 12.28, "台湾"]
    }, {
        "name": "香港",
        "value": [432.47, 8.38, "香港"]
    }, {
        "name": "江苏",
        "value": [319.80, 6.20, "江苏"]
    }, {
        "name": "上海",
        "value": [311.89, 6.05, "上海"]
    }, {
        "name": "山东",
        "value": [292.13, 5.66, "山东"]
    }, {
        "name": "辽宁",
        "value": [281, 5.45, "辽宁"]
    }, {
        "name": "广东",
        "value": [249.65, 4.84, "广东"]
    }, {
        "name": "四川",
        "value": [229.31, 4.44, "四川"]
    }, {
        "name": "河南",
        "value": [229.16, 4.44, "河南"]
    }, {
        "name": "黑龙江",
        "value": [221.00, 4.28, "黑龙江"]
    }]
}, {
    "time": 2014,
    "data": [{
        "name": "台湾",
        "value": [27435.15, 19.47, "台湾"]
    }, {
        "name": "香港",
        "value": [14201.59, 10.08, "香港"]
    }, {
        "name": "广东",
        "value": [10741.25, 7.62, "广东"]
    }, {
        "name": "江苏",
        "value": [8553.69, 6.07, "江苏"]
    }, {
        "name": "山东",
        "value": [8337.47, 5.92, "山东"]
    }, {
        "name": "浙江",
        "value": [6141.03, 4.36, "浙江"]
    }, {
        "name": "河南",
        "value": [5052.99, 3.59, "河南"]
    }, {
        "name": "河北",
        "value": [5043.96, 3.58, "河北"]
    }, {
        "name": "上海",
        "value": [4771.17, 3.39, "上海"]
    }, {
        "name": "辽宁",
        "value": [4669.10, 3.31, "辽宁"]
    }]
},{
    "time": 2015,
    "data": [{
        "name": "台湾",
        "value": [30792.89, 12.52, "台湾"]
    }, {
        "name": "广东",
        "value": [22527.37, 9.16, "广东"]
    }, {
        "name": "江苏",
        "value": [18598.69, 7.56, "江苏"]
    }, {
        "name": "山东",
        "value": [18366.87, 7.47, "山东"]
    }, {
        "name": "香港",
        "value": [14869.68, 6.05, "香港"]
    }, {
        "name": "浙江",
        "value": [13417.68, 5.46, "浙江"]
    }, {
        "name": "河南",
        "value": [10587.42, 4.30, "河南"]
    }, {
        "name": "河北",
        "value": [10043.42, 4.08, "河北"]
    }, {
        "name": "上海",
        "value": [9247.66, 3.76, "上海"]
    }, {
        "name": "辽宁",
        "value": [8047.3, 3.27, "辽宁"]
    }]
} ,{
    "time": 2016,
    "data": [{
        "name": "广东",
        "value": [46036.25, 9.49, "广东"]
    }, {
        "name": "江苏",
        "value": [41425.48, 8.54, "江苏"]
    }, {
        "name": "山东",
        "value": [39169.92, 8.08, "山东"]
    }, {
        "name": "台湾",
        "value": [30205.64, 6.23, "台湾"]
    }, {
        "name": "浙江",
        "value": [27747.65, 5.72, "浙江"]
    }, {
        "name": "河南",
        "value": [23092.36, 4.76, "河南"]
    }, {
        "name": "河北",
        "value": [20394.26, 4.21, "河北"]
    }, {
        "name": "辽宁",
        "value": [18457.3, 3.81, "辽宁"]
    }, {
        "name": "四川",
        "value": [17185.48, 3.54, "四川"]
    }, {
        "name": "上海",
        "value": [17165.98, 3.54, "上海"]
    }]
} ,{
    "time": 2017,
    "data": [{
        "name": "广东",
        "value": [72812.55, 9.35, "广东"]
    }, {
        "name": "江苏",
        "value": [70116.38, 9, "江苏"]
    }, {
        "name": "山东",
        "value": [63002.3, 8.09, "山东"]
    }, {
        "name": "浙江",
        "value": [42886, 5.51, "浙江"]
    }, {
        "name": "河南",
        "value": [37010.25, 4.75, "河南"]
    }, {
        "name": "台湾",
        "value": [32604.52, 4.19, "台湾"]
    }, {
        "name": "四川",
        "value": [30103.1, 3.87, "四川"]
    }, {
        "name": "河北",
        "value": [29806.1, 3.83, "河北"]
    }, {
        "name": "湖北",
        "value": [29550.19, 3.8, "湖北"]
    }, {
        "name": "湖南",
        "value": [29047.20, 3.73, "湖南"]
    }]
} ]


var option = {
        backgroundColor: window._webconfig.mobilebackgroundColor,
        color: window._webconfig.mobilecolor,

    baseOption: {
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'quinticInOut',
        timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            inverse: true,
            playInterval: 5000,
            left: null,
            right: 5,
            top: 20,
            bottom: 20,
            width: 46,
            height: null,
            symbol: 'none',
            data: data.map(function(ele) {
                return ele.time
            })
        },
        title: {
            text: '全国试剂销量',
            subtext: '亿元',
            left: 'center',
            top: 'top'
        },
        tooltip: {
            formatter: function(params) {
                if ('value' in params.data) {
                    return params.data.value[2] + ': ' + params.data.value[0];
                }
            }
        },
        grid: {
            left: 10,
            right: '45%',
            top: '65%',
            bottom: 10
        },
        xAxis: {},
        yAxis: {},
        series: [{
            id: 'map',
            type: 'map',
            mapType: 'china',
            top: '10%',
            itemStyle : {
                normal: { label: { show: true} },
                emphasis: { label: { show: true} }
            },
            //bottom: '25%',
            //left: '5%',
            //right: '10%',
            data: []
        }, {
            id: 'bar',
            type: 'bar',
            tooltip: {
                show: false
            },
            label: {
                normal: {
                    show: true,
                    fontSize:10,
                    position: 'right'
                }
            },
            data: []
        }]
    },
    options: []
}

for (var i = 0; i < data.length; i++) {
    //计算其余省份GDP
    var restPercent = 100;
    var restValue = 0;
    data[i].data.forEach(function(ele) {
        restPercent = restPercent - ele.value[1];
    });
    restValue = data[i].data[0].value[0] * (restPercent / data[i].data[0].value[1]);
    console.log(restPercent);
    console.log(restValue);
    option.options.push({
        visualMap: [{
            //type:'continous',
            //type: 'continuous',
            calculable: true,
            dimension: 0,
            left: 10,
            top: '15%',
            itemWidth: 12,
            min: data[i].data[9].value[0],
            max: data[i].data[0].value[0],
            text: ['High', 'Low'],
        }],
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.1],
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                show: false,
                textStyle: {
                    color: '#ddd'
                }
            },

            data: data[i].data.map(function(ele) {
                return ele.value[2]
            }).reverse()
        },
        series: [{
            id: 'map',
            itemStyle : {
                normal: { label: { show: true} },
                emphasis: { label: { show: true} }
            },
            data: data[i].data
        }, {
            id: 'bar',
            label: {
                normal: {
                    position: 'right',
                    fontSize:10,
                    formatter: '{b} : {c}'
                }
            },
            data: data[i].data.map(function(ele) {
                return ele.value[0]
            }).sort(function(a, b) {
                return a > b
            })
        }]
    })
}


return option;
}