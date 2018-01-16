window.nReportStartDate = "";
window.nReportEndDate = "";

window.nShowTitleStartDate = "";
window.nShowTitleEndDate = "";


var EchartsTran = {};

EchartsTran.showReport = function (reportarr) {
    if (isMyDefineCode(reportarr.code)) {
        //加载用户自定义报表
        this.showMyDefineReport(reportarr);
    }
    else {
        this.showSysReport(reportarr); //加载系统报表
    }
}

EchartsTran.showSysReport = function (reportarr) {
    var sqlCondition = reportarr.sqlCondition;
    if (sqlCondition != undefined && sqlCondition != "" && reportarr.appMethod == "proc_simplereport_bysql") {
        //直接调用sql查询
        var Request = new Array();
        Request.ProcedureName = "[" + reportarr.appMethod + "]";
        Request.ParameterNames = ["nSql"];
        Request.ParameterDataTypes = ["vachar(4000)"];
        Request.ParameterValues = [sqlCondition];

        JQGlobal.PostMessage("DB_CallProcedure", Request, reportarr, this, this.buildReportEchartsByData);

    }
    else {
        //通过存储过程获取调用存储过程的参数信息 拼接后再调用存储过程获取数据
        var objRequest = new Array();
        objRequest.ProcedureName = "[proc_getProcParam]";
        objRequest.ParameterNames = ["procName"];
        objRequest.ParameterDataTypes = ["vachar(100)"];
        objRequest.ParameterValues = [reportarr.appMethod];
        var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

        if (objReturn.ErrorID != 0) {
            return false;
        }
        var retTable = getJsonStoreFromTable(objReturn.Table0);
        var ParameterNames = new Array();
        var ParameterDataTypes = new Array();
        var ParameterValues = new Array();
        var hasWhere = false; //是否有where参数
        for (var r = 0; r < retTable.length; r++) {
            if (retTable[r].ParamName.length <= 0 || retTable[r].ParamName == "") {
                continue;
            }
            if (retTable[r].ParamName.toLowerCase() == "strwhere") {
                hasWhere = true;
                continue;
            }
            if (retTable[r].ParamName.toLowerCase() == "ntatlascode") {
                continue;
            }
            if (retTable[r].DataType.toLowerCase() == "varchar") {
                ParameterDataTypes.push(retTable[r].DataType + "(" + retTable[r].Length + ")");
            }
            else {
                ParameterDataTypes.push(retTable[r].DataType);
            }
            ParameterNames.push(retTable[r].ParamName);
            ParameterValues.push(EchartsTran.getParameterValue(retTable[r].ParamName, reportarr));
        }
        if (hasWhere) {
            ParameterNames.push("strwhere");
            ParameterDataTypes.push("VARCHAR(4000)");
            var strwhere = EchartsTran.getWhere(reportarr);
            ParameterValues.push(strwhere);
        }

        if (reportarr.isLasSet && reportarr.LasSet != undefined) {
            ParameterNames.push("nTatLasCode");
            ParameterDataTypes.push("VARCHAR(500)");
            var nTatLasCodeWhere = "";
            for (var l = 0; l < reportarr.LasSet.length; l++) {
                nTatLasCodeWhere += "'" + reportarr.LasSet[l].StartLas + "-" + reportarr.LasSet[l].EndLas + "',";
            }
            nTatLasCodeWhere = " and tb.LasCode in (" + nTatLasCodeWhere.trimEnd(',') + ") ";
            ParameterValues.push(nTatLasCodeWhere);
        }


        var Request = new Array();
        Request.ProcedureName = "[" + reportarr.appMethod + "]";

        Request.ParameterNames = ParameterNames;
        Request.ParameterDataTypes = ParameterDataTypes;
        Request.ParameterValues = ParameterValues;

        JQGlobal.PostMessage("DB_CallProcedure", Request, reportarr, this, this.buildReportEchartsByData);

    }
}

EchartsTran.showMyDefineReport = function (reportarr) {
    if (reportarr.dataSourceType != undefined && reportarr.dataSourceType.toUpperCase() == "ES") {
        var _tableData = ESFun.getMyDefineData(reportarr);
        this.Builder(reportarr, _tableData, reportarr.ShowElementId);
    }
    else {
        var Request = new Array();
        Request.ProcedureName = "[proc_simplereport_userdefine]";
        Request.ParameterNames = ["defineId"];
        Request.ParameterDataTypes = ["int"];
        Request.ParameterValues = [reportarr.CurDefineID];
        JQGlobal.PostMessage("DB_CallProcedure", Request, reportarr, this, this.buildReportEchartsByData);
    }
}

EchartsTran.getParameterValue = function (ParamName, reportarr) {
    var ParameterValue = "";
    if (ParamName.toLowerCase() == "nstarttestdate") {
        ParameterValue = window.nReportStartDate;
    }

    if (ParamName.toLowerCase() == "nendtestdate") {
        ParameterValue = window.nReportEndDate;
    }


    if (ParamName.toLowerCase() == "ntimeflag") {
        ParameterValue = 1;
    }

    return ParameterValue;
}

EchartsTran.buildReportEchartsByData = function (Request, reportarr, Return) {
    var _tableData = getJsonStoreFromTable(Return.Table0);
    this.Builder(reportarr, _tableData, reportarr.ShowElementId);
}

EchartsTran.Builder = function (reportarr, _tableData, elementid) {
    var nOptionAtt = new OptionAtt();
    nOptionAtt.backgroundColor = window._webconfig.backgroundColor;
    nOptionAtt.color = window._webconfig.color;
    if (reportarr.Color != undefined && reportarr.Color != "") {
        var colorarr = new Array();
        var colorsplits = reportarr.Color.split(',');
        for (var i = 0; i < colorsplits.length; i++) {
            colorarr.push(colorsplits[i]);
        }
        if (colorarr.length > 0) {
            nOptionAtt.color = colorarr;
        }
    }
    nOptionAtt.textStyle = window._webconfig.textStyle;
    nOptionAtt.subtextStyle = window._webconfig.subtextStyle;

    nOptionAtt.report = reportarr;
    nOptionAtt.OptionType = reportarr.echartType;

    var colors = nOptionAtt.report.canvasColor.split(",");
    var canvascolor = "#8A826D";
    if (colors.length > 0 && colors[0] != "") {
        canvascolor = colors[0];
        nOptionAtt.textStyle = canvascolor;
    }

    canvascolor = "#E877A3";
    if (colors.length > 1 && colors[1] != "") {
        canvascolor = colors[1];
        nOptionAtt.subtextStyle = canvascolor;
    }

    if (reportarr.textStyle.indexOf("#DATE#") >= 0) {
        nOptionAtt.Title = Request.nstartDate;
    }
    else {
        nOptionAtt.Title = reportarr.textStyle;
    }
    if (reportarr.subtextStyle.indexOf("#DATE#") >= 0) {
        nOptionAtt.SubTitle = Request.nstartDate;
    }
    else {
        nOptionAtt.SubTitle = reportarr.subtextStyle;
    }
    nOptionAtt.LegendOrient = "vertical";
    nOptionAtt.LegendHorizontalType = "left";
    nOptionAtt.ToolBoxOrient = "vertical";
    nOptionAtt.XValueCondition = reportarr.timeCondition;
    if (reportarr.timeType > 0) {
        nOptionAtt.XValue = DateComponent.buildReportXName(reportarr);
    }
    nOptionAtt.yShowName = reportarr.YTitle;
    nOptionAtt.yShowName1 = reportarr.YTitle1;
    nOptionAtt.xShowName = reportarr.xTitle;
    nOptionAtt.DivId = elementid;

    var filterarr = {}; //过滤项目
    filterarr.codes = [];
    var filterstr = UniformConfig.readValue("user", "FilterReportConfig", reportarr.code, "");
    if (filterstr != "") {
        filterarr = Json.fromString(filterstr);
    }
    var tmpdata = [];

    for (var i = 0; i < _tableData.length; i++) {
        var isexist = 0;
        if (_tableData[i]["ItemName"] != undefined) {
            if (filterarr && filterarr.codes.contains(_tableData[i]["ItemName"])) {
                isexist = 1;
            }
        }
        if (_tableData[i]["XValue"] != undefined) {
            if (filterarr && filterarr.codes.contains(_tableData[i]["XValue"])) {
                isexist = 1;
            }
        }
        if (reportarr.isPile) {
            _tableData[i].ItemGroup = "g1";
        }
        if (_tableData[i]["ItemCount"] != undefined) {
            if (isNaN(parseInt(_tableData[i].ItemCount))) {
                _tableData[i].ItemCount = 0;
            }
        }
        if (_tableData[i]["ItemValue"] != undefined) {
            if (isNaN(parseInt(_tableData[i].ItemValue))) {
                _tableData[i].ItemValue = 0;
            }
        }
        if (reportarr.ReportParent1 != undefined && reportarr.ReportParent1.toLowerCase() == "weekreport") {
            if (_tableData[i]["XValue"] != undefined) {
                _tableData[i]["XValue"] = DateComponent.getWeekName(_tableData[i]["XValue"]);
            }
            else {
                if (_tableData[i]["ItemName"] != undefined) {
                    _tableData[i]["ItemName"] = DateComponent.getWeekName(_tableData[i]["ItemName"]);
                }
            }
        }

        if (isexist == 0) {
            tmpdata.push(_tableData[i]);
        }
    }
    var isregister = 1;
    //var isregister = this.isRegister();

    var option = this.TranOption(tmpdata, nOptionAtt);

    if (option == null) {
        var e = document.getElementById(elementid);
        var myChart = echarts.init(e);
        myChart.hideLoading();
        $(e).html("暂无数据");
    }
    else if (option == "canvas" || option == "other") {
        var e = document.getElementById(elementid);
        if (isregister == 0) {
            var div = '<div style="text-align:center;"><img src="../Images/register.png" /></div>';
            $("#" + elementid).html($("#" + elementid).html() + div);
        }
    }
    else {
        if (option.length > 1) {
            //多个option时，生成多个图形
            var e = document.getElementById(elementid);
            var myChart = echarts.init(e);
            // ajax callback
            myChart.hideLoading();
            e.style.overflowX = "auto";
            e.style.overflowY = "auto";
            $(e).html("");
            for (var i = 0; i < option.length; i++) {
                if (isregister == 0) {
                    option[i].graphic = { // 将图片定位到最下方的中间：
                        type: 'image',
                        left: 'center', // 水平定位到中间
                        bottom: '10%',  // 定位到距离下边界 10% 处
                        z: 10,
                        style: {
                            image: '../images/register.png',
                            width: 200,
                            height: 35
                        }
                    };
                }
                var newElement = document.createElement("div");
                newElement.style.height = '310px';
                if (option[i].xAxis.data.length > 15) {
                    var nwidth = option[i].xAxis.data.length * 35;
                    newElement.style.width = nwidth.toString() + 'px';
                }
                else {
                    newElement.style.width = '100%';
                }
                e.appendChild(newElement);

                var myChart1 = echarts.init(newElement);
                myChart1.setOption(option[i], true);
            }
        }
        else {
            if (isregister == 0) {
                option.graphic = { // 将图片定位到最下方的中间：
                    type: 'image',
                    left: 'center', // 水平定位到中间
                    bottom: '5%',  // 定位到距离下边界 10% 处
                    z: 10,
                    style: {
                        image: '../images/register.png',
                        width: 200,
                        height: 35
                    }
                };
            }
            if (nOptionAtt.report.echartType == "bar002" || nOptionAtt.report.echartType == "bar005") {
                //条形图 高度自适应并且加DIV边框
                var e = document.getElementById(elementid);
                $(e).html("");
                e.style.overflowY = "auto";
                var newElement = document.createElement("div");
                var height = option.yAxis.data.length * 40;
                if (height > 340) {
                    $(newElement).height(height);

                    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                    var resizeWorldMapContainer = function () {
                        newElement.style.height = height + 'px';
                    };
                    //设置容器高宽
                    resizeWorldMapContainer();
                }
                else {
                    $(newElement).height('100%');
                }
                e.appendChild(newElement);
                var myChart = echarts.init(newElement);
                // ajax callback
                myChart.hideLoading();
                myChart.setOption(option, true);

                if (reportarr.isClickDetail) {
                    myChart.on('click', function (params) {
                        // 控制台打印数据的名称
                        //                             console.log(params);
                        if (reportarr.code == "dayReportTatBiochemistry" || reportarr.code == "dayReportTatImmune") {
                            myChartOnClickTat(reportarr);
                        }
                        else if (reportarr.DetailSpecial == 1) {
                            //1：表示特殊 生化免疫TAT
                            myChartOnClickDetailSpecial(reportarr, params);
                        }
                        else if (reportarr.DetailSpecial == 2) {
                            //1：表示特殊 模组报警明细
                            myChartOnClickDetailSpecialModuleWarning(reportarr, params);
                        }
                        else if (reportarr.DetailSpecial == 3) {
                            //1：表示特殊 样本轨迹明细
                            myChartOnClickDetailSpecial(reportarr, params);
                        }
                        else {
                            //表示 常规明细
                            myChartOnClick(reportarr, params);
                        }
                    });
                }
            }
            else {
                if (nOptionAtt.report.code == "dayDataBriefWorkdataSampleView" || nOptionAtt.report.code == "dayDataBriefTatOverview") {
                    var length = option.series.length;
                    if (nOptionAtt.report.code == "dayDataBriefTatOverview") {
                        length = option.series.length / 2;
                    }
                    var table = document.getElementById(elementid);
                    var tablestr = "<table class=\"tablestatus\" border=\"0\">";
                    for (var i = 0; i < length; i++) {
                        var tr = "<tr style=\"background-color:" + window._webconfig.color[i] + "\"><td><div class=\"divstatuschild\">" + option.series[i].name + "</div></td><td><div class=\"divstatuschild\"> Max " + option.series[i].max + "</div></td><td><div class=\"divstatuschild\"> Min " + option.series[i].min + "</div></td></tr>";
                        tablestr += tr;
                    }
                    tablestr += "</table>";
                    table.innerHTML = tablestr;
                }
                else {
                    var e = document.getElementById(elementid);
                    //                    e.style.overflowY = "hidden";
                    $(e).html("");
                    var newElement = document.createElement("div");
                    e.appendChild(newElement);
                    $(newElement).height('100%');
                    if ($(newElement).height() <= 100) {
                        $(newElement).height(310);
                    }
                    //                    alert($(newElement).height());
                    var myChart = echarts.init(newElement);
                    // ajax callback
                    myChart.hideLoading();
                    myChart.setOption(option, true);

                    if (reportarr.isClickDetail) {
                        myChart.on('click', function (params) {
                            // 控制台打印数据的名称
                            //                             console.log(params);
                            if (reportarr.code == "dayReportTatBiochemistry" || reportarr.code == "dayReportTatImmune") {
                                myChartOnClickTat(reportarr);
                            }
                            else if (reportarr.DetailSpecial == 1) {
                                //1：表示特殊 生化免疫TAT
                                myChartOnClickDetailSpecial(reportarr, params);
                            }
                            else if (reportarr.DetailSpecial == 2) {
                                //1：表示特殊 模组报警明细
                                myChartOnClickDetailSpecialModuleWarning(reportarr, params);
                            }
                            else if (reportarr.DetailSpecial == 3) {
                                //1：表示特殊 样本轨迹明细
                                myChartOnClickDetailSpecial(reportarr, params);
                            }
                            else {
                                //表示 常规明细
                                myChartOnClick(reportarr, params);
                            }
                        });
                    }
                }
            }
        }
    }
}

//常规明细方法
function myChartOnClick(reportarr, params) {
    if (reportarr.DetailField.length <= 0) {
        return;
    }
    var xAxis = DateComponent.buildReportXName(reportarr);
    $("#divEchartDetails").html("");
    if (reportarr.textStyle != undefined && reportarr.textStyle != null && reportarr.textStyle != "") {
        $("#modal-echartdetail-title").html(reportarr.textStyle);
    }
    var htmlstr = '<div class="row cl"><div class="formControls col-xs-2 col-sm-12"><table class="table table-border table-bg">';
    htmlstr += "<thead><tr>";
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        htmlstr += "<th>" + reportarr.DetailField[i].ShowName + "</th>";
    }
    htmlstr += "</tr></thead>";
    htmlstr += "<tbody>";

    var nstartDate = EchartsTran.getParameterValue("nStartTestDate", reportarr);
    var nendDate = EchartsTran.getParameterValue("nEndTestDate", reportarr);

    if (reportarr.dataSourceType != undefined && reportarr.dataSourceType.toUpperCase() == "ES") {
        var _tableDataDetails = ESFun.getMyDetailDefineData(reportarr, params);
        if (_tableDataDetails != undefined && _tableDataDetails != null && _tableDataDetails.length > 0) {
            for (var i = 0; i < _tableDataDetails.length; i++) {
                htmlstr += "<tr>";
                for (var j = 0; j < reportarr.DetailField.length; j++) {
                    var tdvalue = _tableDataDetails[i][reportarr.DetailField[j].FieldName];
                    if (reportarr.DetailField[j].FieldName.toLowerCase() == "testdate") {
                        tdvalue = DateComponent.getDateByTimeStamp(tdvalue);
                    }
                    if (tdvalue.length > 50) {
                        htmlstr += '<td data-toggle="tooltip" data-placement="bottom" title="' + tdvalue + '">' + tdvalue.substring(0,50) + '...</td>';
                        
                    }
                    else {
                        htmlstr += '<td>' + tdvalue + '</td>';
                    }
                }
                htmlstr += "</tr>";
            }
        }
    }
    else if (reportarr.dataSourceType != undefined && reportarr.dataSourceType.toUpperCase() == "DB") {
        //var _tableData = ESFun.getMyDefineData(reportarr);
    }
    else {
        var Request = new Array();
        Request.ProcedureName = "[" + reportarr.appMethodDetail + "]";
        Request.ParameterNames = ["nStartTestDate", "nEndTestDate", "nName", "nseriesName"];
        Request.ParameterDataTypes = ["vachar(20)", "vachar(20)", "vachar(20)", "vachar(50)"];
        Request.ParameterValues = [nstartDate, nendDate, params.name, params.seriesName];

        //异步Return返回
        var Return = JQGlobal.SendMessage("DB_CallProcedure", Request);
        if (Return.ErrorID != 0) {
            alert(Return.ErrorString);
            return false;
        }

        var _tableDataDetails = getJsonStoreFromTable(Return.Table0);

        if (_tableDataDetails != undefined && _tableDataDetails != null && _tableDataDetails.length > 0) {
            for (var i = 0; i < _tableDataDetails.length; i++) {
                htmlstr += "<tr>";
                var itemcount = 0;
                for (var key in _tableDataDetails[0]) {
                    itemcount++;
                    if (itemcount > reportarr.DetailField.length) {
                        break;
                    }
                    htmlstr += "<td>" + _tableDataDetails[i][key] + "</td>";
                }

                htmlstr += "</tr>";
            }
        }
    }
    
    htmlstr += "</tbody></table></div></div>";

    $("#divEchartDetails").html(htmlstr);
    var height = 0;
    if (window.parent.window.document.scrollingElement == undefined) {
        height = window.parent.window.document.body.scrollTop;
    }
    else {
        height = window.parent.window.document.scrollingElement.scrollTop;
    }
    $("#modal-echartdetail").css("top", height + "px");
    $("#modal-echartdetail").modal("show");
}
//ES样本轨迹明细
function myTableOnClickDetailSpecialSampleRoute(reportcode, name) {
    var reportstr = UniformConfig.readValue("system", "ReportConfig", reportcode, "");

    if (reportstr != "") {
        var reportarr = Json.fromString(reportstr);

        var params = {};
        params.seriesName = "";
        params.name = name;
        reportarr.CurDefineID = getMyDefineIDByCode(reportcode);
        myChartOnClickDetailSpecialSampleRoute(reportarr, params);
    }
}
//ES样本轨迹明细
function myChartOnClickDetailSpecialSampleRoute(reportarr, params) {
    if (reportarr.DetailField.length <= 0) {
        return;
    }
    var xAxis = DateComponent.buildReportXName(reportarr);
    var nDataFields = new Array();
    $("#divEchartDetails").html("");
    if (reportarr.textStyle != undefined && reportarr.textStyle != null && reportarr.textStyle != "") {
        $("#modal-echartdetail-title").html(reportarr.textStyle);
    }
    var htmlstr = '<div class="row cl"><div class="formControls col-sm-12"><table class="table table-border table-bg">';
    htmlstr += "<thead><tr>";
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        htmlstr += "<th>" + reportarr.DetailField[i].ShowName + "</th>";
        nDataFields.push(reportarr.DetailField[i].FieldName);
    }
    htmlstr += "</tr></thead>";
    htmlstr += "<tbody>";

    var nstartDate = EchartsTran.getParameterValue("nStartTestDate", reportarr);
    var nendDate = EchartsTran.getParameterValue("nEndTestDate", reportarr);

    var nGroupByFieldName = reportarr.DetailField[0].FieldName;
    var nGroupByDataType = "string";
    var nFunFieldName = nGroupByFieldName;
    var nFunType = 2; //count计数
    //明细
    var _tableData = ESFun.getMyDetailDefineDataByFun(reportarr, params, nGroupByFieldName, nGroupByDataType, nFunFieldName, nFunType);
    htmlstr += '<tr><td colspan="' + reportarr.DetailField.length + '" style="border-bottom:0px;"></td></tr>';
    for (var j = 0; j < _tableData.length; j++) {
        var xname = _tableData[j].ItemName;
        var nitemcount = _tableData[j].ItemCount;
        var _tableDataDetails = ESFun.getMyDataSearchEchartParam(reportarr, params,nDataFields, nGroupByFieldName, "=", xname);

        htmlstr += '<tr style="cursor: pointer; color: Blue;height:25px;" onclick="myTableOnClickDetailSpecialSampleRouteExtend(\'' + reportarr.code + '\',\'' + xname + '\')">';
        if (_tableDataDetails.length > 0) {
            for (var m = 0; m < nDataFields.length; m++) {
                var tdvalue = _tableDataDetails[0][nDataFields[m]];
                if (nDataFields[m].toLowerCase() == "testdate") {
                    tdvalue = DateComponent.getDateByTimeStamp(tdvalue);
                }
                if (tdvalue.length > 50) {
                    htmlstr += '<td style="padding:0px;" data-toggle="tooltip" data-placement="bottom" title="' + tdvalue + '">' + tdvalue.substring(0, 50) + '...</td>';

                }
                else {
                    htmlstr += '<td style="padding:0px;">' + tdvalue + '</td>';
                }
            }
        }

        //扩展明细
        if (reportarr.DetailField1 && reportarr.DetailField1.length > 0) {
            htmlstr += '<tr><td colspan="' + reportarr.DetailField.length + '" style="border-bottom:0px;"><div class="row cl" id="trdetail' + xname + '" style="display: none;" itemflag="0"><div class="formControls col-sm-12"><table class="" width="100%" >';

            htmlstr += "<tr>";
            var nDataFields1 = new Array();
            for (var d = 0; d < reportarr.DetailField1.length; d++) {
                htmlstr += "<th>" + reportarr.DetailField1[d].ShowName + "</th>";
                nDataFields1.push(reportarr.DetailField1[d].FieldName);
            }
            htmlstr += "</tr>";
            htmlstr += '<tbody  id="tbody' + xname + '" >';
            htmlstr += "</tbody>";
            htmlstr += "</table></div></div></td></tr>";
        }
    }

    htmlstr += "</tbody></table></div></div>";

    $("#divEchartDetails").html(htmlstr);
    var height = 0;
    if (window.parent.window.document.scrollingElement == undefined) {
        height = window.parent.window.document.body.scrollTop;
    }
    else {
        height = window.parent.window.document.scrollingElement.scrollTop;
    }
    $("#modal-echartdetail").css("top", height + "px");
    $("#modal-echartdetail").modal("show");
}
//ES样本轨迹明细 扩展明细
function myTableOnClickDetailSpecialSampleRouteExtend(reportcode, name) {

    if ($("#trdetail" + name).css("display") == "none") {
        var itemflag = $("#trdetail" + name).attr("itemflag");
        if (itemflag == "0") {
            var reportstr = UniformConfig.readValue("system", "ReportConfig", reportcode, "");

            if (reportstr != "") {
                var reportarr = Json.fromString(reportstr);

                var params = {};
                params.seriesName = "";
                params.name = "";
                reportarr.CurDefineID = getMyDefineIDByCode(reportcode);
                var nDataFields1 = new Array();
                for (var d = 0; d < reportarr.DetailField1.length; d++) {
                    nDataFields1.push(reportarr.DetailField1[d].FieldName);
                }
                var _tableDataDetails = ESFun.getMyDetailDefineDataNoDefine(reportarr, params, nDataFields1, reportarr.DetailField[0].FieldName, "=", name, "TestDate");
                var htmlstr = "";
                for (var t = 0; t < _tableDataDetails.length;t++) {
                    htmlstr += '<tr style="height:25px;">';
                    for (var m = 0; m < nDataFields1.length; m++) {
                        var tdvalue = _tableDataDetails[t][nDataFields1[m]];
                        if (nDataFields1[m].toLowerCase() == "testdate") {
                            tdvalue = DateComponent.getDateByTimeStamp(tdvalue);
                        }
                        htmlstr += '<td style="padding:0px;">' + tdvalue + '</td>';
                    }
                    htmlstr += "</tr>";
                }
                $("#tbody" + name).html(htmlstr);
            }
            $("#trdetail" + name).attr("itemflag","1");
        }
        $("#trdetail" + name).css("display", "block");
    }
    else {
        $("#trdetail" + name).css("display", "none");
    }
}
//ES模组报警信息明细方法
function myChartOnClickDetailSpecialModuleWarning(reportarr, params) {
    $("#divEchartDetails").html("");
    if (reportarr.DetailField <= 0) {
        return;
    }
    if (reportarr.textStyle != undefined && reportarr.textStyle != null && reportarr.textStyle != "") {
        $("#modal-echartdetail-title").html(reportarr.textStyle);
    }
    var seriesName = DateComponent.getWeekValue(params.seriesName);
    if (params.componentType == "series" && seriesName[1] == "-") {
        seriesName = DateComponent.getWeekValue(params.name);
    }
    if (seriesName == "" && params.name != "") {
        seriesName = DateComponent.getWeekValue(params.name);
    }
    //总占比率
    var nGroupByFieldName = reportarr.DetailField[0].FieldName;
    var nGroupByDataType = "string";
    var nFunFieldName = nGroupByFieldName;
    var nFunType = 2; //count计数
    var _newparams = {};
    if (params.seriesName == "") {
        _newparams.name = "";
    }
    else {
        _newparams.name = DateComponent.getWeekValue(params.name);
    }
    _newparams.seriesName = "";
    var _tableData = ESFun.getMyDetailDefineDataByFun(reportarr, _newparams, nGroupByFieldName, nGroupByDataType, nFunFieldName, nFunType);
    var nTotalCount = 0;
    for (var j = 0; j < _tableData.length; j++) {
        nTotalCount += _tableData[j].ItemCount;
    }

    //分明细报警率
    var _tableData = ESFun.getMyDetailDefineDataByFun(reportarr, params, nGroupByFieldName, nGroupByDataType, nFunFieldName, nFunType);
    var nDetailTotalCount = 0;
    for (var j = 0; j < _tableData.length; j++) {
        nDetailTotalCount += _tableData[j].ItemCount;
    }
    //比例 总报警率
    var ntotalitemcountper = parseFloat(nDetailTotalCount * 100 / nTotalCount).toFixed(1);
    var nDataFields = new Array(); //需显示的列
    var htmlstr = '<div class="row cl">';
    if (reportarr.isShowParentShare) {
        htmlstr += '<label class="form-label col-xs-2 col-sm-6 text-r">' + seriesName + '：</label><label class="col-xs-2 col-sm-6 text-l">' + ntotalitemcountper + '%</label>';
    }
    htmlstr += '<div class="formControls col-xs-2 col-sm-12"><table class="table table-border table-bg">';
    htmlstr += "<thead><tr>";
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        htmlstr += "<th>" + reportarr.DetailField[i].ShowName + "</th>";
        nDataFields.push(reportarr.DetailField[i].FieldName);
    }
    htmlstr += "<th>次数</th>";
    if (reportarr.isShowChildShare) {
        htmlstr += "<th>占比率</th>";
    }
    htmlstr += "</tr></thead>";
    htmlstr += "<tbody>";
    for (var j = 0; j < _tableData.length; j++) {
        var xname = _tableData[j].ItemName;
        var nitemcount = _tableData[j].ItemCount;
        var _tableDataDetails = ESFun.getMyDataSearchEchartParam(reportarr, params, nDataFields, nGroupByFieldName, "=", xname);

        htmlstr += "<tr>";
        if(_tableDataDetails.length>0){
            for (var m = 0; m < nDataFields.length; m++) {
                var tdvalue = _tableDataDetails[0][nDataFields[m]];
                if (nDataFields[m].toLowerCase() == "testdate") {
                    tdvalue = DateComponent.getDateByTimeStamp(tdvalue);
                }
                if (tdvalue.length > 50) {
                    htmlstr += '<td data-toggle="tooltip" data-placement="bottom" title="' + tdvalue + '">' + tdvalue.substring(0, 50) + '...</td>';

                }
                else {
                    htmlstr += '<td >' + tdvalue + '</td>';
                }
            }
        }
        htmlstr += "<td>" + nitemcount + "</td>";
        //比例
        if (reportarr.isShowChildShare) {
            var nitemcountper = parseFloat(nitemcount * 100 / nDetailTotalCount).toFixed(1);
            htmlstr += "<td>" + nitemcountper + "%</td>";
        }

        htmlstr += "</tr>";
    }
    htmlstr += "</tbody></table></div></div>";

    $("#divEchartDetails").html(htmlstr);
    var height = 0;
    if (window.parent.window.document.scrollingElement == undefined) {
        height = window.parent.window.document.body.scrollTop;
    }
    else {
        height = window.parent.window.document.scrollingElement.scrollTop;
    }
    $("#modal-echartdetail").css("top", height + "px");
    $("#modal-echartdetail").modal("show");
}
//ES生化免疫TAT明细方法
function myChartOnClickDetailSpecial(reportarr, params) {
    if (reportarr.DetailSpecial == 1) {
        //生化免疫TAT明细 查看最大值
        var xAxis = DateComponent.buildReportXName(reportarr);
        $("#divEchartDetails").html("");
        if (reportarr.textStyle != undefined && reportarr.textStyle != null && reportarr.textStyle != "") {
            $("#modal-echartdetail-title").html(reportarr.textStyle);
        }
        var htmlstr = '';
        for (var i = 0; i < reportarr.TATSet.length; i++) {
            var _nTatSet = reportarr.TATSet[i];
            var nTATColumn = _nTatSet.TATTimer;//TAT分钟字段
            var nTATHour = _nTatSet.TATHour;//TAT小时字段
            var nDataFields = new Array();//需显示的列
            htmlstr += '<div class="row cl"><span class="btn btn-link col-xs-2 col-sm-12 ">' + _nTatSet.TATName + '</span><div class="formControls col-xs-2 col-sm-12"><table class="table table-border table-bg">';
            htmlstr += "<thead><tr>";
            for (var f = 0; f < reportarr.DetailField.length; f++) {
                htmlstr += "<th>" + reportarr.DetailField[f].ShowName + "</th>";
                nDataFields.push(reportarr.DetailField[f].FieldName);
            }
            htmlstr += "<th>时间</th>";
            htmlstr += "<th>TAT</th>";
            htmlstr += "</tr></thead>";
            htmlstr += "<tbody>";
            nDataFields.push(nTATHour);
            nDataFields.push(nTATColumn);

            for (var j = 0; j < xAxis.length - 1; j++) {
                var xname = xAxis[j] + "-" + xAxis[j + 1];
                var starttime = xAxis[j];
                var endtime = xAxis[j + 1];
                var _tableDataDetails = ESFun.getMyDetailDefineDataBySpecialTAT(reportarr, params, nTATColumn, "max", nDataFields, nTATColumn, nTATHour, parseInt(starttime), parseInt(endtime));

                htmlstr += "<tr>";
                for (var k = 0; k < _tableDataDetails.length; k++) {
                    for (var m = 0; m < nDataFields.length; m++) {
                        var tdvalue = _tableDataDetails[k][nDataFields[m]];
                        if (nDataFields[m].toLowerCase() == "testdate") {
                            tdvalue = DateComponent.getDateByTimeStamp(tdvalue);
                        }
                        if (tdvalue.length > 50) {
                            htmlstr += '<td data-toggle="tooltip" data-placement="bottom" title="' + tdvalue + '">' + tdvalue.substring(0, 50) + '...</td>';

                        }
                        else {
                            htmlstr += '<td>' + tdvalue + '</td>';
                        }
                    }
                }

                htmlstr += "</tr>";
            }
            htmlstr += "</tbody></table></div></div>";
        }
        $("#divEchartDetails").html(htmlstr);
        var height = 0;
        if (window.parent.window.document.scrollingElement == undefined) {
            height = window.parent.window.document.body.scrollTop;
        }
        else {
            height = window.parent.window.document.scrollingElement.scrollTop;
        }
        $("#modal-echartdetail").css("top", height + "px");
        $("#modal-echartdetail").modal("show");
    }
}
//DB生化免疫明细方法
function myChartOnClickTat(reportarr) {
    if (reportarr.DetailField.length <= 0) {
        return;
    }
    var xAxis = DateComponent.buildReportXName(reportarr);
    $("#divEchartDetails").html("");
    if(reportarr.textStyle != undefined && reportarr.textStyle != null && reportarr.textStyle != "")
    {
        $("#modal-echartdetail-title").html(reportarr.textStyle);
    }
    var htmlstr = '<div class="row cl"><span class="btn btn-link col-xs-2 col-sm-12 ">进线-已上传</span><div class="formControls col-xs-2 col-sm-12"><table class="table table-border table-bg">';
    htmlstr += "<thead><tr>";
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        htmlstr += "<th>" + reportarr.DetailField[i].ShowName + "</th>";
    }
    htmlstr += "</tr></thead>";
    htmlstr += "<tbody>";

    for (var j = 0; j < xAxis.length - 1; j++) {
        var xname = xAxis[j] + "-" + xAxis[j + 1];
        var starttime = xAxis[j];
        var endtime = xAxis[j + 1];
        var nstartDate = EchartsTran.getParameterValue("nStartTestDate", reportarr);
        var nendDate = EchartsTran.getParameterValue("nEndTestDate", reportarr);

        
        var Request = new Array();
        Request.ProcedureName = "[" + reportarr.appMethodDetail + "]";
        Request.ParameterNames = ["nStartTestDate", "nEndTestDate", "nStartTime", "nEndTime", "nTimeFlag", "nReportFlag"];
        Request.ParameterDataTypes = ["vachar(20)", "vachar(20)", "vachar(20)", "vachar(20)", "int", "int"];
        Request.ParameterValues = [nstartDate, nendDate, starttime, endtime, 1, 0];

        //异步Return返回
        var Return = JQGlobal.SendMessage("DB_CallProcedure", Request);
        if (Return.ErrorID != 0) {
            alert(Return.ErrorString);
            return false;
        }

        var _tableDataDetails = getJsonStoreFromTable(Return.Table0);

        if (_tableDataDetails != undefined && _tableDataDetails != null && _tableDataDetails.length > 0) {
            htmlstr += "<tr>";
            var itemcount = 0;
            for (var key in _tableDataDetails[0]) {
                itemcount++;
                if (itemcount > reportarr.DetailField.length) {
                    break;
                }
                htmlstr += "<td>" + _tableDataDetails[0][key] + "</td>";
            }

            htmlstr += "</tr>";
        }

    }     
    htmlstr += "</tbody></table></div></div>";

    htmlstr += '<div class="row cl"><span class="btn btn-link col-xs-2 col-sm-12 ">核收-已审核</span><div class="formControls col-xs-2 col-sm-12"><table class="table table-border table-bg">';
    htmlstr += "<thead><tr>";
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        htmlstr += "<th>" + reportarr.DetailField[i].ShowName + "</th>";
    }
    htmlstr += "</tr></thead>";
    htmlstr += "<tbody>";
    for (var j = 0; j < xAxis.length - 1; j++) {
        var xname = xAxis[j] + "-" + xAxis[j + 1];
        var starttime = xAxis[j];
        var endtime = xAxis[j + 1];
        var nstartDate = EchartsTran.getParameterValue("nStartTestDate", reportarr);
        var nendDate = EchartsTran.getParameterValue("nEndTestDate", reportarr);
        var Request = new Array();
        Request.ProcedureName = "[" + reportarr.appMethodDetail + "]";
        Request.ParameterNames = ["nStartTestDate", "nEndTestDate", "nStartTime", "nEndTime", "nTimeFlag", "nReportFlag"];
        Request.ParameterDataTypes = ["vachar(20)", "vachar(20)", "vachar(20)", "vachar(20)", "int", "int"];
        //Request.ParameterValues = ["2015-11-27", "2015-11-28", nClassifyId];
        Request.ParameterValues = [nstartDate, nendDate, starttime, endtime, 1, 1];

        //异步Return返回
        var Return = JQGlobal.SendMessage("DB_CallProcedure", Request);
        if (Return.ErrorID != 0) {
            alert(Return.ErrorString);
            return false;
        }

        var _tableDataDetails = getJsonStoreFromTable(Return.Table0);

        if (_tableDataDetails != undefined && _tableDataDetails != null && _tableDataDetails.length > 0) {
            htmlstr += "<tr>";
            var itemcount = 0;
            for (var key in _tableDataDetails[0]) {
                itemcount++;
                if (itemcount > reportarr.DetailField.length) {
                    break;
                }
                htmlstr += "<td>" + _tableDataDetails[0][key] + "</td>";
            }

            htmlstr += "</tr>";
        }
    }
    htmlstr += "</tbody></table></div></div>";

    $("#divEchartDetails").html(htmlstr);
    var height = 0;
    if (window.parent.window.document.scrollingElement == undefined) {
        height = window.parent.window.document.body.scrollTop;
    }
    else {
        height = window.parent.window.document.scrollingElement.scrollTop;
    }
    $("#modal-echartdetail").css("top",height+"px");
    $("#modal-echartdetail").modal("show");
}

EchartsTran.myDataSet = function (reportcode) {
    var height = window.parent.window.document.body.scrollTop;
    $("#modal-dataset").css("top", height + "px");
    $("#modal-dataset").modal("show");

    //获取单个报表的配置
    var reportstr = UniformConfig.readValue("system", "ReportConfig", reportcode, "");
    if (reportstr != "") {
        var reportarr = Json.fromString(reportstr);
        if (reportarr.isLasSet) {
            $("#tbLasSet").html("");
            for (var i = 0; i < reportarr.LasSet.length; i++) {
                var _nLasSet = reportarr.LasSet[i];
                var _nStartLasDesc = $("#sltStartLas option[value='" + _nLasSet.StartLas + "']").text();
                var _nStartEndDesc = $("#sltEndLas option[value='" + _nLasSet.EndLas + "']").text();
                $("#tbLasSet").append('<tr id="tbLasSetTr' + i + '"><td>' + _nStartLasDesc + '</td><td>' + _nStartEndDesc + '</td><td><i class="Hui-iconfont" onclick="objAdminConfigComponent._delLas(' + i + ');" style="cursor:pointer;">&#xe6e2;</i></td></tr>');
            }
        }
    }
}

EchartsTran.TranOption = function (data, optionatt) {
    switch (optionatt.OptionType) {
        case 'canvas001':
            return CanvasComponent.Canvas001(data, optionatt);
            break;
        case 'canvas002':
            return CanvasComponent.Canvas002(data, optionatt);
            break;
        case 'canvas003':
            return CanvasComponent.Canvas003(data, optionatt);
            break;
        case 'pie001':
            return EchartsPieComponent.Pie001(data, optionatt);
            break;
        case 'pie002':
            return EchartsPieComponent.Pie002(data, optionatt);
            break;
        case 'pie003':
            return EchartsPieComponent.Pie003(data, optionatt);
            break;
        case 'bar001':
            return EchartsBarComponent.Bar001(data, optionatt);
            break;
        case 'bar002':
            return EchartsBarComponent.Bar002(data, optionatt);
            break;
        case 'bar003':
            return EchartsBarComponent.Bar003(data, optionatt);
            break;
        case 'bar004':
            return EchartsBarComponent.Bar004(data, optionatt);
            break;
        case 'bar005':
            return EchartsBarComponent.Bar005(data, optionatt);
            break;
        case 'bar006':
            return EchartsBarComponent.Bar006(data, optionatt);
            break;
        case 'bar007':
            return EchartsBarComponent.Bar007(data, optionatt);
            break;
        case 'bar008':
            return EchartsBarComponent.Bar008(data, optionatt);
            break;
        case 'bar009':
            return EchartsBarComponent.Bar009(data, optionatt);
            break;
        case 'line001':
            return EchartsLineComponent.Line001(data, optionatt);
            break;
        case 'line002':
            return EchartsLineComponent.Line002(data, optionatt);
            break;
        case 'line003':
            return EchartsLineComponent.Line003(data, optionatt);
            break;
        case 'line004':
            return EchartsLineComponent.Line004(data, optionatt);
            break;
        case 'line005':
            return EchartsLineComponent.Line005(data, optionatt);
            break;
        case 'line006':
            return EchartsLineComponent.Line006(data, optionatt);
            break;
        case 'line007':
            return EchartsLineComponent.Line007(data, optionatt);
            break;
        case 'line008':
            return EchartsLineComponent.Line008(data, optionatt);
            break;
        case 'line009':
            return EchartsLineComponent.Line009(data, optionatt);
            break;
        case 'line010':
            return EchartsLineComponent.Line010(data, optionatt);
            break;
        case 'box001':
            return EchartsBoxComponent.Box001(data, optionatt);
            break;
        case 'box002':
            return EchartsBoxComponent.Box002(data, optionatt);
            break;
        case 'map001':
            return EchartsMapComponent.Map001(data, optionatt);
            break;
        case 'map002':
            return EchartsMapComponent.Map002(data, optionatt);
            break;
        case 'map003':
            return EchartsMapComponent.Map003(data, optionatt);
            break;
        case 'mix001':
            return EchartsMixComponent.Mix001(data, optionatt);
            break;
        case 'mix002':
            return EchartsMixComponent.Mix002(data, optionatt);
            break;
        case 'mix003':
            return EchartsMixComponent.Mix003(data, optionatt);
            break;
        case 'other001':
            if (optionatt.report.code == "dayDataBriefWorkdataSampleView") {
                return EchartsBarComponent.Bar003(data, optionatt);
            }
            if (optionatt.report.code == "dayDataBriefTatOverview") {
                return EchartsBarComponent.Bar004(data, optionatt);
            }
            break;
        case 'other002':
            return EchartsOtherComponent.Other002(data, optionatt);
            break;
        case 'other003':
            return EchartsOtherComponent.Other003(data, optionatt);
            break;
        case 'other004':
            return EchartsOtherComponent.Other004(data, optionatt);
            break;

    }
}

EchartsTran.isRegister = function () {
    var isregister = 0;
    var reportarr = {};
    reportarr.DataSource = "datacake/sysinfo";
    reportarr.dataSourceType = "ES";
    reportarr.dataResultFormat = "JSON";
    var _tableDataDetails = ESFun.getMyDetailDefineDataNoDefine(reportarr, null, null, "", "", "", "");
    if (_tableDataDetails != undefined && _tableDataDetails.length > 0) {
        isregister = _tableDataDetails[0].EnableRegister;
    }
    return isregister;
}

EchartsTran.getWhere = function (reportarr) {
    var strwhere = " and 1=1 ";

    for (var i = 0; i < window._webconfig.table_filter_collection.length; i++) {
        var nTableFilter = window._webconfig.table_filter_collection[i];
        var nFilterName = nTableFilter[4];
        if (reportarr[nFilterName]) {
            if (reportarr[nFilterName + "Where"] != undefined) {
                var result = "";
                for (var w = 0; w < reportarr[nFilterName + "Where"].length; w++) {
                    if (nTableFilter[6] == "number") {
                        result += reportarr[nFilterName + "Where"][w] + ',';
                    }
                    else {
                        result += '\'' + reportarr[nFilterName + "Where"][w] + '\',';
                    }
                }
                if (result != "") {
                    strwhere += " and tb." + nTableFilter[5] + " in (" + result.trimEnd(',') + ") ";
                }
            }
        }
    }

    //    if (reportarr.isInstrument && reportarr.InstrumentWhere != undefined && reportarr.InstrumentWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.InstrumentWhere.length; w++) {
    //            result += reportarr.InstrumentWhere[w] + ',';
    //        }
    //        strwhere += " and tb.InstrumentID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isTestItem && reportarr.TestItemWhere != undefined && reportarr.TestItemWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.TestItemWhere.length; w++) {
    //            result += reportarr.TestItemWhere[w] + ',';
    //        }
    //        strwhere += " and tb.TestItemID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isPatientType && reportarr.PatientTypeWhere != undefined && reportarr.PatientTypeWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.PatientTypeWhere.length; w++) {
    //            result += reportarr.PatientTypeWhere[w] + ',';
    //        }
    //        strwhere += " and tb.PatientTypeID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isPriority && reportarr.PriorityWhere != undefined && reportarr.PriorityWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.PriorityWhere.length; w++) {
    //            result += reportarr.PriorityWhere[w] + ',';
    //        }
    //        strwhere += " and tb.PriorityID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isSex && reportarr.SexWhere != undefined && reportarr.SexWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.SexWhere.length; w++) {
    //            result += reportarr.SexWhere[w] + ',';
    //        }
    //        strwhere += " and tb.SexID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isSpeciality && reportarr.SpecialityWhere != undefined && reportarr.SpecialityWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.SpecialityWhere.length; w++) {
    //            result += reportarr.SpecialityWhere[w] + ',';
    //        }
    //        strwhere += " and tb.SpecialityClassifyID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isWard && reportarr.WardWhere != undefined && reportarr.WardWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.WardWhere.length; w++) {
    //            result += reportarr.WardWhere[w] + ',';
    //        }
    //        strwhere += " and tb.WardID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isSampleType && reportarr.SampleTypeWhere != undefined && reportarr.SampleTypeWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.SampleTypeWhere.length; w++) {
    //            result += reportarr.SampleTypeWhere[w] + ',';
    //        }
    //        strwhere += " and tb.SampleTypeID in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isSampleState && reportarr.SampleStateWhere != undefined && reportarr.SampleStateWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.SampleStateWhere.length; w++) {
    //            result += reportarr.SampleStateWhere[w] + ',';
    //        }
    //        strwhere += " and tb.SampleState in (" + result.trimEnd(',') + ") ";
    //    }
    //    if (reportarr.isReagentType && reportarr.ReagentTypeWhere != undefined && reportarr.ReagentTypeWhere.length > 0) {
    //        var result = "";
    //        for (var w = 0; w < reportarr.ReagentTypeWhere.length; w++) {

    //            var resulttype = typeof reportarr.ReagentTypeWhere[w];
    //            if (resulttype == "number") {
    //                result += reportarr.ReagentTypeWhere[w] + ',';
    //            }
    //            else {
    //                result += '\'' + reportarr.ReagentTypeWhere[w] + '\',';
    //            }
    //        }
    //        strwhere += " and tb.ReagentType in (" + result.trimEnd(',') + ") ";
    //    }
    return strwhere;
}


//去除字符串尾部空格或指定字符  
String.prototype.trimEnd = function (c) {
    if (c == null || c == "") {
        var str = this;
        var rg = /s/;
        var i = str.length;
        while (rg.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    }
    else {
        var str = this;
        var rg = new RegExp(c);
        var i = str.length;
        while (rg.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    }
}  