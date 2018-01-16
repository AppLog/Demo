
var EchartsMixComponent = {};

var dayList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
var monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

//年报 时间轴显示饼图加柱形图
EchartsMixComponent.Mix001 = function (data, optionatt) {
    _tableData = data;

    var pieseriesdata = new Array();
    var barseriesdata = new Array();
    var yaxisdata = new Array();

    for (var m = 0; m < monthList.length; m++) {
        var datamonth = 0;
        var datadays = new Array();
        for (var d = 0; d < dayList.length; d++) {
            var dayvalue = 0;
            for (var i = 0; i < _tableData.length; i++) {
                if (_tableData[i].ItemName == monthList[m] && _tableData[i].XValue == dayList[d]) {
                    dayvalue += parseInt(_tableData[i].ItemCount);
                }
            }
            datamonth += dayvalue;
            datadays.push(dayvalue);
        }
        //饼图
        var pieseries = {};
        pieseries.name = monthList[m];
        pieseries.value = datamonth;
        pieseriesdata.push(pieseries);
        //柱形图
        var barseries = {};
        barseries.title = {};
        barseries.title.subtext = monthList[m];
        barseries.series = new Array();
        var seriesdata = {};
        seriesdata.data = datadays;
        barseries.series.push(seriesdata);
        barseriesdata.push(barseries);
    }

    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    var yaxis = {
        name: optionatt.yShowName,
        type: 'value',
        max: yMaxValue,
        axisLabel: {
            formatter: '{value}'
        }
    };
    yaxisdata.push(yaxis);

    var option = {
        baseOption: {
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
                subtext: optionatt.SubTitle
            },
            timeline: {
                // y: 0,
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 1500,
                // controlStyle: {
                //     position: 'left'
                // },
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                label: {
                    formatter: function (s) {
                        return s + "月"
                    }
                }
            },
            tooltip: {},

            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [{
                name: "天",
                'type': 'category',
                'axisLabel': {
                    'interval': 0
                },
                'data': ['1', '\n2', '3', '\n4', '5', '\n6', '7', '\n8', '9', '\n10', '11', '\n12', '13', '\n14', '15', '\n16', '17', '\n18', '19', '\n20', '21', '\n22', '23', '\n24', '25', '\n26', '27', '\n28', '29', '\n30', '31'],
                splitLine: {
                    show: false
                }
            }],
            yAxis: yaxisdata,
            series: [
                {
                    name: '',
                    type: 'bar'
                }, 
                {
                    type: 'pie',
                    center: ['75%', '20%'],
                    radius: '25%',
                    data: pieseriesdata
                }
            ]
        },
            options: barseriesdata
    };

    return option;
}

//年报 时间轴显示柱形图
EchartsMixComponent.Mix002 = function (data, optionatt) {
    _tableData = data;

    var barseriesdata = new Array();
    var yaxisdata = new Array();

    for (var m = 0; m < monthList.length; m++) {
        var datamonth = 0;
        var datadays = new Array();
        for (var d = 0; d < dayList.length; d++) {
            var dayvalue = 0;
            for (var i = 0; i < _tableData.length; i++) {
                if (_tableData[i].ItemName == monthList[m] && _tableData[i].XValue == dayList[d]) {
                    dayvalue += parseInt(_tableData[i].ItemCount);
                }
            }
            datamonth += dayvalue;
            datadays.push(dayvalue);
        }

        //柱形图
        var barseries = {};
        barseries.title = {};
        barseries.title.subtext = monthList[m];
        barseries.series = new Array();
        var seriesdata = {};
        seriesdata.data = datadays;
        barseries.series.push(seriesdata);
        barseriesdata.push(barseries);
    }

    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    var yaxis = {
        name: optionatt.yShowName,
        type: 'value',
        max: yMaxValue,
        axisLabel: {
            formatter: '{value}'
        }
    };
    yaxisdata.push(yaxis);

    var option = {
        baseOption: {
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
                subtext: optionatt.SubTitle
            },
            timeline: {
                // y: 0,
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 1500,
                // controlStyle: {
                //     position: 'left'
                // },
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                label: {
                    formatter: function (s) {
                        return s + "月"
                    }
                }
            },
            tooltip: {},

            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [{
                name: "天",
                'type': 'category',
                'axisLabel': {
                    'interval': 0
                },
                'data': ['1', '\n2', '3', '\n4', '5', '\n6', '7', '\n8', '9', '\n10', '11', '\n12', '13', '\n14', '15', '\n16', '17', '\n18', '19', '\n20', '21', '\n22', '23', '\n24', '25', '\n26', '27', '\n28', '29', '\n30', '31'],
                splitLine: {
                    show: false
                }
            }],
            yAxis: yaxisdata,
            series: [
                {
                    name: '',
                    type: 'bar'
                }
            ]
        },
            options: barseriesdata
    };

    return option;
}

//年报 时间轴显示饼图
EchartsMixComponent.Mix003 = function (data, optionatt) {
    _tableData = data;
    
    var legendvalue = new Array();//项目集合
    var seriesdata = new Array();

    //循环得到 系列项目
    for (var i = 0; i < _tableData.length; i++) {
        if (_tableData[i].ItemName.toString() != "" && !legendvalue.contains(_tableData[i].ItemName.toString())) {
            legendvalue.push(_tableData[i].ItemName.toString());
        }
    }
    
    for (var m = 0; m < monthList.length; m++) {
        var monthdata = new Array();
        for(var l=0;l<legendvalue.length;l++) {
            var legenddata = 0;
            for (var i = 0; i < _tableData.length; i++) {
                if(monthList[m] == _tableData[i].XValue && _tableData[i].ItemName == legendvalue[l]) {
                    legenddata +=  _tableData[i].ItemCount;
                }
            }
            var legendseries = {};
            legendseries.name = legendvalue[l];
            legendseries.value = legenddata;
            monthdata.push(legendseries);
        }
        var monthseries = {};
        monthseries.series = new Array();
        var monthseriesdata = {};
        monthseriesdata.data = monthdata;
        monthseries.series.push(monthseriesdata);
        seriesdata.push(monthseries);
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
            x:'center',
            subtext: optionatt.SubTitle
        },
    baseOption: {
    timeline: {
        // y: 0,
        axisType: 'category',
        // realtime: false,
        // loop: false,
        autoPlay: true,
        // currentIndex: 2,
        playInterval: 1500,
        left: 20,
        right: 20,
        // controlStyle: {
        //     position: 'left'
        // },
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        label: {
            formatter: function (s) {
                return s + "月"
            }
        }
    },
    tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
      series: [{
        name: '',
        type: 'pie',
        radius: '36%',
        center: ['50%', '50%'],
        clockwise: false,

        labelLine: {
          normal: {
            show: false
          }
        }
      }],
      color: optionatt.color,
    },
    options: seriesdata
};

return option;

}