
var EchartsBoxComponent = {};

//TAT箱线图
EchartsBoxComponent.Box001 = function (data, optionatt) {
    this._tableData = data;
    if (this._tableData.length <= 0) {
        return;
    }
    var legendvalue = new Array();
    var xaxisdata = new Array();
    var xaxisdata_1 = new Array();//X轴集合显示
    var seriesdata = new Array();
    var pictorialseriesdata = new Array();


    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合
        for (var i = 0; i < xaxisdata.length - 1; i++) {
            xaxisdata_1.push(xaxisdata[i] + "-" + xaxisdata[i + 1]);
        }
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].ItemName.length > 0 && !legendvalue.contains(data[i].ItemName)) {
            legendvalue.push(data[i].ItemName); //项目集合
        }

        if (optionatt.XValue.length <= 0) {
            if (data[i].XValue != null && data[i].XValue != "" && !xaxisdata.contains(data[i].XValue)) {
                xaxisdata.push(data[i].XValue); //X轴数据集合
                xaxisdata_1.push(data[i].XValue); //X轴数据集合
            }
        }
    }
    //均线值
    var avgvalue = window._webconfig.avgValue;

    var avgvaluedata = new Array();

    for (var i = 0; i < legendvalue.length; i++) {
        var tboxdata = new Array();
        avgvaluedata = new Array();
        for (var j = 0; j < xaxisdata.length; j++) {
            var ndata = new Array();
            var nmaxvalue = 0;
            var nminvalue = 0;
            avgvaluedata.push(avgvalue);
            if (this._tableData[0]["Average"] != undefined) {
            }
            for (var m = 0; m < this._tableData.length; m++) {
                if (this._tableData[m].ItemName == legendvalue[i]) {
                    if (optionatt.XValueCondition == 1) {
                        if (this._tableData[m].XValue == xaxisdata[j]) {
                            if (parseInt(this._tableData[m].ItemCount) > 0) {
                                ndata.push(parseInt(this._tableData[m].ItemCount));
                                if (ndata.length == 1) {
                                    nmaxvalue = ndata[0];
                                    nminvalue = ndata[0];
                                }
                                if (parseInt(this._tableData[m].ItemCount) > nmaxvalue) {
                                    nmaxvalue = parseInt(this._tableData[m].ItemCount);
                                }
                                if (parseInt(this._tableData[m].ItemCount) < nminvalue) {
                                    nminvalue = parseInt(this._tableData[m].ItemCount);
                                }
                            }
                        }
                    }
                    else {
                        if (j >= xaxisdata.length - 1) {
                            continue;
                        }
                        if (DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) < xaxisdata[j + 1] && DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) >= xaxisdata[j]) {
                            if (parseInt(this._tableData[m].ItemCount) > 0) {
                                ndata.push(parseInt(this._tableData[m].ItemCount));
                                if (ndata.length == 1) {
                                    nmaxvalue = ndata[0];
                                    nminvalue = ndata[0];
                                }
                                if (parseInt(this._tableData[m].ItemCount) > nmaxvalue) {
                                    nmaxvalue = parseInt(this._tableData[m].ItemCount);
                                }
                                if (parseInt(this._tableData[m].ItemCount) < nminvalue) {
                                    nminvalue = parseInt(this._tableData[m].ItemCount);
                                }
                            }
                        }
                    }
                }
            }
            //范围
            if (optionatt.XValueCondition == 2) {
                if (j >= xaxisdata.length - 1) {
                    continue;
                }
            }
            var nmidvalue = 0;
            var npervalue90 = 0;
            var npervalue10 = 0;
            if (ndata.length > 0) {
                if (ndata.length == 1) {
                    nmidvalue = ndata[0];
                    npervalue90 = ndata[0];
                    npervalue10 = ndata[0];
                }
                else {
                    nmidvalue = percentile(ndata, 50);
                    npervalue90 = percentile(ndata, 90);
                    npervalue10 = percentile(ndata, 10);
                }
            }
            tboxdata.push(new Array());
            tboxdata[j][0] = nmaxvalue;
            tboxdata[j][1] = npervalue90;
            tboxdata[j][2] = nmidvalue;
            tboxdata[j][3] = npervalue10;
            tboxdata[j][4] = nminvalue;
        }
        var tmodel = {};
        tmodel.name = legendvalue[i];
        tmodel.type = 'boxplot';
        tmodel.data = tboxdata;

        if (optionatt.report.AvgValueLine && optionatt.report.AvgValueLine > 0) {
            tmodel.markLine = {
                data: [
                    {
                        name: '均线',
                        yAxis: optionatt.report.AvgValueLine
                    }
                ]
            }
        }

        tmodel.itemStyle = {
            normal: {
                borderWidth: 2
            },
            emphasis: {
                borderWidth: 2
            }
        };
        tmodel.tooltip = { formatter: formatter }
        seriesdata.push(tmodel);

        var series = {};
        series.type = "line";
        series.name = legendvalue[i];
        series.data = tboxcountdata;
        series.yAxisIndex = 1;
        if (optionatt.report.isShowValue) {
            series.label = {
                normal: {
                    show: true,
                    position: 'top'
                }
            };
        }
        pictorialseriesdata.push(series);
    }

    for (var p = 0; p < pictorialseriesdata.length; p++) {
        seriesdata.push(pictorialseriesdata[p]);
    }


    option = {
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
            subtext: optionatt.SubTitle,
            x: 'left'
        },
        legend: {
            data: legendvalue
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            orient: optionatt.ToolBoxOrient,
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '10%',
            top: '20%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: xaxisdata_1,
        },
        yAxis: {
            type: 'value',
            name: optionatt.yShowName,
            splitArea: {
                show: false
            }
        },
        series: seriesdata
    };


    return option;
}


//TAT箱线图
EchartsBoxComponent.Box002 = function (data, optionatt) {
    this._tableData = data;
    if (this._tableData.length <= 0) {
        return;
    }
    if (this._tableData[0].boxData != undefined) {
        return EchartsBoxComponent.Box003(data, optionatt);
    }
    var legendvalue = new Array();
    var xaxisdata = new Array();
    var xaxisdata_1 = new Array();//X轴集合显示
    var seriesdata = new Array();
    var pictorialseriesdata = new Array();


    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合
        for (var i = 0; i < xaxisdata.length - 1; i++) {
            xaxisdata_1.push(xaxisdata[i] + "-" + xaxisdata[i + 1]);
        }
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].ItemName.length > 0 && !legendvalue.contains(data[i].ItemName)) {
            legendvalue.push(data[i].ItemName); //项目集合
        }

        if (optionatt.XValue.length <= 0) {
            if (data[i].XValue != null && data[i].XValue != "" && !xaxisdata.contains(data[i].XValue)) {
                xaxisdata.push(data[i].XValue); //X轴数据集合
                xaxisdata_1.push(data[i].XValue); //X轴数据集合
            }
        }
    }
    //均线值
    var avgvalue = window._webconfig.avgValue;

    var avgvaluedata = new Array();

    for (var i = 0; i < legendvalue.length; i++) {
        if (legendvalue[i] == "") {
            continue;
        }
        var tboxdata = new Array();
        var tboxcountdata = new Array();
        var nmindata = new Array();
        avgvaluedata = new Array();
        for (var j = 0; j < xaxisdata.length; j++) {
            var ndata = new Array();
            var nmaxvalue = 0;
            var nminvalue = 0;
            avgvaluedata.push(avgvalue);
            if (this._tableData[0]["Average"] != undefined) {
            }
            for (var m = 0; m < this._tableData.length; m++) {
                if (this._tableData[m].ItemName == legendvalue[i]) {
                    if (optionatt.XValueCondition == 1) {
                        if (this._tableData[m].XValue == xaxisdata[j]) {
                            if (parseInt(this._tableData[m].ItemCount) > 0) {
                                ndata.push(parseInt(this._tableData[m].ItemCount));
                                if (ndata.length == 1) {
                                    nmaxvalue = ndata[0];
                                    nminvalue = ndata[0];
                                }
                                if (parseInt(this._tableData[m].ItemCount) > nmaxvalue) {
                                    nmaxvalue = parseInt(this._tableData[m].ItemCount);
                                }
                                if (parseInt(this._tableData[m].ItemCount) < nminvalue) {
                                    nminvalue = parseInt(this._tableData[m].ItemCount);
                                }
                            }
                        }
                    }
                    else {
                        if (j >= xaxisdata.length - 1) {
                            continue;
                        }
                        if (DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) < xaxisdata[j + 1] && DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) >= xaxisdata[j]) {
                            if (parseInt(this._tableData[m].ItemCount) > 0) {
                                ndata.push(parseInt(this._tableData[m].ItemCount));
                                if (ndata.length == 1) {
                                    nmaxvalue = ndata[0];
                                    nminvalue = ndata[0];
                                }
                                if (parseInt(this._tableData[m].ItemCount) > nmaxvalue) {
                                    nmaxvalue = parseInt(this._tableData[m].ItemCount);
                                }
                                if (parseInt(this._tableData[m].ItemCount) < nminvalue) {
                                    nminvalue = parseInt(this._tableData[m].ItemCount);
                                }
                            }
                        }
                    }
                }
            }
            //范围
            if (optionatt.XValueCondition == 2) {
                if (j >= xaxisdata.length - 1) {
                    continue;
                }
            }
            tboxdata.push(ndata);
            var ncount = ndata.length;
            tboxcountdata.push(ncount);
            nmindata.push(nminvalue);
        }

        var boxplotdata = new Array();
        boxplotdata = echarts.dataTool.prepareBoxplotData(tboxdata);
        //        for(var n=0;n< boxplotdata.boxData.length;n++){
        //            boxplotdata.boxData[n][0] = nmindata[n];
        //        }
        var tmodel = {};
        tmodel.name = legendvalue[i];
        tmodel.type = 'boxplot';
        tmodel.data = boxplotdata.boxData;

        if (optionatt.report.AvgValueLine && optionatt.report.AvgValueLine > 0) {
            tmodel.markLine = {
                data: [
                    {
                        name: '均线',
                        yAxis: optionatt.report.AvgValueLine
                    }
                ]
            }
        }

        tmodel.itemStyle = {
            normal: {
                borderWidth: 2
            },
            emphasis: {
                borderWidth: 2
            }
        };

        tmodel.tooltip = { formatter: formatter1 }
        seriesdata.push(tmodel);


        var tmodel = {};
        tmodel.name = legendvalue[i];
        tmodel.type = 'pictorialBar';
        tmodel.data = boxplotdata.outliers;
        tmodel.symbolPosition = 'end';
        tmodel.symbolSize = 8;
        tmodel.barGap = "30%";
        pictorialseriesdata.push(tmodel);

        var series = {};
        series.type = "line";
        series.name = legendvalue[i];
        series.data = tboxcountdata;
        series.yAxisIndex = 1;
        if (optionatt.report.isShowValue) {
            series.label = {
                normal: {
                    show: true,
                    position: 'top'
                }
            };
        }
        pictorialseriesdata.push(series);
    }

    for (var p = 0; p < pictorialseriesdata.length; p++) {
        seriesdata.push(pictorialseriesdata[p]);
    }

    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    var yMaxValue1 = null;
    if (optionatt.report.YMaxValue1 != undefined && optionatt.report.YMaxValue1 > 0) {
        yMaxValue1 = optionatt.report.YMaxValue1;
    }



    option = {
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
            subtext: optionatt.SubTitle,
            x: 'left'
        },
        legend: {
            data: legendvalue
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            orient: optionatt.ToolBoxOrient,
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '10%',
            top: '20%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: xaxisdata_1,
        },
        yAxis: [{
            type: 'value',
            name: optionatt.yShowName,
            splitArea: {
                show: false
            }
        },
        {
            name: optionatt.yShowName1,
            type: 'value',
            max: yMaxValue1,
            axisLabel: {
                formatter: '{value}'
            }
        }],
        series: seriesdata
    };


    return option;
}


//TAT箱线图
EchartsBoxComponent.Box003 = function (data, optionatt) {
    this._tableData = data;
    if (this._tableData.length <= 0) {
        return;
    }
    var legendvalue = new Array();
    var xaxisdata = new Array();
    var xaxisdata_1 = new Array();//X轴集合显示
    var seriesdata = new Array();
    var pictorialseriesdata = new Array();


    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合
        for (var i = 0; i < xaxisdata.length - 1; i++) {
            xaxisdata_1.push(xaxisdata[i] + "-" + xaxisdata[i + 1]);
        }
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].ItemName.length > 0 && !legendvalue.contains(data[i].ItemName)) {
            legendvalue.push(data[i].ItemName); //项目集合
        }

        if (optionatt.XValue.length <= 0) {
            if (data[i].XValue != null && data[i].XValue != "" && !xaxisdata.contains(data[i].XValue)) {
                xaxisdata.push(data[i].XValue); //X轴数据集合
                xaxisdata_1.push(data[i].XValue); //X轴数据集合
            }
        }
    }
    //均线值
    var avgvalue = window._webconfig.avgValue;

    var avgvaluedata = new Array();

    for (var i = 0; i < legendvalue.length; i++) {
        if (legendvalue[i] == "") {
            continue;
        }
        var boxplotdata = new Array();
        boxplotdata.boxData = new Array();
        boxplotdata.outliers = new Array();
        boxplotdata.axisData = new Array();
        var tboxcountdata = new Array();
        avgvaluedata = new Array();
        for (var j = 0; j < xaxisdata.length; j++) {
            avgvaluedata.push(avgvalue);
            var ncount = 0;
            if (this._tableData[0]["Average"] != undefined) {
            }
            for (var m = 0; m < this._tableData.length; m++) {
                if (this._tableData[m].ItemName == legendvalue[i]) {
                    if (optionatt.XValueCondition == 1) {
                        if (this._tableData[m].XValue == xaxisdata[j]) {
                            boxplotdata.boxData.push(this._tableData[m].boxData);
                            ncount += parseInt(this._tableData[m].ItemValue);
                            boxplotdata.axisData.push(j + '');
                            break;
                        }
                    }
                    else {
                        if (j >= xaxisdata.length - 1) {
                            continue;
                        }
                        if (this._tableData[m].XValue < xaxisdata[j + 1] && this._tableData[m].XValue >= xaxisdata[j]) {
                            boxplotdata.boxData.push(this._tableData[m].boxData);
                            boxplotdata.outliers.push.apply(boxplotdata.outliers, this._tableData[m].outliers)
                            ncount += parseInt(this._tableData[m].ItemValue);
                            boxplotdata.axisData.push(j + '');
                            break;
                        }
                    }
                }
            }
            //范围
            if (optionatt.XValueCondition == 2) {
                if (j >= xaxisdata.length - 1) {
                    continue;
                }
            }
            tboxcountdata.push(ncount);
        }

        //var boxplotdata = new Array();
        //boxplotdata = echarts.dataTool.prepareBoxplotData(tboxdata);
        //        for(var n=0;n< boxplotdata.boxData.length;n++){
        //            boxplotdata.boxData[n][0] = nmindata[n];
        //        }
        var tmodel = {};
        tmodel.name = legendvalue[i];
        tmodel.type = 'boxplot';
        tmodel.data = boxplotdata.boxData;

        if (optionatt.report.AvgValueLine && optionatt.report.AvgValueLine > 0) {
            tmodel.markLine = {
                data: [
                    {
                        name: '均线',
                        yAxis: optionatt.report.AvgValueLine
                    }
                ]
            }
        }

        tmodel.itemStyle = {
            normal: {
                borderWidth: 2
            },
            emphasis: {
                borderWidth: 2
            }
        };

        tmodel.tooltip = { formatter: formatter1 }
        seriesdata.push(tmodel);


        var tmodel = {};
        tmodel.name = legendvalue[i];
        tmodel.type = 'pictorialBar';
        tmodel.data = boxplotdata.outliers;
        tmodel.symbolPosition = 'end';
        tmodel.symbolSize = 8;
        tmodel.barGap = "30%";
        pictorialseriesdata.push(tmodel);

        var series = {};
        series.type = "line";
        series.name = legendvalue[i];
        series.data = tboxcountdata;
        series.yAxisIndex = 1;
        if (optionatt.report.isShowValue) {
            series.label = {
                normal: {
                    show: true,
                    position: 'top'
                }
            };
        }
        pictorialseriesdata.push(series);
    }

    for (var p = 0; p < pictorialseriesdata.length; p++) {
        seriesdata.push(pictorialseriesdata[p]);
    }

    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    var yMaxValue1 = null;
    if (optionatt.report.YMaxValue1 != undefined && optionatt.report.YMaxValue1 > 0) {
        yMaxValue1 = optionatt.report.YMaxValue1;
    }



    option = {
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
            subtext: optionatt.SubTitle,
            x: 'left'
        },
        legend: {
            data: legendvalue
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            orient: optionatt.ToolBoxOrient,
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '10%',
            top: '20%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: xaxisdata_1,
        },
        yAxis: [{
            type: 'value',
            name: optionatt.yShowName,
            splitArea: {
                show: false
            }
        },
        {
            name: optionatt.yShowName1,
            type: 'value',
            max: yMaxValue1,
            axisLabel: {
                formatter: '{value}'
            }
        }],
        series: seriesdata
    };


    return option;
}

function formatter(param) {
    return [
        ' ' + param.name + ': ',
        'max: ' + param.data[1],
        '90百分位: ' + param.data[2],
        '中位数: ' + param.data[3],
        '10百分位: ' + param.data[4],
        'min: ' + param.data[5]
    ].join('<br/>')
}

function formatter1(param) {
    return [
        ' ' + param.name + ': ',
        'upper: ' + param.data[5],
        'Q3: ' + param.data[4],
        '中位数: ' + param.data[3],
        'Q1: ' + param.data[2],
        'lower: ' + param.data[1]
    ].join('<br/>')
}

function percentile(data, percent) {
    //按数量 从小到大排序
    data.sort(function (a, b) {
        return a - b
    });

    var position = percent * data.length / 100;
    var integer = parseInt(position);
    var flt = position - integer;
    if (position < 1) {
        return data[0];
    }
    if (flt > 0) {
        //有小数需要分权
        var a1 = data[integer - 1];
        var a2 = data[integer];
        var v = a1 * (1 - flt) + a2 * flt;
        return parseInt(v);
    }
    else {
        return data[integer - 1];
    }
}