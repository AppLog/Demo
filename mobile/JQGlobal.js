
//////////////////////////////////////////////////////////////////////////////
//全局函数(Global静态函数)实现

if (window.JQGlobal !== undefined) {
    alert("系统发现您的代码产生重载现象!");
}

var JQGlobal = {};

//登录用户连接序列号
JQGlobal._connectSequence = "";
//登录用户的用户信息
JQGlobal._userInfo = undefined;
//获取 登录用户连接序列号
JQGlobal.getConnectSequence = function () {
    //var myDataBriefCookie = $.cookie('myDataBriefCookie');
    var myDataBriefCookie = window.UserLoginObj;
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        window.parent.location.href = "../login.htm";
        return;
    }
    //var newObject = JSON.parse(myDataBriefCookie); //字符串转化成JSON数据
    //    JQGlobal._connectSequence = newObject.ConnectSequence;
    JQGlobal._connectSequence = myDataBriefCookie.ConnectSequence;
    return JQGlobal._connectSequence;
}
//获取 登录用户代码
JQGlobal.getUserCode = function () {
    //var myDataBriefCookie = $.cookie('myDataBriefCookie');
    var myDataBriefCookie = window.UserLoginObj;
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        window.parent.location.href = "../login.htm";
        return;
    }
    //var newObject = JSON.parse(myDataBriefCookie); //字符串转化成JSON数据
    return myDataBriefCookie.UserCode;
}
//获取 登录用户ID
JQGlobal.getUserID = function () {
    //var myDataBriefCookie = $.cookie('myDataBriefCookie');
    var myDataBriefCookie = window.UserLoginObj;
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        window.parent.location.href = "../login.htm";
        return;
    }
    //var newObject = JSON.parse(myDataBriefCookie); //字符串转化成JSON数据
    return myDataBriefCookie.UserID;
}
//获取 登录用户名
JQGlobal.getUserName = function () {
    //var myDataBriefCookie = $.cookie('myDataBriefCookie');
    var myDataBriefCookie = window.UserLoginObj;
    if (myDataBriefCookie == undefined || myDataBriefCookie == "") {
        window.parent.location.href = "login.htm";
        return null;
    }
    //var newObject = JSON.parse(myDataBriefCookie); //字符串转化成JSON数据
    return myDataBriefCookie.UserName;
}

JQGlobal.exitSys = function () {
    //$.cookie('myDataBriefCookie', null, { expires: -1, path: '/' });
    window.location.href = "login.htm";
}

JQGlobal.getStartDate = function () {
    var nstartdate = window._webconfig.nStartDate;
    return nstartdate == undefined ? new Date().format("yyyy-MM-dd") : nstartdate;
}

JQGlobal.getEndDate = function () {
    var nenddate = window._webconfig.nEndDate;
    return nenddate == undefined ? new Date().format("yyyy-MM-dd") : nenddate;
}

JQGlobal.getWeekStartDate = function () {
    var nstartdate = window._webconfig.nWeekStartDate;
    return nstartdate == undefined ? DateComponent.getWeekMonday(new Date().format("yyyy-MM-dd")) : nstartdate;
}

JQGlobal.getWeekEndDate = function () {
    var nenddate = window._webconfig.nWeekEndDate;
    return nenddate == undefined ? DateComponent.getWeekSunday(new Date().format("yyyy-MM-dd")) : nenddate;
}

JQGlobal.getMonthStartDate = function () {
    var nstartdate = window._webconfig.nMonthStartDate;
    return nstartdate == undefined ? new Date().format("yyyy-MM-01") : nstartdate;
}

JQGlobal.getMonthEndDate = function () {
    var nenddate = window._webconfig.nMonthEndDate;
    return nenddate == undefined ? DateComponent.getMonthLastDay(new Date().format("yyyy-MM-01")) : nenddate;
}

JQGlobal.getYearStartDate = function () {
    var nstartdate = window._webconfig.nYearStartDate;
    return nstartdate == undefined ? new Date().format("yyyy-01-01") : nstartdate;
}

JQGlobal.getYearEndDate = function () {
    var nenddate = window._webconfig.nYearEndDate;
    return nenddate == undefined ? new Date().format("yyyy-12-31") : nenddate;
}

//系统报表配置
JQGlobal._sysReportList = {};
//系统报表配置
JQGlobal._sysReportConfig = [];
JQGlobal.getReportConfig = function (ReportCode) {
    for (var i = 0; i < JQGlobal._sysReportConfig; i++) {
        var report = JQGlobal._sysReportConfig[i];
        if (report.code == ReportCode) {
            return report;
        }
    }
    return null;
}

//登录用户的用户报表配置
JQGlobal._userReportConfig = {};
//登录用户所对应的角色所拥有的报表集合
JQGlobal._userRoleReportConfig = [];
//数据源列表
JQGlobal._dataSource = [];
//数据源字段定义列表
JQGlobal._dataSourceComment = [];
//数据源过滤条件列表
JQGlobal._dataSourceFilter = [];
//用户绑定数据源过滤条件值列表
JQGlobal._dataSourceFilterValue = [];
//数据字典类型
JQGlobal._dictType = [];
//数据字典值
JQGlobal._dictInfo = [];

////////////////////////////////////////////////////////////
//获取服务器的地址
JQGlobal.getServerName = function ()
{ return window._webconfig._addressServerName; }
////////////////////////////////////////////////////////////
//获取POST请求地址
JQGlobal.getPostUrlName = function (MsgID) {
    var servername = window._webconfig._addressServerName;
    if (window._webconfig._sysDataType == "JSTABLE") {
        return servername + MsgID + ".app";
    }
    else {
        return servername;
    }
}
////////////////////////////////////////////////////////////
//获取服务器的地址
JQGlobal.getESPostUrlName = function (MsgID) {
    var servername = window._webconfig._addressESServerName;
    return servername + MsgID + "/_search";
}

//产生新的JSON消息
JQGlobal.NewMessage = function () {
    var Request = { ConnectSequence: JQGlobal.getConnectSequence() };
    return Request;
}

/**
* 事件回调全局通用函数(最多支持5个参数)
* @param {Object} target   被调用函数的this指针
* @param {String} callback 被调用函数指针(函数型)
*/
//用于:
//  1.触发指定对象的指定方法 target为宿主对象 callback为宿主事件实现函数
//  2.调用基类的指定方法     target为当前对象 callback为保存的基类方2法
JQGlobal.doCallBack = function (target, callback, Request, Option, data) {
    if (target != null && callback != null) {
        target.__callback = callback;
        return target.__callback(Request, Option, data);
    }
}

//同步发送消息 返回值:回复体
JQGlobal.SendMessage = function (MsgID, Request) {
    var xmlHttp = new XMLHttp();

    //var strSend = Request.toJSONString();
    var strSend = Json.toString(Request);

    this._bInMessage = true;
    try {
        xmlHttp.open("POST", JQGlobal.getServerName() + MsgID + ".app", false);
        xmlHttp.send(strSend);

        var strRecv = xmlHttp.responseText;
        //var Return = strRecv.parseJSON();
        var Return = Json.fromString(strRecv);
    }
    catch (e) {
        var Return = {};
        Return.ErrorID = -1;
        Return.ErrorString = "网络异常!";
    }
    this._bInMessage = false;

    //结束后清除xmlHttp对象
    xmlHttp.destroy();

    //记住最后一次接收及发送的报文
//    JQGlobal._lastMessageData = { MsgID: MsgID, Request: Request, Return: Return };

    return Return;
}

//异步发送消息 返回值:发送失败返回null 发送成功返回发送的xmlHttp对象
//  CallBack函数回调参数:Request Return CallBackData
JQGlobal.PostMessage = function (MsgID, Request, Option, Owner, CallBack) {

    var strSend = Json.toString(Request);

    var xmlHttp = new XMLHttp(this);

    xmlHttp.onsuccess = function (xmlHttp) {
        try {
            var strRecv = xmlHttp.responseText;

            //var Return = strRecv.parseJSON();
            var Return = Json.fromString(strRecv);
        }
        catch (e) {
            var Return = {};
            Return.ErrorID = -1;
            Return.ErrorString = "网络异常!";
        }

        //进行回调
        JQGlobal.doCallBack(Owner, CallBack, Request, Option, Return);

        //结束后清除xmlHttp对象
        xmlHttp.destroy();
    }
    xmlHttp.onerror = function (xmlHttp) {
        var Return = {};
        Return.ErrorID = -1;
        Return.ErrorString = "网络异常!";

        //进行回调
        JQGlobal.doCallBack(Owner, CallBack, Request, Option, Return);

        //结束后清除xmlHttp对象
        xmlHttp.destroy();
    }

    try {
        xmlHttp.open("POST", JQGlobal.getServerName() + MsgID + ".app", true);
        xmlHttp.send(strSend);
    }
    catch (e) {
        alert(e.message);
        return null;
    }

    return xmlHttp;



//    $.ajax({
//        url: JQGlobal.getPostUrlName(MsgID),
//        type: "post",
//        data: { "Request": JSON.toString(Request) },
//        success: function (data) {
//            //进行回调
//            JQGlobal.doCallBack(Owner, CallBack, Request , Option, data);
//        }
//    });
}


//同步发送消息 返回值:回复体
JQGlobal.SendESMessage = function (MsgID, Request) {
    var xmlHttp = new XMLHttp();

    //var strSend = Request.toJSONString();
    var strSend = JSON.stringify(Request);

    this._bInMessage = true;
    try {
        xmlHttp.open("POST", JQGlobal.getESPostUrlName(MsgID), false);
        xmlHttp.send(strSend);

        var strRecv = xmlHttp.responseText;
        //var Return = strRecv.parseJSON();
        var Return = Json.fromString(strRecv);
    }
    catch (e) {
        var Return = {};
        Return.ErrorID = -1;
        Return.ErrorString = "网络异常!";
    }
    this._bInMessage = false;

    //结束后清除xmlHttp对象
    xmlHttp.destroy();

    //记住最后一次接收及发送的报文
    //    JQGlobal._lastMessageData = { MsgID: MsgID, Request: Request, Return: Return };

    return Return;
}
//异步发送消息 返回值:发送失败返回null 发送成功返回发送的xmlHttp对象
//  CallBack函数回调参数:Request Return CallBackData
JQGlobal.PostESMessage = function (MsgID, Request, Option, Owner, CallBack) {
    var strSend = JSON.stringify(Request);

    try {
        $.ajax({
            url: JQGlobal.getESPostUrlName(MsgID),
            datatype: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            type: 'post',
            data: strSend,
            success: function (data) {   //成功后回调
                //进行回调
                JQGlobal.doCallBack(Owner, CallBack, Request, Option, data);
            },
            error: function (e) {    //失败后回调
                console.log(e);
            }
        })
    }
    catch (e) {
        var Return = {};
        Return.ErrorID = -1;
        Return.ErrorString = "网络异常!";
    }
}



/**
* 延长一定时间后调用
* @param {Object} targe   目标调用对象
* @param {Object} method  目标调用函数
* @param {Int}    timeout 延时时长
* @return 定时器句柄(可以使用clearTimeout清除)
*/
JQGlobal.timerCall = function (targe, method, timeout) {
    if (timeout == undefined)
        throw "Invalid timerCall timeout Param!";
    if (targe == null || method == null)
        return null;

    var TARGET = targe;
    var METHOD = method;
    var params = arguments;
    var callObject = { timer: null };

    callObject.timer = window.setTimeout(
        function () {
            //注意: 在IE中,定时器清除以后有时还会执行,这是IE的BUG
            if (callObject.timer == null) return;
            //如果已与主层Frame脱离关系,则不继续调用 YGF 2010.11.28
            if (_webconfig == null) return;

            try {
                TARGET.__callback = METHOD;
                TARGET.__callback(params[3], params[4], params[5], params[6], params[7]);
            }
            catch (e) { }
        },
        timeout);

    return callObject;
}

/**
* 清除延时调用
* @param {Object} callObject Global.afterCall或Global.timerCall函数返回的对象
*/
JQGlobal.clearCall = function (callObject) {
    if (callObject != null && callObject.timer != null) {
        window.clearTimeout(callObject.timer);
        callObject.timer = null;
    }
}
