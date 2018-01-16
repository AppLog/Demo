
var CanvasComponent = {};
CanvasComponent.Canvas001 = function (data, optionatt) {
    var samplecount = 0;
    for (var i = 0; i < data.length; i++) {
        samplecount += data[i].ItemCount;
    }
    var colors = optionatt.report.canvasColor.split(",");
    var canvascolor = "#44B7D3";
    if (colors.length > 0) {
        canvascolor = colors[0];
    }

    var c = document.createElement("canvas");
    c.width = 320;
    c.height = 260;
    $("#" + optionatt.DivId).html("");
    $("#" + optionatt.DivId).append(c);
//    c.parentNode.style.display = "block";
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";
    ctx.fillStyle = "#4E5D7C";
    ctx.fillText(optionatt.report.textStyle, 10, 30);

    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(90, 110, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = canvascolor; //线的样式
    ctx.fillStyle = canvascolor;
    ctx.fill();

    var ctx = c.getContext("2d");
    ctx.font = "14px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(optionatt.report.subtextStyle, 70, 100);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    var x = this.getItemPoint(samplecount, 85);
    var y = 125;
    ctx.fillText(samplecount, x, y);
    return "canvas";
}

CanvasComponent.Canvas002 = function (data, optionatt) {
    var samplecount = 0;
    for (var i = 0; i < data.length; i++) {
        samplecount += data[i].ItemValue;
    }
    var colors = optionatt.report.canvasColor.split(",");
    var canvascolor = "#44B7D3";
    if (colors.length > 0) {
        canvascolor = colors[0];
    }

    var c = document.createElement("canvas");
    c.width = 320;
    c.height = 260;
    $("#" + optionatt.DivId).html("");
    $("#" + optionatt.DivId).append(c);
//    c.parentNode.style.display = "block";
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";
    ctx.fillStyle = "#4E5D7C";
    ctx.fillText(optionatt.report.textStyle, 10, 30);

    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(90, 110, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = canvascolor; //线的样式
    ctx.fillStyle = canvascolor;
    ctx.fill();

    var ctx = c.getContext("2d");
    ctx.font = "14px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(optionatt.report.subtextStyle, 70, 100);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    var x = this.getItemPoint(samplecount, 85);
    var y = 125;
    ctx.fillText(samplecount, x, y);
    return "canvas";
}

CanvasComponent.Canvas003 = function (data, optionatt) {
    //    if (data.length < 2) {
    //        return;
    //    }

    var colors = optionatt.report.canvasColor.split(",");
    var canvascolor = "#44B7D3";
    if (colors.length > 0) {
        canvascolor = colors[0];
    }

    var c = document.createElement("canvas");
    c.width = 320;
    c.height = 260;
    $("#" + optionatt.DivId).html("");
    $("#" + optionatt.DivId).append(c);
//    c.parentNode.style.display = "block";
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";
    ctx.fillStyle = "#4E5D7C";
    ctx.fillText(optionatt.report.textStyle, 10, 30);

    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(90, 110, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = canvascolor; //线的样式
    ctx.fillStyle = canvascolor;
    ctx.fill();

    this.drawDashLine(ctx, 190, 110, 120, 200, 5, canvascolor);

    if (colors.length > 1) {
        canvascolor = colors[1];
    }
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = canvascolor; //线的样式
    ctx.fillStyle = canvascolor;
    ctx.arc(210, 200, 50, 0, 2 * Math.PI);
    ctx.fill();

    var ctx = c.getContext("2d");
    ctx.font = "14px Arial";
    ctx.fillStyle = "#FFFFFF";
    if (data.length > 0) {
        ctx.fillText(data[0].ItemName, 70, 100);
    }
    if (data.length > 1) {
        ctx.fillText(data[1].ItemName, 190, 195);
    }


    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    if (data.length > 0) {
        var x = this.getItemPoint(data[0].ItemCount, 90);
        ctx.fillText(data[0].ItemCount, x, 125);
    }
    if (data.length > 1) {
        x = this.getItemPoint(data[1].ItemCount, 210);
        ctx.fillText(data[1].ItemCount, x, 220);
    }
    return "canvas";
}

CanvasComponent.getBeveling = function (x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

CanvasComponent.drawDashLine = function (context, x1, y1, x2, y2, dashLen, dashColor) {
    dashLen = dashLen === undefined ? 5 : dashLen;
    //得到斜边的总长度  
    var beveling = this.getBeveling(x2 - x1, y2 - y1);
    //计算有多少个线段  
    var num = Math.floor(beveling / dashLen);

    for (var i = 0; i < num; i++) {
        context[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / num * i, y1 + (y2 - y1) / num * i);
    }
    context.strokeStyle = dashColor; //线的样式
    context.stroke();
}

CanvasComponent.getItemPoint = function (samplecount,x) {
    if (samplecount >= 10 && samplecount < 100) {
        x = x - 6;
    }
    if (samplecount >= 100 && samplecount < 1000) {
        x = x - 12;
    }
    if (samplecount >= 1000 && samplecount < 10000) {
        x = x - 18;
    }
    if (samplecount >= 10000 && samplecount < 100000) {
        x = x - 24;
    }
    if (samplecount >= 100000 && samplecount < 1000000) {
        x = x - 30;
    }
    if (samplecount >= 1000000 && samplecount < 10000000) {
        x = x - 36;
    }
    return x;
}