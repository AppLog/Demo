Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var DateComponent = {};
function DateComponent() {
}
//根据配置生成X轴内容
DateComponent.buildReportXName = function (reportarr) {
    var xname = [];
    switch (parseInt(reportarr.timeType)) {
        case 1: //小时
            var starthour = this.getDatePart(reportarr.startTime, "h");
//            var startmin = this.getDatePart(reportarr.startTime, "n");
            var endhour = this.getDatePart(reportarr.endTime, "h");
//            var endmin = this.getDatePart(reportarr.endTime, "n");
//            var curvalue = starthour + ":" + startmin;
            //            var maxvalue = endhour + ":" + endmin;
            var curvalue = starthour;
            var maxvalue = endhour;
            while (curvalue <= maxvalue) {
                xname.push(curvalue);
                curvalue = this.getDateAddPart(curvalue, "h", parseInt(reportarr.intervalTime));
            }
            break;
        case 2: //分钟
            var starthour = this.getDatePart(reportarr.startTime, "h");
            var startmin = this.getDatePart(reportarr.startTime, "n");
            var endhour = this.getDatePart(reportarr.endTime, "h");
            var endmin = this.getDatePart(reportarr.endTime, "n");
            var curvalue = starthour + ":" + startmin;
            var maxvalue = endhour + ":" + endmin;
            while (curvalue <= maxvalue) {
                xname.push(curvalue);
                curvalue = this.getDateAddPart(curvalue, "n", parseInt(reportarr.intervalTime));
            }
            break;
        case 3: //天
            break;
        case 4: //月
            break;
        case 5: //数值
            var curvalue = parseInt(reportarr.startTime);
            var maxvalue = parseInt(reportarr.endTime);
            while (curvalue <= maxvalue) {
                xname.push(curvalue);
                curvalue = parseInt(curvalue) + parseInt(reportarr.intervalTime);
            }
            break;
    }
    return xname;
}

//根据配置生成X轴内容格式化数值
DateComponent.formatDatePart = function (reportarr, formatvalue) {
    var ret = this.PrefixInteger(formatvalue,2);
    switch (parseInt(reportarr.timeType)) {
        case 1: //小时
            break;
        case 2: //分钟
            var splits = ret.split(':');
            if (splits.length < 2) {
                ret = splits[0] + ":00";
            }
            break;
    }
    return ret;
}
//格式化参数 在1位数据的情况下前面自动补个0
DateComponent.getDatePart = function (formatstr, interval) {
    if (formatstr == undefined || formatstr == null || formatstr == "") {
        return "00";
    }
    var ret = "00";
    switch (interval) {
        case "h":
            if (formatstr.indexOf(":") >= 0) {
                var splits = formatstr.split(":");
                ret = splits[0];
                if (ret.length == 1) {
                    ret = "0" + splits[0];
                }
            }
            else {
                ret = formatstr;
                if (ret.length == 1) {
                    ret = "0" + formatstr;
                }
            }
            break;
        case "n":
            if (formatstr.indexOf(":") >= 0) {
                var splits = formatstr.split(":");
                ret = splits[1];
                if (ret.length == 1) {
                    ret = "0" + splits[1];
                }
            }
            break;
    }
    return ret;
}
//给日期添加相应的值
DateComponent.getDateAddPart = function (formatstr, interval, number) {
    if (formatstr == undefined || formatstr == null || formatstr == "") {
        return "00";
    }
    var ret = "00";
    var date = new Date();
    switch (interval.toLowerCase()) {
        case "y":
            var newdate = new Date(date.setFullYear(formatstr));
            newdate = new Date(newdate.setFullYear(newdate.getFullYear() + number));
            ret = newdate.format("yy");
            break;
        case "m":
            var newdate = new Date(date.setMonth(formatstr));
            newdate = new Date(newdate.setMonth(newdate.getMonth() + number));
            ret = newdate.format("MM");
            break;
        case "d":
            var newdate = new Date(date.setDate(formatstr));
            newdate = new Date(newdate.setDate(newdate.getDate() + number));
            ret = newdate.format("dd");
            break;
        case "w":
            var newdate = new Date(date.setDate(formatstr));
            newdate = new Date(newdate.setDate(newdate.getDate() + 7 * number));
            ret = newdate.getDay();
            break;
        case "h":
//            var splits = formatstr.split(":");
//            var newdate = new Date(date.setHours(splits[0]));
//            newdate = new Date(date.setMinutes(splits[1]));
//            newdate = new Date(newdate.setHours(newdate.getHours() + number));
//            ret = newdate.format("hh:mm");
            var newdate = new Date(date.setHours(formatstr));
            newdate = new Date(newdate.setHours(newdate.getHours() + number));
            ret = newdate.format("hh");
            break;
        case "n":
            var splits = formatstr.split(":");
            var newdate = new Date(date.setHours(splits[0]));
            newdate = new Date(date.setMinutes(splits[1]));
            newdate = new Date(newdate.setTime(newdate.getTime() + 1000 * 60 * number));
            ret = newdate.format("hh:mm");
            break;
    }

    return ret;
}

//传一个日期 获取当月最后一天
DateComponent.getMonthLastDay = function (DateStr) {
    var newdate = new Date(DateStr);
    newdate = new Date(newdate.setMonth(newdate.getMonth() + 1)); //加一个月
    newdate = new Date(newdate.setDate(newdate.getDate() - 1)); //减一天
    ret = newdate.format("yyyy-MM-dd");
    return ret;
}

//传一个日期 获取当前日期 周一
DateComponent.getWeekMonday = function (DateStr) {
    var now = new Date(DateStr);

    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000;

    var MondayTime = nowTime - (day - 1) * oneDayLong;
    var monday = new Date(MondayTime);

    ret = monday.format("yyyy-MM-dd");
    return ret;
}

//传一个日期 获取当前日期 周日
DateComponent.getWeekSunday = function (DateStr) {
    var now = new Date(DateStr);

    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000;

    var MondayTime = nowTime - (day - 1) * oneDayLong;
    var SundayTime = nowTime + (7 - day) * oneDayLong;

    var sunday = new Date(SundayTime);

    ret = sunday.format("yyyy-MM-dd");
    return ret;
}

//传一个数字 返回是星期几
DateComponent.getWeekName = function (week) {
    var ret = week;
    switch (parseInt(week)) {
        case 1:
            ret = "星期天";
            break;
        case 2:
            ret = "星期一";
            break;
        case 3:
            ret = "星期二";
            break;
        case 4:
            ret = "星期三";
            break;
        case 5:
            ret = "星期四";
            break;
        case 6:
            ret = "星期五";
            break;
        case 7:
            ret = "星期六";
            break;

    }
    return ret;
}

//传星期几 返回是数字
DateComponent.getWeekValue = function (week) {
    var ret = week;
    switch (week) {
        case "星期天":
            ret = 1;
            break;
        case "星期一":
            ret = 2;
            break;
        case "星期二":
            ret = 3;
            break;
        case "星期三":
            ret = 4;
            break;
        case "星期四":
            ret = 5;
            break;
        case "星期五":
            ret = 6;
            break;
        case "星期六":
            ret = 7;
            break;

    }
    return ret;
}


DateComponent.PrefixInteger = function (num, length) {
    return ("0000000000000000" + num).substr(-length);
}

DateComponent.getTimeStampByDate = function (date) {
    var d = new Date(date);
    var timestamp = Math.round(d.getTime());
    return timestamp;
}

DateComponent.getDateByTimeStamp = function (timestamp) {
    var datetime = new Date();
    datetime.setTime(timestamp);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var mseconds = datetime.getMilliseconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second + "." + mseconds;
}
