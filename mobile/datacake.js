
function MobileDataCakeComponent() {
    //获取用户url参数 报表code
    this.nReportCode = GetQueryString("ReportCode");
    this.isFavorite = GetQueryString("isFavorite");
    this.hasShowReport = 0;
    this._nDefineData = null;
    this.nHospitalSearch = new Array();
}

MobileDataCakeComponent.prototype.getUserCode = function () {
    var nuserCode = "";
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        SwiftWebViewBridge.callSwiftHandler("getUserInfo",
                                        "",
                                        function (responseData) {
                                            nuserCode = responseData["Name"];
                                        });
    }
    else {
        if (window.MyBrowserAPI != undefined) {
            nuserCode = window.MyBrowserAPI.getName();
        }
    }
    return nuserCode;
}
MobileDataCakeComponent.prototype.getUserPWD = function () {
    var nuserPWD = undefined;
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        SwiftWebViewBridge.callSwiftHandler("getUserInfo",
                                        "",
                                        function (responseData) {
                                            nuserPWD = responseData["Pwd"];
                                        });
    }
    else {
        if (window.MyBrowserAPI != undefined) {
            nuserPWD = window.MyBrowserAPI.getPwd();
        }
    }
    return nuserPWD;
}
MobileDataCakeComponent.prototype.gethospitalIds = function () {
    var nHospitalId = "";
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        SwiftWebViewBridge.callSwiftHandler("getUserInfo",
                                        "",
                                        function (responseData) {
                                            nHospitalId = responseData["HospitalId"];
                                        });
    }
    else {
        if (window.MyBrowserAPI != undefined) {
            nHospitalId = window.MyBrowserAPI.getHospitalId();
        }
    }
    return nHospitalId;
}

MobileDataCakeComponent.prototype._doLogin = function (strUserCode, strPassword) {
    var Request = new Array()

    Request.UserCode = this.getUserCode();
    Request.UserPWD = this.getUserPWD();

    if(Request.UserCode == undefined || Request.UserCode == "")
    {
        Request.UserCode="admin";
    }
    if(Request.UserPWD == undefined)
    {
        Request.UserPWD="TCSoft";
    }

    var Return = JQGlobal.SendMessage("GB_UserLogon", Request);

    this._returnObject = { "ConnectSequence": Return.ConnectSequence };
    //复制用户其它信息
    for (var nIndexField = 0; nIndexField < Return.UserInfo.getFieldCount(); nIndexField++)
        this._returnObject[Return.UserInfo.getFieldName(nIndexField)] = Return.UserInfo.getValue(0, nIndexField);

    var obj = new Object();
    obj.UserID = this._returnObject.UserID;
    obj.UserCode = this._returnObject.UserCode;
    obj.UserName = this._returnObject.UserName;
//    obj.DoctorID = this._returnObject.DoctorID;
    obj.ConnectSequence = this._returnObject.ConnectSequence;
    window.UserLoginObj=obj;
    var objString = JSON.stringify(obj); //JSON 数据转化成字符串
    var date = new Date();
    date.setTime(date.getTime() + (12 * 60 * 60 * 1000)); //12个小时失效
    //$.cookie('myDataBriefCookie', objString, { expires: date, path: '/' });

}

//获取自定义数据
MobileDataCakeComponent.prototype.getDefineData = function () {
    //异步Request设置
    var objRequest = JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[3];
    objRequest.TableFields = window._webconfig.tablecolumncollection[3];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this._nDefineData = objReturn.TableContent;
    if (this._nDefineData == undefined || this._nDefineData == null) {
        this._nDefineData = new jsTable([window._webconfig.tablecolumncollection[3], window._webconfig.tablecolumntypecollection[3]]);
    }
}

MobileDataCakeComponent.prototype.initPage = function () {

//    var myDataBriefCookie = $.cookie('myDataBriefCookie');
     var myDataBriefCookie = window.UserLoginObj;
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        this._doLogin();
    }
    this.getDefineData();
    this.getDataSourceData();
    this.getDataSourceCommentData();
    this.getSysDictType();
    this.getSysDictInfo();
    this.getUserFavoritePerm();

    if( window.MyBrowserAPI != undefined){
        var hospitalIds = this.gethospitalIds();
        //var hospitalIds = "3";
        if(hospitalIds != undefined){
            var splits = hospitalIds.split("#");
            for(var i=0;i<splits.length;i++){
                if(splits[i] != "" && splits[i] != "0"){
                    this.nHospitalSearch.push(splits[i]);
                }
            }
        }
    }

    var reportstr = UniformConfig.readValue("system", "SysReportConfig", "SysReportConfig", "");
    this.reportData = []; //缓存报表数据
    this.zNodes = []; //报表配置
    if (reportstr != "") {
        this.zNodes = Json.fromString(reportstr);
    }
    

    var mainContainer = document.getElementById("mainContainer");
    var codes = new Array();
    if(this.isFavorite == "1")
    {
        for (var indexOperateRow = 0; indexOperateRow < this.nUserFavoritePerm.getRecordCount() ; indexOperateRow++) {
            var _code = this.nUserFavoritePerm.getValue(indexOperateRow, "ReportCode");
            var _userid = this.nUserFavoritePerm.getValue(indexOperateRow, "UserID");
            if(_userid == JQGlobal.getUserID())
            {
                codes.push(_code);
            }
        }
    }
    else{
        codes = this.nReportCode.split("#");
    }
    for (var c = 0; c < codes.length; c++) {
        if (codes[c] == "") {
            continue;
        }
        var isexist = 0;
        var reportdatetype = 0;//报表类型 日、周、月、年等
        for (var indexRow = 0; indexRow < this._nDefineData.getRecordCount(); indexRow++) {
            var _nDefineID = this._nDefineData.getValue(indexRow, "DefineID");
            var _nReportParent1 = this._nDefineData.getValue(indexRow, "ReportParent1");
            var _nUserID = this._nDefineData.getValue(indexRow, "UserID");
            var _nDefineCode = getMyDefineCode(_nDefineID);
            if (_nDefineCode == codes[c]) {
                isexist = 1;
                for (var i = 0; i < this.zNodes.length; i++) {
                    if (this.zNodes[i].code == _nReportParent1) {
                        reportdatetype = this.zNodes[i].dateType;
                        break;
                    }
                }
                break;
            }
        }
        if(isexist == 0){
            for (var i = 0; i < this.zNodes.length; i++) {
                if (this.zNodes[i].code == codes[c]) {
                    reportdatetype =  this.zNodes[i].dateType;
                    isexist = 1;
                    break;
                }
            }
        }
        if (c > 0) {
            var newHr = document.createElement("hr");
            mainContainer.appendChild(newHr);
        }
        if(isexist == 1){
            var newElement = document.createElement("div");

            var newElementEchart = document.createElement("div");
            newElementEchart.id = codes[c];
            newElement.appendChild(newElementEchart);

            mainContainer.appendChild(newElement);
            $(newElement).height('100%');
            $(newElement).width('100%');
            var myChart = echarts.init(newElementEchart);
            myChart.dispose();
            var myChart = echarts.init(newElementEchart);

            // 过渡---------------------
            myChart.showLoading({
                text: '正在努力的读取数据中...',
            });
            
            this.initSearchUrlParamDate(reportdatetype,"","");
            this.showReport(codes[c], codes[c]);
            if (this.isFavorite != "1") {
                var favoriteflag = 0;
                var favoriteimg = window.MyImagePath + "collect_1.png";
                for (var indexOperateRow = 0; indexOperateRow < this.nUserFavoritePerm.getRecordCount() ; indexOperateRow++) {
                    var _code = this.nUserFavoritePerm.getValue(indexOperateRow, "ReportCode");
                    if (_code == codes[c]) {
                        favoriteflag = 1;
                        favoriteimg = window.MyImagePath + "collect_0.png";
                        break;
                    }
                }
                $(newElement).append('<a style="position:relative;z-index:1000;float:right;right:5px;top:5px;cursor:point;" favoriteflag=' + favoriteflag + ' onclick="objMobileDataCakeComponent.addFavorite(\'' + codes[c] + '\',this)"><img src="' + favoriteimg + '" width="40" height="40"/>');
            }

            $(newElementEchart).css("position", "absolute");

        }
    }
    
}

MobileDataCakeComponent.prototype.addFavorite = function(reportcode, obj)
{
    var favoriteflag = $(obj).attr("favoriteflag");
    var _nUserFavoritePermNewData = this.nUserFavoritePerm.clone();
    var _OrderIndex = 1;
    if (this.nUserFavoritePerm.getRecordCount() > 0) {
        _OrderIndex = this.nUserFavoritePerm.getValue(this.nUserFavoritePerm.getRecordCount() - 1, "OrderIndex");
        _OrderIndex++;
    }
    if(favoriteflag == 0)
    {
        var nRecNo = _nUserFavoritePermNewData.addRecord();
        _nUserFavoritePermNewData.setValue(nRecNo, "ReportCode", reportcode);
        _nUserFavoritePermNewData.setValue(nRecNo, "UserID", JQGlobal.getUserID());
        _nUserFavoritePermNewData.setValue(nRecNo, "OrderIndex", _OrderIndex);
        _nUserFavoritePermNewData.setValue(nRecNo, "ChangeState", 1);
        
        //异步Request提交
        var objRequest = JQGlobal.NewMessage();
        objRequest.TableName = window._webconfig.tablecollection[12];
        objRequest.TableUpdate = _nUserFavoritePermNewData;

        //异步返回
        var objReturn = JQGlobal.SendMessage("GB_UpdateBasicTable", objRequest);
        if (objReturn.ErrorID != 0) {
            layer.msg(objReturn.ErrorString);
            return false;
        }
        this.getUserFavoritePerm();
        $(obj).attr("favoriteflag",1);
        $(obj).children()[0].src= window.MyImagePath + "collect_0.png";
    }
    else
    {
        var nRecNo = _nUserFavoritePermNewData.addRecord();
        _nUserFavoritePermNewData.setValue(nRecNo, "ReportCode", reportcode);
        _nUserFavoritePermNewData.setValue(nRecNo, "UserID", JQGlobal.getUserID());
        _nUserFavoritePermNewData.setValue(nRecNo, "ChangeState", 3);

        //异步Request提交
        var objRequest = JQGlobal.NewMessage();
        objRequest.TableName = window._webconfig.tablecollection[12];
        objRequest.TableUpdate = _nUserFavoritePermNewData;

        //异步返回
        var objReturn = JQGlobal.SendMessage("GB_UpdateBasicTable", objRequest);
        if (objReturn.ErrorID != 0) {
            layer.msg(objReturn.ErrorString);
            return false;
        }
        this.getUserFavoritePerm();

        $(obj).attr("favoriteflag",0);
        $(obj).children()[0].src= window.MyImagePath + "collect_1.png";
    }
}

//查询用户收藏的报表
MobileDataCakeComponent.prototype.getUserFavoritePerm = function () {
    //异步Request设置
    var objRequest = JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[12];
    objRequest.TableFields = window._webconfig.tablecolumncollection[12];
    var objReturn = JQGlobal.SendMessage("GB_QueryBasicTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return null;
    }

    //将返回表格赋值给全局变量
    this.nUserFavoritePerm = objReturn.TableContent;
    if (this.nUserFavoritePerm == undefined || this.nUserFavoritePerm == null) {
        this.nUserFavoritePerm = new jsTable([window._webconfig.tablecolumncollection[12], window._webconfig.tablecolumntypecollection[12]]);
    }
    //修改状态（修改，新增，删除）
    this.nUserFavoritePerm.addField("ChangeState", "I");
    this.nUserFavoritePerm.sortRecord("OrderIndex");
}

MobileDataCakeComponent.prototype.showReport = function (reportcode, showelementid) {
    //获取单个报表的配置
    var reportstr = UniformConfig.readValue("system", "ReportConfig", reportcode, "");
    if (reportstr != "") {
        var reportarr = Json.fromString(reportstr);
        if (isMyDefineCode(reportarr.code)) {
            reportarr.CurDefineID = getMyDefineIDByCode(reportarr.code);
        }
        reportarr.ShowElementId = showelementid;
        reportarr["HospitalSearchWhere"] = this.nHospitalSearch;
        reportarr["ReagentTypeSearchWhere"] = ["primary","reagent"];
        EchartsTran.showReport(reportarr);
    }
}

//获取数据源
MobileDataCakeComponent.prototype.getDataSourceData = function () {
    //异步Request设置
    var objRequest = JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[4];
    objRequest.TableFields = window._webconfig.tablecolumncollection[4];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this.nSourceData = objReturn.TableContent;
    //缓存数据源列表
    JQGlobal._dataSource = getJsonStoreFromTable(this.nSourceData);
}
//获取数据源字段定义
MobileDataCakeComponent.prototype.getDataSourceCommentData = function () {
    //异步Request设置
    var objRequest = JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[8];
    objRequest.TableFields = window._webconfig.tablecolumncollection[8];

    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this.nCommentData = objReturn.TableContent;
    //缓存数据源字段列表
    JQGlobal._dataSourceComment = getJsonStoreFromTable(this.nCommentData);
}

//获取数据字典类型
MobileDataCakeComponent.prototype.getSysDictType = function () {

    var tableName = window._webconfig.tablecollection[10];
    var dtSelect = new jsTable([["TableName", "FieldName", "FieldNameAS", "AggregateFunction"], ["S", "S", "S", "S"]]);
    var dtFrom = new jsTable([["TableName", "JoinMode", "JoinFieldName", "JoinTargetTableName", "JoinTargetFieldName"], ["S", "S", "S", "S", "S"]]);
    var dtWhere = new jsTable([["TableName", "FieldName", "CmpOperator", "FieldValue1", "FieldValue2"], ["S", "S", "S", "S", "S"]]);

    var column_sz = window._webconfig.tablecolumncollection[10];
    for (var i = 0; i < column_sz.length; i++) {
        var nSelect = dtSelect.addRecord();
        dtSelect.setValue(nSelect, "TableName", tableName);
        dtSelect.setValue(nSelect, "FieldName", column_sz[i]);
    }
    var nRecNo;
    nRecNo = dtWhere.addRecord();
    dtWhere.setValue(nRecNo, "TableName", tableName);
    dtWhere.setValue(nRecNo, "FieldName", "DisableFlag");
    dtWhere.setValue(nRecNo, "CmpOperator", "=");
    dtWhere.setValue(nRecNo, "FieldValue1", "0");
    nRecNo = dtWhere.addRecord();
    dtWhere.setValue(nRecNo, "TableName", tableName);
    dtWhere.setValue(nRecNo, "FieldName", "ObsoleteFlag");
    dtWhere.setValue(nRecNo, "CmpOperator", "=");
    dtWhere.setValue(nRecNo, "FieldValue1", "0");

    var nFromRecNo = dtFrom.addRecord();
    dtFrom.setValue(nFromRecNo, "TableName", tableName);

    var Request = new JQGlobal.NewMessage();
    Request.Select = dtSelect;
    Request.From = dtFrom;
    Request.Where = dtWhere;
    var Return = JQGlobal.SendMessage("DB_CommonQuery", Request);

    if (Return.ErrorID != 0) {
        layer.msg(objReturn.ErrorString);
        return false;
    }
    this.nDictType = Return.Table0;
    //缓存数据字典类型
    JQGlobal._dictType = getJsonStoreFromTable(this.nDictType);

}

//获取数据字典值
MobileDataCakeComponent.prototype.getSysDictInfo = function () {
    var tableName = window._webconfig.tablecollection[11];
    var dtSelect = new jsTable([["TableName", "FieldName", "FieldNameAS", "AggregateFunction"], ["S", "S", "S", "S"]]);
    var dtFrom = new jsTable([["TableName", "JoinMode", "JoinFieldName", "JoinTargetTableName", "JoinTargetFieldName"], ["S", "S", "S", "S", "S"]]);
    var dtWhere = new jsTable([["TableName", "FieldName", "CmpOperator", "FieldValue1", "FieldValue2"], ["S", "S", "S", "S", "S"]]);

    var column_sz = window._webconfig.tablecolumncollection[11];
    for (var i = 0; i < column_sz.length; i++) {
        var nSelect = dtSelect.addRecord();
        dtSelect.setValue(nSelect, "TableName", tableName);
        dtSelect.setValue(nSelect, "FieldName", column_sz[i]);
    }
    var nRecNo;
    nRecNo = dtWhere.addRecord();
    dtWhere.setValue(nRecNo, "TableName", tableName);
    dtWhere.setValue(nRecNo, "FieldName", "DisableFlag");
    dtWhere.setValue(nRecNo, "CmpOperator", "=");
    dtWhere.setValue(nRecNo, "FieldValue1", "0");
    nRecNo = dtWhere.addRecord();
    dtWhere.setValue(nRecNo, "TableName", tableName);
    dtWhere.setValue(nRecNo, "FieldName", "ObsoleteFlag");
    dtWhere.setValue(nRecNo, "CmpOperator", "=");
    dtWhere.setValue(nRecNo, "FieldValue1", "0");

    var nFromRecNo = dtFrom.addRecord();
    dtFrom.setValue(nFromRecNo, "TableName", tableName);

    var Request = new JQGlobal.NewMessage();
    Request.Select = dtSelect;
    Request.From = dtFrom;
    Request.Where = dtWhere;
    var Return = JQGlobal.SendMessage("DB_CommonQuery", Request);

    if (Return.ErrorID != 0) {
        layer.msg(objReturn.ErrorString);
        return false;
    }
    this.nDictInfo = Return.Table0;

    //缓存数据字典值
    JQGlobal._dictInfo = getJsonStoreFromTable(this.nDictInfo);
}


MobileDataCakeComponent.prototype.initSearchUrlParamDate = function(reportdatetype,startdate,enddate)
{
    if(startdate != undefined && startdate!="")
    {
        window.nReportStartDate = startdate;
    }
    else
    {
        switch(parseInt(reportdatetype))
        {
            case 1:
                window.nReportStartDate = JQGlobal.getStartDate();
                window.nShowTitleStartDate = JQGlobal.getStartDate();
                break;
            case 2:
                window.nReportStartDate = JQGlobal.getWeekStartDate();
                window.nShowTitleStartDate = JQGlobal.getWeekStartDate();
                break;
            case 3:
                window.nReportStartDate = JQGlobal.getMonthStartDate();
                window.nShowTitleStartDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 4:
                window.nReportStartDate = JQGlobal.getMonthStartDate();
                window.nShowTitleStartDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 5:
                window.nReportStartDate = JQGlobal.getYearStartDate();
                window.nShowTitleStartDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy");
                break;
        }
    }
    if(enddate != undefined && enddate!="")
    {
        window.nReportEndDate = enddate;
    }
    else
    {        
        switch(parseInt(reportdatetype))
        {
            case 1:
                window.nReportEndDate = JQGlobal.getEndDate();
                window.nShowTitleEndDate = JQGlobal.getEndDate();
                break;
            case 2:
                window.nReportEndDate = JQGlobal.getWeekEndDate();
                window.nShowTitleEndDate = JQGlobal.getWeekEndDate();
                break;
            case 3:
                window.nReportEndDate = JQGlobal.getMonthEndDate();
                window.nShowTitleEndDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 4:
                window.nReportEndDate = JQGlobal.getMonthEndDate();
                window.nShowTitleEndDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 5:
                window.nReportEndDate = JQGlobal.getYearEndDate();
                window.nShowTitleEndDate = new Date(JQGlobal.getMonthStartDate()).format("yyyy");
                break;
        }
    }

}
