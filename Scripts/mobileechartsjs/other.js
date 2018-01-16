
var EchartsOtherComponent = {};

//表格  ItemName,ItemCount
EchartsOtherComponent.Other002 = function (data, optionatt) {
}

//表格 单行 行转列 ItemName,ItemCount
EchartsOtherComponent.Other003 = function (data, optionatt) {
    _tableData = data;
    var xaxisdata = new Array(); //X轴集合
    var xaxisdata_1 = new Array(); //X轴集合显示
    var totalcount = 0;
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
        for (var i = 0; i < _tableData.length; i++) {
            totalcount += parseInt(_tableData[i].ItemCount);
        }
    }
    else {
        for (var i = 0; i < _tableData.length; i++) {
            xaxisdata.push(_tableData[i].ItemName);
            xaxisdata_1.push(_tableData[i].ItemName);
            totalcount += parseInt(_tableData[i].ItemCount);
        }
    }

    var divhtml = '<div class="formControls col-sm-12 pd-10"><table class="table table-border table-bg">';
    divhtml += '<thead><tr>';
    for (var i = 0; i < xaxisdata_1.length; i++) {
        divhtml += '<th>' + xaxisdata_1[i] + optionatt.SubTitle + '</th>';
    }
    if (optionatt.XValue.length > 0 && optionatt.XValueCondition == 1) {
        divhtml += '<th>更多</th>';
    }
    divhtml += '<th>总计</th>';
    divhtml += '</tr></thead>';

    divhtml += '<tbody><tr>';
    var count = 0;
    for (var i = 0; i < xaxisdata.length; i++) {
        var xvalue = 0;
        if (optionatt.XValueCondition == 1) {
            for (var j = 0; j < _tableData.length; j++) {
                if (xaxisdata[i] == _tableData[j].ItemName) {
                    xvalue += _tableData[j].ItemCount;
                }
            }
            var param = {};
            param.name = xaxisdata[i];
            divhtml += '<td  onclick="myTableOnClickDetailSpecialSampleRoute(\'' + optionatt.report.code + '\',\'' + param.name + '\')" style="cursor: pointer; color: Blue;">' + xvalue + '</td>';
        }
        else {
            if (i == xaxisdata.length - 1) {
                continue;
            }
            for (var j = 0; j < _tableData.length; j++) {
                if (parseInt(_tableData[j].ItemName) < parseInt(xaxisdata[i + 1]) && parseInt(_tableData[j].ItemName) >= parseInt(xaxisdata[i])) {
                    if (parseInt(_tableData[j].ItemCount) > 0) {
                        xvalue += _tableData[j].ItemCount;
                    }
                }
            }
            var param = {};
            param.name = xaxisdata[i] + "-" + xaxisdata[i+1];
            divhtml += '<td  onclick="myTableOnClickDetailSpecialSampleRoute(\'' + optionatt.report.code + '\',\'' + param.name + '\')" style="cursor: pointer; color: Blue;">' + xvalue + '</td>';
        }
        count += xvalue;
    }
    if (optionatt.XValue.length > 0 && optionatt.XValueCondition == 1) {
        var param = {};
        param.name = "more";
        divhtml += '<td onclick="myTableOnClickDetailSpecialSampleRoute(\'' + optionatt.report.code + '\',\'' + param.name + '\')" style="cursor: pointer; color: Blue;">' + (totalcount - count) + '</td>';
    }
    divhtml += '<td>' + totalcount + '</td>';
    divhtml += '</tr></tbody>';
    divhtml += '</table></div>';
    $("#" + optionatt.DivId).html("");
    $("#" + optionatt.DivId).html(divhtml);
    return "other";
}


//TAT 时间轴
EchartsOtherComponent.Other004 = function (data, optionatt) {

    _tableData = data;
    var divhtml = '';

    var legendvalue = new Array(); //项目集合 
    var xaxisdata = new Array(); //X轴集合   

    //循环得到 系列项目 和 X轴数据集合
    for (var i = 0; i < _tableData.length; i++) {
        if (_tableData[i].ItemName.toString() != "" && !legendvalue.contains(_tableData[i].ItemName.toString())) {
            legendvalue.push(_tableData[i].ItemName.toString());
        }
        if (!xaxisdata.contains(_tableData[i].XValue)) {
            xaxisdata.push(_tableData[i].XValue);
        }
    }
    var maxminutes = 0;
    for (var i = 0; i < xaxisdata.length; i++) {
        var xaxis = xaxisdata[i];
        var xminutes = 0;
        for (var j = 0; j < legendvalue.length; j++) {
            var dvalue = 0;
            for (var t = 0; t < _tableData.length; t++) {
                if (_tableData[t].XValue == xaxis && legendvalue[j] == _tableData[t].ItemName) {
                    dvalue = _tableData[t].ItemCount;
                    xminutes += dvalue;
                }
            }
        }
        if (maxminutes < xminutes) {
            maxminutes = xminutes;
        }
    }
    if (legendvalue.length <= 0) {
        return "other";
    }
    var maxwidth = 500;
    var spanwidth = maxwidth / maxminutes;
    divhtml += '<div style="color:' + optionatt.textStyle + '" class="textstyle">' + optionatt.Title + '</div>';
    for (var i = 0; i < xaxisdata.length; i++) {
        var xaxis = xaxisdata[i];
        var lihtml = "";
        var width = 0;
        var xminutes = 0;
        var xwidth = 0;
        var legends = legendvalue[0].split('-');
        lihtml += '<li style="float:left;width:0px;margin-left:0px;"><b></b><label style="width:60px;position: absolute;">' + legends[0] + '<br>0</label></li>';
        for (var j = 0; j < legendvalue.length; j++) {
            var dvalue = 0;
            for (var t = 0; t < _tableData.length; t++) {
                if (_tableData[t].XValue == xaxis && legendvalue[j] == _tableData[t].ItemName) {
                    dvalue = parseInt( _tableData[t].ItemCount);
                    var liwidth = dvalue * spanwidth;
                    width += liwidth;
                    xwidth = width;
                    xminutes += dvalue;
                    legends = legendvalue[j].split('-');
                    var legendstr = legends[0];
                    if (legends.length > 1) {
                        legendstr = legends[1];
                    }
                    lihtml += '<li style="float:left;width:0px;margin-left:' + width + 'px;"><b></b><label style="position: absolute;margin-top: -40px;;margin-left:-' + (liwidth / 2) + 'px;">' + dvalue + '</label><label style="width:100px;position: absolute;">' + legendstr + '<br>' + xminutes + '</label></li>';

                }
            }
        }
        divhtml += '<div class="container"><div style="top: 25px;position: relative;">' + xaxis + '</br>TOTAL</br>' + parseInt(xminutes) + '</div><ul class="time-horizontal" style="width:' + xwidth + 'px">';

        divhtml += lihtml;

        divhtml += '</ul></div>';
    }

    $("#" + optionatt.DivId).html("");
    $("#" + optionatt.DivId).html(divhtml);
    return "other";

}
