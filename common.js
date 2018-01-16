
function GetQueryString(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
//    var r = window.location.search.substr(1).match(reg);
    //    if (r != null) return decodeURI(r[2]); return null;

    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            if (arr[i].substring(0, num).toLowerCase() == name.toLowerCase()) {
                return arr[i].substr(num + 1);
            }
        }
    }
    return "";
}

function showDateNow() {
    var date = new Date().format("yyyy-MM-dd hh:mm:ss");
    document.getElementById("lbDate").innerHTML = date;
}

function showHeaderDateTitle(startdate, enddate) {
    if (startdate != enddate) {
        document.getElementById("HeaderDateTitle").innerHTML = startdate + " " + enddate;
    }
    else {
        document.getElementById("HeaderDateTitle").innerHTML = startdate;
    }
}

function iFrameHeight() {
    var frame = document.getElementById("iframepage");
    var subWeb = document.frames ? frame.document : frame.contentDocument;
    if (frame != null && subWeb != null) {
        var width = window.screen.width;
        var height = window.innerHeight;
        //alert(height);
        //var bodyheight = subWeb.body.scrollHeight > 0 ? subWeb.body.scrollHeight : subWeb.body.clientHeight;

        frame.height = height - 50;
//        if (bodyheight > height) {
//            frame.height = bodyheight;
//        }
//        else {
//            frame.height = height;
//        }
        //        frame.width = "100%";
    }
}

function iParentFrameHeight() {
    var frame = document.parentNode.getElementById("iframepage");
    var subWeb = document.frames ? frame.document : frame.contentDocument;
    if (frame != null && subWeb != null) {
        var width = window.screen.width;
        var height = window.screen.height;
        var bodyheight = subWeb.body.scrollHeight > 0 ? subWeb.body.scrollHeight : subWeb.body.clientHeight;        
        
        if (bodyheight > height) {
            frame.height = bodyheight;
        }
        else {
            frame.height = height;
        }
//        frame.width = "100%";
    }
}

function switchmainpage(url) {
    document.getElementById("iframepage").src = url;
}

function switchmainpagename(url,spname) {
    document.getElementById("iframepage").src = url;
    document.getElementById("spReportName").innerHTML = spname;
}

function onscroll() {
    document.getElementById('iframepage').contentWindow.document.body.scrollTop = document.body.scrollTop;
    alert(document.getElementById('iframepage').contentWindow.document.body.scrollTop);
}

function exitsys() {
    JQGlobal.exitSys();
}

function selectAll(pElementId) {
    $("#" + pElementId + " :checkbox").each(function () {
        $(this).prop("checked", true);
    });
}

function selectInverse(pElementId) {
    $("#" + pElementId + " :checkbox").each(function () {
        if ($(this).is(':checked')) {
            $(this).prop("checked", false);
        }
        else {
            $(this).prop("checked", true);
        }
    });
}

function highlight() {
    clearSelection(); //先清空一下上次高亮显示的内容；

    var searchText = $('#searchstr').val();
    if ($.trim(searchText) == "") {
        return;
    }
    var searchText = $('#searchstr').val(); //获取你输入的关键字；
    var regExp = new RegExp(searchText, 'i'); //创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；
    var content = $("#divsearchcontent").text();

    $('label').each(function () {
        var html = $(this).html();
        var newHtml = html.replace(regExp, '<span class="highlight">' + searchText + '</span>'); //将找到的关键字替换，加上highlight属性；

        $(this).html(newHtml); //更新；
        flag = 1;
    });
}
function clearSelection() {
    $('label').each(function () {
        //找到所有highlight属性的元素；
        $(this).find('.highlight').each(function () {
            $(this).replaceWith($(this).html()); //将他们的属性去掉；
        });
    });
}

function getMyDefineCode(defineid) {
    return "mydefinereports-" + defineid;
}

function getMyDefineIDByCode(code) {
    return code.replace("mydefinereports-","");
}

function isMyDefineCode(code) {
    if (code.indexOf("mydefinereports") >= 0) {
        return true;
    }
    else {
        return false;
    }
}