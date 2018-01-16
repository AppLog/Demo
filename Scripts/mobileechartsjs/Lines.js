
var EchartsLineComponent = {};
//柱形图 横向 ItemName,ItemCount
EchartsLineComponent.Line001 = function (data, optionatt) {
    _tableData = data;
    //    if(_tableData.length <= 0)
    //    {
    //        return null;
    //    }
    var legendvalue = new Array(); //项目集合
    var xaxisdata = new Array(); //X轴集合
    var xaxisdata_1 = new Array(); //X轴集合显示
    var yaxisdata = new Array(); //y轴集合
    var fields = new Array(); //数据列集合

    var seriesdata = new Array();
    var hasxvalue = false; //是否包含xvalue列
    var hasitemvalue = false; //是否双Y轴
    var hasitemgroup = false; //是否包含分组
    var itemgroupvalue = new Array();

    for (var key in _tableData[0]) {
        if (key.length > 0 && !fields.contains(key)) {
            fields.push(key);
            if (key == "XValue") {
                hasxvalue = true;
            }
            if (key == "ItemValue") {
                hasitemvalue = true;
            }
            if (key == "ItemGroup") {
                hasitemgroup = true;
            }
        }
    }
    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合

        if (optionatt.XValueCondition == 1) {
            for (var i = 0; i < xaxisdata.length; i++) {
                xaxisdata_1.push(xaxisdata[i]);
            }
        }
        else {
            for (var i = 0; i < xaxisdata.length - 1; i++) {
                xaxisdata_1.push(xaxisdata[i] + "-" + xaxisdata[i + 1]);
            }
        }
    }
    //循环得到 系列项目 和 X轴数据集合
    for (var i = 0; i < _tableData.length; i++) {
        if (hasxvalue) {
            if (_tableData[i].ItemName.toString() != "" && !legendvalue.contains(_tableData[i].ItemName.toString())) {
                legendvalue.push(_tableData[i].ItemName.toString());
                if (hasitemgroup) {
                    itemgroupvalue.push(_tableData[i].ItemGroup);
                }
            }

            if (optionatt.XValue.length <= 0 && !xaxisdata.contains(_tableData[i].XValue)) {
                xaxisdata.push(_tableData[i].XValue);
                xaxisdata_1.push(_tableData[i].XValue);
            }
        }
        else {
            if (optionatt.XValue.length <= 0 && _tableData[i].ItemName.toString() != "" && !xaxisdata.contains(_tableData[i].ItemName.toString())) {
                xaxisdata.push(_tableData[i].ItemName.toString());
                xaxisdata_1.push(_tableData[i].ItemName.toString());
            }
        }
    }

    function initSeriesData(legend, group) {
        var ndata = new Array();
        var ndata1 = new Array();
        var nmaxvalue = 0;
        var nminvalue = 0;

        for (var j = 0; j < xaxisdata.length; j++) {
            //范围
            if (optionatt.XValueCondition == 2) {
                if (j >= xaxisdata.length - 1) {
                    continue;
                }
            }
            ndata.push(0);
            ndata1.push(0);
            for (var m = 0; m < _tableData.length; m++) {
                if (legend != "") {
                    if (_tableData[m].ItemName == legend) {
                        if (optionatt.XValueCondition == 1) {
                            if (this._tableData[m].XValue == xaxisdata[j]) {
                                if (parseInt(_tableData[m].ItemCount) > 0) {
                                    ndata[j] += _tableData[m].ItemCount;
                                    if (ndata[j] > nmaxvalue) {
                                        nmaxvalue = ndata[j];
                                    }
                                    if (ndata[j] < nminvalue) {
                                        nminvalue = ndata[j];
                                    }
                                }
                                //双Y轴
                                if (hasitemvalue) {
                                    if (parseInt(_tableData[m].ItemValue) > 0)
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                        else {
                            if (DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) < xaxisdata[j + 1] && DateComponent.formatDatePart(optionatt.report, _tableData[m].XValue) >= xaxisdata[j]) {
                                if (parseInt(_tableData[m].ItemCount) > 0) {
                                    ndata[j] += _tableData[m].ItemCount;
                                    if (ndata[j] > nmaxvalue) {
                                        nmaxvalue = ndata[j];
                                    }
                                    if (ndata[j] < nminvalue) {
                                        nminvalue = ndata[j];
                                    }
                                }
                                //双Y轴
                                if (hasitemvalue) {
                                    if (parseInt(_tableData[m].ItemValue) > 0)
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                    }
                }
                else {
                    if (optionatt.XValueCondition == 1) {
                        if (this._tableData[m].ItemName == xaxisdata[j]) {
                            if (parseInt(_tableData[m].ItemCount) > 0) {
                                ndata[j] += _tableData[m].ItemCount;
                                if (ndata[j] > nmaxvalue) {
                                    nmaxvalue = ndata[j];
                                }
                                if (ndata[j] < nminvalue) {
                                    nminvalue = ndata[j];
                                }
                            }
                            //双Y轴
                            if (hasitemvalue) {
                                if (parseInt(_tableData[m].ItemValue) > 0)
                                    ndata1[j] += _tableData[m].ItemValue;
                            }
                        }
                    }
                    else {
                        if (DateComponent.formatDatePart(optionatt.report, this._tableData[m].ItemName) < xaxisdata[j + 1] && DateComponent.formatDatePart(optionatt.report, _tableData[m].ItemName) >= xaxisdata[j]) {
                            if (parseInt(_tableData[m].ItemCount) > 0) {
                                ndata[j] += _tableData[m].ItemCount;
                                if (ndata[j] > nmaxvalue) {
                                    nmaxvalue = ndata[j];
                                }
                                if (ndata[j] < nminvalue) {
                                    nminvalue = ndata[j];
                                }
                            }
                            //双Y轴
                            if (hasitemvalue) {
                                if (parseInt(_tableData[m].ItemValue) > 0)
                                    ndata1[j] += _tableData[m].ItemValue;
                            }
                        }
                    }
                }
            }
        }

        var series = {};
        series.type = "line";
        series.name = legend;
        if (optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0) {
            series.barWidth = optionatt.report.BarWidth;
        }

        if (optionatt.report.isPercent) {
            if (optionatt.report.isShowValue) {
                series.label = {
                    normal: {
                        show: true,
                        formatter: '{c}%',
                        position: 'top'
                    }
                };
            }
            var sumcount = 0;
            for (var d = 0; d < ndata.length; d++) {
                sumcount += ndata[d];
            }
            for (var d = 0; d < ndata.length; d++) {
                ndata[d] = parseFloat((ndata[d] * 100) / sumcount).toFixed(0);
            }
        }
        else {
            if (optionatt.report.isShowValue) {
                series.label = {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                };
            }
        }

        if (optionatt.report.isShowMaxMin) {
            series.markPoint = {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ]
            };
        }
        if (optionatt.report.isShowAvg) {
            series.markLine = {
                data: [
                    { type: 'average', name: '平均值' }
                ]
            };
        }
        if (hasitemgroup) {
            series.stack = itemgroupvalue[group]; //分组显示
        }

        if (optionatt.report.DataColFormula != undefined && optionatt.report.DataColFormula != "") {
            var nnewdatas = new Array();
            for (var _i = 0; _i < ndata.length; _i++) {
                var formula = optionatt.report.DataColFormula;
                while (formula.indexOf("[1]") >= 0) {
                    formula = formula.replace("[1]", ndata[_i]);
                }
                while (formula.indexOf("[2]") >= 0 && ndata1 != undefined) {
                    formula = formula.replace("[2]", ndata1[_i]);
                    hasitemvalue = 0;
                }
                var nnewdata = eval(formula).toFixed(0);
                nnewdatas.push(nnewdata);
            }
            series.data = nnewdatas;
        }
        else {
            series.data = ndata;
        }
        seriesdata.push(series);

        if (hasitemvalue) {
            var series = {};
            series.type = "bar";
            series.name = legend;
            series.data = ndata1;
            series.yAxisIndex = 1;
            seriesdata.push(series);
        }
    }

    if (legendvalue.length > 0) {
        for (var i = 0; i < legendvalue.length; i++) {
            initSeriesData(legendvalue[i], i);
        }
    }
    else {
        initSeriesData("", 0);
    }

    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    var yMaxValue1 = null;
    if (optionatt.report.YMaxValue1 != undefined && optionatt.report.YMaxValue1 > 0) {
        yMaxValue1 = optionatt.report.YMaxValue1;
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
    //双Y轴
    if (hasitemvalue) {
        var yaxis = {
            name: optionatt.yShowName1,
            type: 'value',
            max: yMaxValue1,
            axisLabel: {
                formatter: '{value}'
            }
        };
        yaxisdata.push(yaxis);
    }

    for (var i = 0; i < yaxisdata.length; i++) {
        if (typeof yaxisdata[i] == "string") {
            yaxisdata[i] = yaxisdata[i].replace("\\n", "\n");
        }
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
            x: 'center',
            subtext: optionatt.SubTitle
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        toolbox: {
            orient: optionatt.ToolBoxOrient,
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['line', 'bar'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '8%',
            right: '10%',
            containLabel: true
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: legendvalue
        },
        yAxis: yaxisdata,
        xAxis: {
            type: 'category',
            name: optionatt.xShowName,
            axisLabel: {
                interval: 0,
                rotate: 45
            },
            data: xaxisdata_1
        },
        series: seriesdata
    };

    return option;
}


EchartsLineComponent.Line002 = function (data, optionatt) {
}

EchartsLineComponent.Line003 = function (data, optionatt) {
}

EchartsLineComponent.Line004 = function (data, optionatt) {
}

//线型图 多条曲线 最大值、最小值为点标记
EchartsLineComponent.Line010 = function (data, optionatt) {
    if (optionatt.XValue.length <= 1) {
        return;
    }

    this._tableData = data;

    var seriesdata = new Array();
    var xAxisData = new Array();

    var nmaxdatas = new Array(); //最大值
    var nmindatas = new Array(); //最小值
    var navgdatas = new Array(); //均线数据
    var nmiddatas = new Array(); //中位数数据
    var nperdatas = new Array(); //百分位数据

    var ndata = new Array();

    for (var j = 0; j < optionatt.XValue.length - 1; j++) {
        var xname = optionatt.XValue[j] + "-" + optionatt.XValue[j + 1];
        xAxisData.push(xname);
        var tmpdata = {};
        tmpdata.xname = xname;
        tmpdata.starttime = optionatt.XValue[j];
        tmpdata.endtime = optionatt.XValue[j + 1];
        tmpdata.data = new Array();
        for (var m = 0; m < this._tableData.length; m++) {
            if (optionatt.dataFilterName != this._tableData[m].ItemName) {
                continue;
            }
            if (DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) < optionatt.XValue[j + 1] && DateComponent.formatDatePart(optionatt.report, this._tableData[m].XValue) >= optionatt.XValue[j]) {
                if (parseInt(this._tableData[m].ItemValue) > 0) {
                    tmpdata.data.push(parseInt(this._tableData[m].ItemValue));
                }
            }
        }
        ndata.push(tmpdata);
    }

    for (var i = 0; i < ndata.length; i++) {
        var nmaxvalue = 0;
        var nminvalue = 0;
        if (ndata[i].data.length > 0) {
            nmaxvalue = ndata[i].data[0];
            nminvalue = ndata[i].data[0];
        }
        for (var j = 0; j < ndata[i].data.length; j++) {
            if (ndata[i].data[j] > nmaxvalue) {
                nmaxvalue = ndata[i].data[j];
            }
            if (ndata[i].data[j] < nminvalue) {
                nminvalue = ndata[i].data[j];
            }
        }
        navgdatas.push(optionatt.avgvalue);
        nmaxdatas.push(nmaxvalue);
        nmindatas.push(nminvalue);
        if (ndata[i].data.length == 0) {
            nmiddatas.push(0);
            nperdatas.push(0);
        }
        else if (ndata[i].data.length == 1) {
            nmiddatas.push(ndata[i].data[0]);
            nperdatas.push(ndata[i].data[0]);
        }
        else {
            nmiddatas.push(percentile(ndata[i].data, 50));
            nperdatas.push(percentile(ndata[i].data, 90));
        }


    }

    //    var tmodel = new SeriesDataTypeModel("均线", 'line', navgdatas);
    //    seriesdata.push(tmodel);
    //    var tmodel = new SeriesDataTypeModel("最高值", 'scatter', nmaxdatas);
    //    seriesdata.push(tmodel);
    //    var tmodel = new SeriesDataTypeModel("最小值", 'scatter', nmindatas);
    //    seriesdata.push(tmodel);

    var legendvalue = new Array();
    legendvalue.push("最高值");
    legendvalue.push("最小值");
    legendvalue.push("中位数");
    legendvalue.push("90百分位数");
    legendvalue.push("均线");

    var tmodel = {};
    tmodel.name = '中位数';
    tmodel.type = 'line';
    tmodel.data = nmiddatas;
    seriesdata.push(tmodel);

    var tmodel = {};
    tmodel.name = '90百分位数';
    tmodel.type = 'line';
    tmodel.data = nperdatas;
    seriesdata.push(tmodel);

    var tmodel = {};
    tmodel.name = '均线';
    tmodel.type = 'line';
    tmodel.data = navgdatas;
    seriesdata.push(tmodel);

    var tmodel = {};
    tmodel.name = '最高值';
    tmodel.type = 'scatter';
    tmodel.data = nmaxdatas;
    seriesdata.push(tmodel);

    var tmodel = {};
    tmodel.name = '最小值';
    tmodel.type = 'scatter';
    tmodel.data = nmindatas;
    seriesdata.push(tmodel);

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
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legendvalue
        },
        toolbox: {
            show: true,
            orient: optionatt.ToolBoxOrient,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} min'
            }
        },
        series: seriesdata
        //        series: [
        //        {name:'最高值',type:'scatter',data:[10,21,31,12,31,123]},
        //        {name:'最小值',type:'scatter',data:[1,2,4,12,21,4]},
        //        {name:'均线',type:'line',data:[60,60,60,60,60,60]}
        //        ]
    };
    return option;
}

