
var generatedCount = 0;
var codes = new Array();
var completecodes = new Array();

function MobileDataCakeComponent() {
    window.nowDate = new Date();
    //获取用户url参数 报表code
    this.nReportCode = GetQueryString("ReportCode");
    this.isFavorite = GetQueryString("isFavorite");
    this.hasShowReport = 0;
    this.nDefineData = null;
    this.zNodes = null;//报表配置
    this.containerheight = window.innerHeight;//屏幕高度
    this.nHospitalSearch = new Array();
}

//var n = 0;//存储图片加载到的位置，避免每次都从第一张图片开始遍历
//window.onscroll = function () {
//    var echartdivs = $(".echartdiv");
//    var seeHeight = window.innerHeight;
//    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
//    //console.log("seeHeight"+seeHeight);
//    //console.log("scrollTop"+scrollTop);
//    for (var i = n; i < codes.length; i++) {
//        if (echartdivs[i].offsetTop < seeHeight + scrollTop) {
//            //console.log(codes[i] + echartdivs[i].offsetTop);
//            var reportcode = codes[i];
//            if (!completecodes.contains(reportcode)) {
//                setTimeout(function () {
//                    console.log(reportcode);
//                    objMobileDataCakeComponent.showReport(reportcode, reportcode);
//                }, 100)
//            }
//        }
//    }
//};

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

    alert("login action in iOS root");
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        SwiftWebViewBridge.callSwiftHandler("getUserInfo",
            "",
            function (responseData) {
                alert("login action in iOS start");
                var Request = new Array()
                Request.UserCode = responseData["Name"];
                Request.UserPWD = responseData["Pwd"];

                alert("login action in iOS end");
                this._loginAction(Request);

            });
    }
    else {
        var Request = new Array()
        Request.UserCode = this.getUserCode();
        Request.UserPWD = this.getUserPWD();

        alert("login action in Web");
        this._loginAction(Request);

    }
}

MobileDataCakeComponent.prototype._loginAction = function(Request) {
    if(Request.UserCode == undefined || Request.UserCode == "")
    {
        Request.UserCode="admin";
    }
    if(Request.UserPWD == undefined)
    {
        Request.UserPWD="TCSoft";
    }

    var Return = top.JQGlobal.SendMessage("GB_UserLogon", Request);

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
    window.UserLoginObj = obj;
    window.localStorage.setItem("UserLoginObj", JSON.stringify(obj));

    var objString = JSON.stringify(obj); //JSON 数据转化成字符串
    var date = new Date();
    date.setTime(date.getTime() + (12 * 60 * 60 * 1000)); //12个小时失效
    //$.cookie('myDataBriefCookie', objString, { expires: date, path: '/' });
}


MobileDataCakeComponent.prototype.initPage = function () {
    window.nowDate = new Date();
    var lblog = $("#lblog").html("");
    $("#lblog").html("图表加载开始：" + DateComponent.getTimeStampByDate(new Date()));

    //用户登录信息
    var UserLoginObj = window.localStorage.getItem("UserLoginObj");
    var myDataBriefCookie = undefined;
    if (UserLoginObj) {
        myDataBriefCookie = JSON.parse(UserLoginObj);
    }
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        this._doLogin();
    }
    //自定义报表列表
    var DefineDataObj = window.localStorage.getItem("DefineData");
    if (DefineDataObj) {
        top.JQGlobal._defineData = JSON.parse(DefineDataObj);
    }
    if (top.JQGlobal._defineData && top.JQGlobal._defineData.length <= 0) {
        this.getDefineData();
    }

    //用户自定义函数列表
    var FunDataObj = window.localStorage.getItem("FunData");
    if (FunDataObj) {
        top.JQGlobal._funData = JSON.parse(FunDataObj);
    }
    if (top.JQGlobal._funData && top.JQGlobal._funData.length <= 0) {
        this.getFunData();
    }

    //用户自定义报表查询条件列表
    var ConditionDataObj = window.localStorage.getItem("ConditionData");
    if (ConditionDataObj) {
        top.JQGlobal._conditionData = JSON.parse(ConditionDataObj);
    }
    if (top.JQGlobal._conditionData && top.JQGlobal._conditionData.length <= 0) {
        this.getConditionData();
    }

    //数据源列表
    var _dataSourceObj = window.localStorage.getItem("SourceData");
    if (_dataSourceObj) {
        top.JQGlobal._dataSource = JSON.parse(_dataSourceObj);
    }
    if (top.JQGlobal._dataSource && top.JQGlobal._dataSource.length <= 0) {
        this.getDataSourceData();
    }

    //数据源字段列表
    var _dataSourceCommentObj = window.localStorage.getItem("CommentData");
    if (_dataSourceCommentObj) {
        top.JQGlobal._dataSourceComment = JSON.parse(_dataSourceCommentObj);
    }
    if (top.JQGlobal._dataSourceComment && top.JQGlobal._dataSourceComment.length <= 0) {
        this.getDataSourceCommentData();
    }

    //字典集合列表
    var _dictTypeObj = window.localStorage.getItem("DictType");
    if (_dictTypeObj) {
        top.JQGlobal._dictType = JSON.parse(_dictTypeObj);
    }
    if (top.JQGlobal._dictType && top.JQGlobal._dictType.length <= 0) {
        this.getSysDictType();
    }

    //字典项列表
    var _dictInfoObj = window.localStorage.getItem("DictInfo");
    if (_dictInfoObj) {
        top.JQGlobal._dictInfo = JSON.parse(_dictInfoObj);
    }
    if (top.JQGlobal._dictInfo && top.JQGlobal._dictInfo.length <= 0) {
        this.getSysDictInfo();
    }

    //报表结构
    var _zNodesObj = window.localStorage.getItem("zNodes");
    if (_zNodesObj) {
        this.zNodes = JSON.parse(_zNodesObj);
    }
    if (!this.zNodes) {
        var reportstr = UniformConfig.readValue("system", "SysReportConfig", "SysReportConfig", "");
        //this.reportData = []; //缓存报表数据
        if (reportstr != "") {
            this.zNodes = Json.fromString(reportstr);
            window.localStorage.setItem("zNodes", JSON.stringify(this.zNodes));
        }
    }

    //用户收藏列表
    this.getUserFavoritePerm();

    //alert("getUserFavoritePerm：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
    //console.log("getUserFavoritePerm：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
    //window.nowDate = new Date();


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


    if(this.isFavorite == "1")
    {
        for (var indexOperateRow = 0; indexOperateRow < this.nUserFavoritePerm.getRecordCount() ; indexOperateRow++) {
            var _code = this.nUserFavoritePerm.getValue(indexOperateRow, "ReportCode");
            var _userid = this.nUserFavoritePerm.getValue(indexOperateRow, "UserID");
            if(_userid == top.JQGlobal.getUserID())
            {
                codes.push(_code);
            }
        }
    }
    else{
        codes = this.nReportCode.split("#");
    }
    
    //alert("报表加载开始：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
    console.log("报表加载开始：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
    window.nowDate = new Date();

    for (var c = 0; c < codes.length; c++) {
        if (codes[c] == "") {
            continue;
        }
        var isexist = 0;
        var reportdatetype = 0;//报表类型 日、周、月、年等
        for (var indexRow = 0; indexRow < top.JQGlobal._defineData.length ; indexRow++) {
            var _nDefineData = top.JQGlobal._defineData[indexRow];
            var _nDefineID = _nDefineData["DefineID"];
            var _nReportParent1 = _nDefineData["ReportParent1"];
            var _nUserID = _nDefineData["UserID"];
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
        if (c > 0) {
            var newHr = document.createElement("hr");
            mainContainer.appendChild(newHr);
        }
        if (isexist == 1) {
            var newElement = document.createElement("div");
            newElement.id = codes[c];
            newElement.className = "echartdiv";

            var newElementEchart = document.createElement("div");
            newElementEchart.id = "echartdiv" + codes[c];
            $(newElementEchart).height(this.containerheight);
            $(newElementEchart).width('100%');
            newElement.appendChild(newElementEchart);

            mainContainer.appendChild(newElement);

            $(newElement).height(this.containerheight);
            $(newElement).width('100%');
            var myChart = echarts.init(newElementEchart);
            myChart.dispose();
            var myChart = echarts.init(newElementEchart);

            // 过渡---------------------
            myChart.showLoading({
                text: '正在努力的读取数据中...',
            });

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
                $(newElement).append('<a style="position:relative;z-index:1000;float:right;right:5px;top:5px;cursor:point;" favoriteflag=' + favoriteflag + ' onclick="objMobileDataCakeComponent.addFavorite(\'' + codes[c] + '\',this)"><img src="' + favoriteimg + '" width="30" height="30"/>');
            }

            $(newElementEchart).css("position", "absolute");
            //this.initSearchUrlParamDate(reportdatetype, "", "");
            
            this.showReport(codes[c], codes[c]);
        }
    }

    var loadCtrl = document.getElementById("loading");
    loadCtrl.style.display = "none";

    window.nowDate = new Date();
    var lblog = $("#lblog").html();
    $("#lblog").html(lblog + "<br/>图表加载结束：" + DateComponent.getTimeStampByDate(new Date()));
}

MobileDataCakeComponent.prototype.refreshReport = function () {
    generatedCount = 0;
    var mainContainer = document.getElementById("mainContainer");
    $(mainContainer).html("");
    $(mainContainer).height(this.containerheight * (generatedCount));
    //mainContainer + hr的总高度 + pullUp本身高度
    $("#pullUp").css("top", this.containerheight * (generatedCount) + generatedCount * 2 + 51);
    $("#scroller").height(this.containerheight * (generatedCount) + generatedCount * 2);
    $("#wrapper").height(this.containerheight * (generatedCount) + generatedCount * 2);
    this.loadReport();
}

MobileDataCakeComponent.prototype.loadReport = function () {
    if (codes.length <= generatedCount) {
        return;
    }
    var value = codes[generatedCount];
    var THIS = this;
    var nDefineData = this._nDefineData;
    var nzNodes = this.zNodes;
    var mainContainer = document.getElementById("mainContainer");
    setTimeout(function () {
        if (value != "") {
            generatedCount++;
            var isexist = 0;
            var reportdatetype = 0;//报表类型 日、周、月、年等
            for (var indexRow = 0; indexRow < nDefineData.getRecordCount() ; indexRow++) {
                var _nDefineID = nDefineData.getValue(indexRow, "DefineID");
                var _nReportParent1 = nDefineData.getValue(indexRow, "ReportParent1");
                var _nUserID = nDefineData.getValue(indexRow, "UserID");
                var _nDefineCode = getMyDefineCode(_nDefineID);
                if (_nDefineCode == value) {
                    isexist = 1;
                    for (var i = 0; i < nzNodes.length; i++) {
                        if (nzNodes[i].code == _nReportParent1) {
                            reportdatetype = nzNodes[i].dateType;
                            break;
                        }
                    }
                    break;
                }
            }
            if (isexist == 1) {
                THIS.initSearchUrlParamDate(reportdatetype, "", "");
                THIS.showReport(value, value);
            }
        }
    }, 10);
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
        _nUserFavoritePermNewData.setValue(nRecNo, "UserID", top.JQGlobal.getUserID());
        _nUserFavoritePermNewData.setValue(nRecNo, "OrderIndex", _OrderIndex);
        _nUserFavoritePermNewData.setValue(nRecNo, "ChangeState", 1);
        
        //异步Request提交
        var objRequest = top.JQGlobal.NewMessage();
        objRequest.TableName = window._webconfig.tablecollection[12];
        objRequest.TableUpdate = _nUserFavoritePermNewData;

        //异步返回
        var objReturn = top.JQGlobal.SendMessage("GB_UpdateBasicTable", objRequest);
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
        _nUserFavoritePermNewData.setValue(nRecNo, "UserID", top.JQGlobal.getUserID());
        _nUserFavoritePermNewData.setValue(nRecNo, "ChangeState", 3);

        //异步Request提交
        var objRequest = top.JQGlobal.NewMessage();
        objRequest.TableName = window._webconfig.tablecollection[12];
        objRequest.TableUpdate = _nUserFavoritePermNewData;

        //异步返回
        var objReturn = top.JQGlobal.SendMessage("GB_UpdateBasicTable", objRequest);
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
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[12];
    objRequest.TableFields = window._webconfig.tablecolumncollection[12];
    var objReturn = top.JQGlobal.SendMessage("GB_QueryBasicTableContent", objRequest);
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
    var reportdatetype = 0;//报表类型 日、周、月、年等
    for (var indexRow = 0; indexRow < top.JQGlobal._defineData.length ; indexRow++) {
        var _nDefineData = top.JQGlobal._defineData[indexRow];
        var _nDefineID = _nDefineData["DefineID"];
        var _nReportParent1 = _nDefineData["ReportParent1"];
        var _nUserID = _nDefineData["UserID"];
        var _nDefineCode = getMyDefineCode(_nDefineID);
        if (_nDefineCode == reportcode) {
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
    this.initSearchUrlParamDate(reportdatetype, "", "");

    //获取单个报表的配置
    var reportstr = UniformConfig.readValue("system", "ReportConfig", reportcode, "");
    if (reportstr != "") {
        //alert("报表加载开始：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
        console.log(reportcode + "报表加载开始：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
        window.nowDate = new Date();

        completecodes.push(reportcode);

        var reportarr = Json.fromString(reportstr);
        if (isMyDefineCode(reportarr.code)) {
            reportarr.CurDefineID = getMyDefineIDByCode(reportarr.code);
        }
        reportarr.ShowElementId = showelementid;
        reportarr["HospitalSearchWhere"] = this.nHospitalSearch;
        reportarr["ReagentTypeSearchWhere"] = ["primary","reagent"];
        EchartsTran.showReport(reportarr);



        //alert("报表加载完成：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
        console.log(reportcode + "报表加载完成：" + DateComponent.GetDateDiff(window.nowDate, new Date()));
        window.nowDate = new Date();
    }

}

//获取自定义数据
MobileDataCakeComponent.prototype.getDefineData = function () {
    //异步Request设置
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[3];
    objRequest.TableFields = window._webconfig.tablecolumncollection[3];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = top.JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    var _nDefineData = objReturn.TableContent;

    if (_nDefineData == undefined || _nDefineData == null) {
        _nDefineData = new jsTable([window._webconfig.tablecolumncollection[3], window._webconfig.tablecolumntypecollection[3]]);
    }
    top.JQGlobal._defineData = getJsonStoreFromTable(_nDefineData);
    window.localStorage.setItem("DefineData", JSON.stringify(top.JQGlobal._defineData));
}

//获取度量函数数据
MobileDataCakeComponent.prototype.getFunData = function () {
    //异步Request设置
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[6];
    objRequest.TableFields = window._webconfig.tablecolumncollection[6];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = top.JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this._nFunData = objReturn.TableContent;
    if (this._nFunData == undefined || this._nFunData == null) {
        this._nFunData = new jsTable([window._webconfig.tablecolumncollection[6], window._webconfig.tablecolumntypecollection[6]]);
    }
    top.JQGlobal._funData = getJsonStoreFromTable(this._nFunData);
    window.localStorage.setItem("FunData", JSON.stringify(top.JQGlobal._funData));
}

//获取筛选条件数据
MobileDataCakeComponent.prototype.getConditionData = function () {
    //异步Request设置
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[7];
    objRequest.TableFields = window._webconfig.tablecolumncollection[7];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = top.JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this._nConditionData = objReturn.TableContent;
    if (this._nConditionData == undefined || this._nConditionData == null) {
        this._nConditionData = new jsTable([window._webconfig.tablecolumncollection[7], window._webconfig.tablecolumntypecollection[7]]);
    }
    top.JQGlobal._conditionData = getJsonStoreFromTable(this._nConditionData);
    window.localStorage.setItem("ConditionData", JSON.stringify(top.JQGlobal._conditionData));
}


//获取数据源
MobileDataCakeComponent.prototype.getDataSourceData = function () {
    //异步Request设置
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[4];
    objRequest.TableFields = window._webconfig.tablecolumncollection[4];
    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = top.JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this.nSourceData = objReturn.TableContent;
    //缓存数据源列表
    top.JQGlobal._dataSource = getJsonStoreFromTable(this.nSourceData);
    window.localStorage.setItem("SourceData", JSON.stringify(top.JQGlobal._dataSource));
}
//获取数据源字段定义
MobileDataCakeComponent.prototype.getDataSourceCommentData = function () {
    //异步Request设置
    var objRequest = top.JQGlobal.NewMessage();
    objRequest.TableName = window._webconfig.tablecollection[8];
    objRequest.TableFields = window._webconfig.tablecolumncollection[8];

    objRequest.OnlyValidRecord = true;

    //异步Return返回
    var objReturn = top.JQGlobal.SendMessage("GB_QueryEnumTableContent", objRequest);
    if (objReturn.ErrorID != 0) {
        parent.layer.msg(objReturn.ErrorString);
        return false;
    }

    this.nCommentData = objReturn.TableContent;
    //缓存数据源字段列表
    top.JQGlobal._dataSourceComment = getJsonStoreFromTable(this.nCommentData);
    window.localStorage.setItem("CommentData", JSON.stringify(top.JQGlobal._dataSourceComment));
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

    var Request = new top.JQGlobal.NewMessage();
    Request.Select = dtSelect;
    Request.From = dtFrom;
    Request.Where = dtWhere;
    var Return = top.JQGlobal.SendMessage("DB_CommonQuery", Request);

    if (Return.ErrorID != 0) {
        layer.msg(objReturn.ErrorString);
        return false;
    }
    this.nDictType = Return.Table0;
    //缓存数据字典类型
    top.JQGlobal._dictType = getJsonStoreFromTable(this.nDictType);
    window.localStorage.setItem("DictType", JSON.stringify(top.JQGlobal._dictType));

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

    var Request = new top.JQGlobal.NewMessage();
    Request.Select = dtSelect;
    Request.From = dtFrom;
    Request.Where = dtWhere;
    var Return = top.JQGlobal.SendMessage("DB_CommonQuery", Request);

    if (Return.ErrorID != 0) {
        layer.msg(objReturn.ErrorString);
        return false;
    }
    this.nDictInfo = Return.Table0;

    //缓存数据字典值
    top.JQGlobal._dictInfo = getJsonStoreFromTable(this.nDictInfo);
    window.localStorage.setItem("DictInfo", JSON.stringify(top.JQGlobal._dictInfo));
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
                window.nReportStartDate = top.JQGlobal.getStartDate();
                window.nShowTitleStartDate = top.JQGlobal.getStartDate();
                break;
            case 2:
                window.nReportStartDate = top.JQGlobal.getWeekStartDate();
                window.nShowTitleStartDate = top.JQGlobal.getWeekStartDate();
                break;
            case 3:
                window.nReportStartDate = top.JQGlobal.getMonthStartDate();
                window.nShowTitleStartDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 4:
                window.nReportStartDate = top.JQGlobal.getMonthStartDate();
                window.nShowTitleStartDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 5:
                window.nReportStartDate = top.JQGlobal.getYearStartDate();
                window.nShowTitleStartDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy");
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
                window.nReportEndDate = top.JQGlobal.getEndDate();
                window.nShowTitleEndDate = top.JQGlobal.getEndDate();
                break;
            case 2:
                window.nReportEndDate = top.JQGlobal.getWeekEndDate();
                window.nShowTitleEndDate = top.JQGlobal.getWeekEndDate();
                break;
            case 3:
                window.nReportEndDate = top.JQGlobal.getMonthEndDate();
                window.nShowTitleEndDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 4:
                window.nReportEndDate = top.JQGlobal.getMonthEndDate();
                window.nShowTitleEndDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy-MM");
                break;
            case 5:
                window.nReportEndDate = top.JQGlobal.getYearEndDate();
                window.nShowTitleEndDate = new Date(top.JQGlobal.getMonthStartDate()).format("yyyy");
                break;
        }
    }

}
