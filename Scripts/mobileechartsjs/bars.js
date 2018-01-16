
var EchartsBarComponent = {};

//柱形图 横向 ItemName,ItemCount
EchartsBarComponent.Bar001 = function (data, optionatt) {
    _tableData = data;
//    if(_tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();//项目集合
    var xaxisdata = new Array();//X轴集合
    var xaxisdata_1 = new Array();//X轴集合显示
    var yaxisdata = new Array();//y轴集合
    var fields = new Array();//数据列集合
    
    var seriesdata = new Array();
    var hasxvalue = false;//是否包含xvalue列
    var hasitemvalue = false;//是否双Y轴
    var hasitemgroup = false;//是否包含分组
    var itemgroupvalue = new Array();

    for (var key in _tableData[0]) {
        if (key.length > 0 && !fields.contains(key)) {
            fields.push(key);
            if(key == "XValue")
            {
                hasxvalue=true;
            }
            if(key == "ItemValue")
            {
                hasitemvalue=true;
            }
            if(key == "ItemGroup")
            {
                hasitemgroup=true;
            }
        }
    }
    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合
      
        if(optionatt.XValueCondition == 1){
            for(var i=0;i<xaxisdata.length;i++){  
                xaxisdata_1.push(xaxisdata[i]);
            }
        }      
        else{
            for(var i=0;i<xaxisdata.length - 1;i++){  
                xaxisdata_1.push(xaxisdata[i]+"-"+xaxisdata[i+1]);
            }
        }
    }
    //循环得到 系列项目 和 X轴数据集合
    for (var i = 0; i < _tableData.length; i++) {
        if(hasxvalue){
            if (_tableData[i].ItemName.toString() != "" && !legendvalue.contains(_tableData[i].ItemName.toString())) {
                legendvalue.push(_tableData[i].ItemName.toString());
                if(hasitemgroup)
                {
                    itemgroupvalue.push(_tableData[i].ItemGroup);
                }
            }

            if (optionatt.XValue.length <= 0 && !xaxisdata.contains(_tableData[i].XValue)) {
                xaxisdata.push(_tableData[i].XValue);
                xaxisdata_1.push(_tableData[i].XValue);
            }
        }
        else
        {
            if (optionatt.XValue.length <= 0 &&_tableData[i].ItemName.toString() != "" &&  !xaxisdata.contains(_tableData[i].ItemName.toString())) {
                xaxisdata.push(_tableData[i].ItemName.toString());
                xaxisdata_1.push(_tableData[i].ItemName.toString());
            }
        }
    }

    function initSeriesData(legend,group){  
        var ndata = new Array();
        var ndata1 = new Array();
        var nmaxvalue = 0;
        var nminvalue = 0;
        
        for (var j = 0; j < xaxisdata.length; j++) {
            //范围
            if(optionatt.XValueCondition == 2){
                if(j >= xaxisdata.length - 1)
                {
                    continue;
                }
            }
            ndata.push(0);
            ndata1.push(0);
            for (var m = 0; m < _tableData.length; m++) {
                if(legend != "")
                {
                    if (_tableData[m].ItemName == legend) {
                        if(optionatt.XValueCondition == 1){
                            if(this._tableData[m].XValue == xaxisdata[j]){
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                        else{
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                    }
                }
                else
                {
                        if(optionatt.XValueCondition == 1){
                            if(this._tableData[m].ItemName == xaxisdata[j]){
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                        else{
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                }
            }
        }
        
        var series = {};
        series.type = "bar";
        series.name = legend;
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            series.barWidth = optionatt.report.BarWidth;
        }

        if(optionatt.report.isPercent){
            if(optionatt.report.isShowValue){
                series.label = {
                    normal: {
                        show: true,
                        formatter:'{c}%',
                        position: 'top'
                    }
                };
            }
            var sumcount = 0;
            for(var d =0;d<ndata.length;d++){
                sumcount+=ndata[d];
            }
            for(var d =0;d<ndata.length;d++){
                ndata[d] = parseFloat((ndata[d] * 100) / sumcount).toFixed(0);
            }
        }
        else
        {
            if(optionatt.report.isShowValue){
                series.label = {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                };
            }
        }
        if(optionatt.report.isShowMaxMin){
            series.markPoint = {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            };
        }
        if(optionatt.report.isShowAvg){
            series.markLine = {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            };
        }
        if(hasitemgroup)
        {
            series.stack = itemgroupvalue[group];//分组显示
        }
        //公式计算
        if(optionatt.report.DataColFormula != undefined && optionatt.report.DataColFormula != "") {
            var nnewdatas = new Array();
            for(var _i=0;_i <ndata.length;_i++) {
                var formula = optionatt.report.DataColFormula;
                while(formula.indexOf("[1]") >= 0) {
                    formula = formula.replace("[1]",ndata[_i]);
                }
                while(formula.indexOf("[2]") >= 0 && ndata1 != undefined) {
                    formula = formula.replace("[2]",ndata1[_i]);
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
        
        if(hasitemvalue)
        {
            var series = {};
            series.type = "line";
            series.name = legend;
            series.data = ndata1;
            series.yAxisIndex = 1;
            seriesdata.push(series);
        }
    }

    if(legendvalue.length>0)
    {
        for (var i = 0; i < legendvalue.length; i++) {  
            initSeriesData(legendvalue[i],i);
        }
    }
    else
    {
        initSeriesData("",0);
    }

    var yMaxValue=null;
    if(optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0)
    {
        yMaxValue=optionatt.report.YMaxValue;
    }
    var yMaxValue1=null;
    if(optionatt.report.YMaxValue1 != undefined && optionatt.report.YMaxValue1 > 0)
    {
        yMaxValue1=optionatt.report.YMaxValue1;
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
    if(hasitemvalue)
    {
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
    
    for(var i=0;i<yaxisdata.length;i++)
    {
        if(typeof yaxisdata[i] == "string")
        {
            yaxisdata[i] = yaxisdata[i].replace("\\n","\n");
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
            x:'center',
            subtext: optionatt.SubTitle
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
//        toolbox: {
//            orient: optionatt.ToolBoxOrient,
//            show: true,
//            feature: {
//                mark: { show: true },
//                dataView: { show: true, readOnly: false },
//                magicType: {
//                    show: true,
//                    type: ['line', 'bar'],
//                    option: {
//                        funnel: {
//                            x: '25%',
//                            width: '50%',
//                            funnelAlign: 'left',
//                            max: 1548
//                        }
//                    }
//                },
//                restore: { show: true },
//                saveAsImage: { show: true }
//            }
//        },
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
        yAxis:yaxisdata,
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


//柱形图 横向 ItemName,ItemCount
EchartsBarComponent.Bar002 = function (data, optionatt) {
    _tableData = data;
//    if(_tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();//项目集合
    var xaxisdata = new Array();//X轴集合
    var xaxisdata_1 = new Array();//X轴集合显示
    var yaxisdata = new Array();//y轴集合
    var fields = new Array();//数据列集合
    
    var seriesdata = new Array();
    var hasxvalue = false;//是否包含xvalue列
    var hasitemvalue = false;//是否双Y轴
    var hasitemgroup = false;//是否包含分组
    var itemgroupvalue = new Array();

    for (var key in _tableData[0]) {
        if (key.length > 0 && !fields.contains(key)) {
            fields.push(key);
            if(key == "XValue")
            {
                hasxvalue=true;
            }
            if(key == "ItemValue")
            {
                hasitemvalue=true;
            }
            if(key == "ItemGroup")
            {
                hasitemgroup=true;
            }
        }
    }
    
    function NumDescSort(a,b){
        //公式计算
        if(optionatt.report.DataColFormula != undefined && optionatt.report.DataColFormula != "") {                                    
            var formula = optionatt.report.DataColFormula;
            while(formula.indexOf("[1]") >= 0) {
                formula = formula.replace("[1]",a.ItemCount);
            }
            while(formula.indexOf("[2]") >= 0) {
                formula = formula.replace("[2]",a.ItemValue);
            }
            var ItemCount1 = eval(formula).toFixed(0);                                 
            var formula = optionatt.report.DataColFormula;
            while(formula.indexOf("[1]") >= 0) {
                formula = formula.replace("[1]",b.ItemCount);
            }
            while(formula.indexOf("[2]") >= 0) {
                formula = formula.replace("[2]",b.ItemValue);
            }
            var ItemCount2 = eval(formula).toFixed(0);
            return ItemCount1-ItemCount2;
        }
        else{
            return a.ItemCount-b.ItemCount;
        }
    }

    //有配置则采用配置的X轴信息
    if (optionatt.XValue.length > 0) {
        xaxisdata = optionatt.XValue; //X轴数据集合
        if(optionatt.XValueCondition == 1){
            for(var i=0;i<xaxisdata.length;i++){  
                xaxisdata_1.push(xaxisdata[i]);
            }
        }      
        else{
            for(var i=0;i<xaxisdata.length - 1;i++){  
                xaxisdata_1.push(xaxisdata[i]+"-"+xaxisdata[i+1]);
            }
        }
    }
    else{
        if(hasxvalue)
        {
            var result = _tableData.reduce(function(res, obj) {
                if (!(obj.XValue in res))
                {
                    var newobj = {};
                    newobj.XValue = obj.XValue;
                    newobj.ItemCount = obj.ItemCount;
                    if(hasitemvalue) {
                        newobj.ItemValue = obj.ItemValue;
                    }
                    res.__array.push(res[obj.XValue] = newobj);
                }
                else {
                    res[obj.XValue].ItemCount += obj.ItemCount;
                    if(hasitemvalue) {
                        res[obj.XValue].ItemValue += obj.ItemValue;
                    }
                }
                return res;
            }, {__array:[]}).__array
                            .sort(function(a,b) { 
                                //公式计算
                                if(optionatt.report.DataColFormula != undefined && optionatt.report.DataColFormula != "") {                                    
                                    var formula = optionatt.report.DataColFormula;
                                    while(formula.indexOf("[1]") >= 0) {
                                        formula = formula.replace("[1]",a.ItemCount);
                                    }
                                    while(formula.indexOf("[2]") >= 0) {
                                        formula = formula.replace("[2]",a.ItemValue);
                                    }
                                    a.ItemCount = eval(formula).toFixed(0);                                 
                                    var formula = optionatt.report.DataColFormula;
                                    while(formula.indexOf("[1]") >= 0) {
                                        formula = formula.replace("[1]",b.ItemCount);
                                    }
                                    while(formula.indexOf("[2]") >= 0) {
                                        formula = formula.replace("[2]",b.ItemValue);
                                    }
                                    b.ItemCount = eval(formula).toFixed(0);
                                }
                                return a.ItemCount - b.ItemCount; 
                            });

            for(var i=0;i<result.length;i++)
            {
                if (!xaxisdata.contains(result[i].XValue)) {
                    xaxisdata.push(result[i].XValue);
                    xaxisdata_1.push(result[i].XValue);
                }
            }
        }
        else{
            _tableData.sort(NumDescSort);
        }
    }
    //循环得到 系列项目 和 X轴数据集合
    for (var i = 0; i < _tableData.length; i++) {
        if(hasxvalue){
            if (_tableData[i].ItemName.toString() != "" && !legendvalue.contains(_tableData[i].ItemName.toString())) {
                legendvalue.push(_tableData[i].ItemName.toString());
                if(hasitemgroup)
                {
                    itemgroupvalue.push(_tableData[i].ItemGroup);
                }
            }

//            if (optionatt.XValue.length <= 0 && !xaxisdata.contains(_tableData[i].XValue)) {
//                xaxisdata.push(_tableData[i].XValue);
//            }
        }
        else
        {
            if (optionatt.XValue.length <= 0 &&_tableData[i].ItemName.toString() != "" &&  !xaxisdata.contains(_tableData[i].ItemName.toString())) {
                xaxisdata.push(_tableData[i].ItemName.toString());
                xaxisdata_1.push(_tableData[i].ItemName.toString());
            }
        }
    }

    function initSeriesData(legend,group){  
        var ndata = new Array();
        var ndata1 = new Array();
        var nmaxvalue = 0;
        var nminvalue = 0;
        for (var j = 0; j < xaxisdata.length; j++) {
            ndata.push(0);
            ndata1.push(0);
            for (var m = 0; m < _tableData.length; m++) {
                if(legend != "")
                {
                    if (_tableData[m].ItemName == legend) {
                        if(optionatt.XValueCondition == 1){
                            if(this._tableData[m].XValue == xaxisdata[j]){
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                        else{
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                    }
                }
                else
                {
                        if(optionatt.XValueCondition == 1){
                            if(this._tableData[m].ItemName == xaxisdata[j]){
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                        else{
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
                                if(hasitemvalue)
                                {
                                    if (parseInt(_tableData[m].ItemValue) > 0) 
                                        ndata1[j] += _tableData[m].ItemValue;
                                }
                            }
                        }
                }
            }
        }
        
        var series = {};
        series.type = "bar";
        series.name = legend;
        if(optionatt.report.isPercent){
            if(optionatt.report.isShowValue){
                series.label = {
                    normal: {
                        show: true,
                        formatter:'{c}%',
                        position: 'insideRight'
                    }
                };
            }
            var sumcount = 0;
            for(var d =0;d<ndata.length;d++){
                sumcount+=ndata[d];
            }
            for(var d =0;d<ndata.length;d++){
                ndata[d] = parseFloat((ndata[d] * 100) / sumcount).toFixed(0);
            }
        }
        else
        {
            if(optionatt.report.isShowValue){
                series.label = {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                };
            }
        }

        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            series.barWidth = optionatt.report.BarWidth;
        }
        if(hasitemgroup)
        {
            series.stack = itemgroupvalue[group];//分组显示
        }
        //公式计算
        if(optionatt.report.DataColFormula != undefined && optionatt.report.DataColFormula != "") {
            var nnewdatas = new Array();
            for(var _i=0;_i <ndata.length;_i++) {
                var formula = optionatt.report.DataColFormula;
                while(formula.indexOf("[1]") >= 0) {
                    formula = formula.replace("[1]",ndata[_i]);
                }
                while(formula.indexOf("[2]") >= 0 && ndata1 != undefined) {
                    formula = formula.replace("[2]",ndata1[_i]);
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
        
    }

    if(legendvalue.length>0)
    {
        for (var i = 0; i < legendvalue.length; i++) {  
            initSeriesData(legendvalue[i],i);
        }
    }
    else
    {
        initSeriesData("",0);
    }

    var yaxis = {
            name: optionatt.xShowName,
            type: 'value',
            boundaryGap: [0, 0.01]
        };
    yaxisdata.push(yaxis);

    for(var i=0;i<xaxisdata.length;i++)
    {
        if(typeof xaxisdata[i] == "string")
        {
            xaxisdata[i] = xaxisdata[i].replace("\\n","\n");
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
            subtext: optionatt.SubTitle
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} "
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: optionatt.xShowName,
            boundaryGap: [0, 0.01]
        },
        legend: {
            data: legendvalue
        },
        yAxis: {
            name: optionatt.yShowName,
            type: 'category',
            data: xaxisdata_1
        },
        series: seriesdata
    };
    return option;
}

//多个柱形图 横向 ItemName,XValue,ItemCount
EchartsBarComponent.Bar003 = function (data, optionatt) {
    this._tableData = data;
//    if(this._tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();

    for (var i = 0; i < this._tableData.length; i++) {
        if (!legendvalue.contains(this._tableData[i].ItemName)) {
            legendvalue.push(this._tableData[i].ItemName);
        }
    }
    
    for (var i = 0; i < legendvalue.length; i++) {
        var name = legendvalue[i];
        var ndata=new Array();
        var nmaxvalue=0;
        var nminvalue=0;
        var maxname=optionatt.XValue[0];
        var minname=optionatt.XValue[0];

        for(var j=0;j<optionatt.XValue.length;j++)
        {
            ndata[j]=0;
            for(var m=0;m<this._tableData.length;m++)
            {
                if(this._tableData[m].ItemName == name)
                {
                    if(j==0 && optionatt.XValue.length>1)
                    {
                        var xvalue = optionatt.XValue[1];
                        if(parseInt(this._tableData[m].XValue) < parseInt(xvalue))
                        {
                            ndata[j] = parseInt(ndata[j]) + parseInt( this._tableData[m].ItemCount);
                        }
                    }
                    else if(j==optionatt.XValue.length-1)
                    {
                        var xvalue = optionatt.XValue[j];
                        if(parseInt(this._tableData[m].XValue) >= parseInt(xvalue))
                        {
                            ndata[j] = parseInt(ndata[j]) + parseInt(this._tableData[m].ItemCount);
                        }
                    }
                    else
                    {
                        var maxvalue = optionatt.XValue[j+1];
                        var minvalue = optionatt.XValue[j];
                        if(parseInt(this._tableData[m].XValue) < parseInt(maxvalue) && parseInt(this._tableData[m].XValue) >= parseInt(minvalue))
                        {
                            ndata[j] = parseInt(ndata[j]) + parseInt(this._tableData[m].ItemCount);
                        }
                    }
                }
            }
            if(j==0){
                nminvalue=ndata[j];
            }
            if(ndata[j] > nmaxvalue)
            {
                nmaxvalue=ndata[j];
                maxname=optionatt.XValue[j];
            }
            if(ndata[j] < nminvalue)
            {
                nminvalue=ndata[j];
                minname=optionatt.XValue[j];
            }
        }


        var markdata = new Array();
        markdata.push(new MarkModel('最大值','max'));
        markdata.push(new MarkModel('最小值','min'));
        var nmarkpoint=new MarkData(markdata);
        var markdata = new Array();
        markdata.push(new MarkModel('平均值','average'));
        var nmarkline=new MarkData(markdata);
        var tmodel = new SampleStateSeriesDataModel(name,'bar',ndata,nmarkpoint,nmarkline,'',nmaxvalue,maxname,nminvalue,minname);
        
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            tmodel.barWidth = optionatt.report.BarWidth;
        }
        seriesdata.push(tmodel);
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
        xAxis: [
        {
            type: 'category',
            name: optionatt.xShowName,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
            data: optionatt.XValue
        }
    ],
        yAxis: [
        {
            name: optionatt.yShowName,
            type: 'value'
        }
    ],
        series: seriesdata
    };


    return option;
}


//多个柱形图 横向 ItemName,XValue,ItemCount
EchartsBarComponent.Bar008 = function (data, optionatt) {
    this._tableData = data;
//    if(this._tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();

    for (var i = 0; i < this._tableData.length; i++) {
        if (!legendvalue.contains(this._tableData[i].ItemName)) {
            legendvalue.push(this._tableData[i].ItemName);
        }
    }
    
    for (var i = 0; i < legendvalue.length; i++) {
        var name = legendvalue[i];
        var ndata=new Array();
        var ndatatotal=new Array();
        var nmaxvalue=0;
        var nminvalue=0;
        var maxname=optionatt.XValue[0];
        var minname=optionatt.XValue[0];
        var itemcount=0;

        for(var j=0;j<optionatt.XValue.length;j++)
        {
            ndata[j]=0;
            ndatatotal[j]=0;
            itemcount=0;
            for(var m=0;m<this._tableData.length;m++)
            {
                if(this._tableData[m].ItemName == name)
                {
                    if(j==0 && optionatt.XValue.length>1)
                    {
                        var xvalue = optionatt.XValue[1];
                        if(parseInt(this._tableData[m].XValue) < parseInt(xvalue))
                        {
                            ndatatotal[j] = parseInt(ndatatotal[j]) + parseInt( this._tableData[m].ItemCount);
                            itemcount++;
                        }
                    }
                    else if(j==optionatt.XValue.length-1)
                    {
                        var xvalue = optionatt.XValue[j];
                        if(parseInt(this._tableData[m].XValue) >= parseInt(xvalue))
                        {
                            ndatatotal[j] = parseInt(ndatatotal[j]) + parseInt(this._tableData[m].ItemCount);
                            itemcount++;
                        }
                    }
                    else
                    {
                        var maxvalue = optionatt.XValue[j+1];
                        var minvalue = optionatt.XValue[j];
                        if(parseInt(this._tableData[m].XValue) < parseInt(maxvalue) && parseInt(this._tableData[m].XValue) >= parseInt(minvalue))
                        {
                            ndatatotal[j] = parseInt(ndatatotal[j]) + parseInt(this._tableData[m].ItemCount);
                            itemcount++;
                        }
                    }
                }
            }
            if(itemcount>0){
                ndata[j]=parseInt(ndatatotal[j]/itemcount);
            }
            if(j==0){
                nminvalue=ndata[j];
            }
            if(ndata[j] > nmaxvalue)
            {
                nmaxvalue=ndata[j];
                maxname=optionatt.XValue[j];
            }
            if(ndata[j] < nminvalue)
            {
                nminvalue=ndata[j];
                minname=optionatt.XValue[j];
            }
        }


        var markdata = new Array();
        markdata.push(new MarkModel('最大值','max'));
        markdata.push(new MarkModel('最小值','min'));
        var nmarkpoint=new MarkData(markdata);
        var markdata = new Array();
        markdata.push(new MarkModel('平均值','average'));
        var nmarkline=new MarkData(markdata);
        var tmodel = new SampleStateSeriesDataModel(name,'bar',ndata,nmarkpoint,nmarkline,'',nmaxvalue,maxname,nminvalue,minname);
        
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            tmodel.barWidth = optionatt.report.BarWidth;
        }
        seriesdata.push(tmodel);
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
        xAxis: [
        {
            type: 'category',
            name: optionatt.xShowName,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
            data: optionatt.XValue
        }
    ],
        yAxis: [
        {
            name: optionatt.yShowName,
            type: 'value'
        }
    ],
        series: seriesdata
    };


    return option;
}

//多个柱形图 横向 两个Y轴 ItemName,XValue,ItemCount,ItemValue
EchartsBarComponent.Bar004 = function (data, optionatt) {
    this._tableData = data;
//    if(this._tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();
    var seriesyrigthdata = new Array();

    for (var i = 0; i < this._tableData.length; i++) {
        if (!legendvalue.contains(this._tableData[i].ItemName)) {
            legendvalue.push(this._tableData[i].ItemName);
        }
    }
    
    for (var i = 0; i < legendvalue.length; i++) {
        var name = legendvalue[i];
        var ndata = new Array();
        var nydata=new Array();
        var nymarkdata=new Array();
        var nmaxvalue = 0;
        var nminvalue = 0;
        var maxname = optionatt.XValue[0];
        var minname = optionatt.XValue[0];

        for (var j = 0; j < optionatt.XValue.length; j++) {
            ndata[j] = 0;
            nydata[j]=0;
            for (var m = 0; m < this._tableData.length; m++) {
                if (this._tableData[m].ItemName == name) {
//                    if (j == 0 && optionatt.XValue.length > 1) {
//                        var xvalue = optionatt.XValue[1];
//                        if (parseInt(this._tableData[m].XValue) < parseInt(xvalue)) {
//                            ndata[j] = ndata[j] + this._tableData[m].ItemCount;
//                            nydata[j] = nydata[j] + this._tableData[m].ItemValue;
//                        }
//                    }
//                    else if (j == optionatt.XValue.length - 1) {
//                        var xvalue = optionatt.XValue[j];
//                        if (parseInt(this._tableData[m].XValue) >= parseInt(xvalue)) {
//                            ndata[j] = ndata[j] + this._tableData[m].ItemCount;
//                            nydata[j] = nydata[j] + this._tableData[m].ItemValue;
//                        }
//                    }
//                    else {
                        var maxvalue = optionatt.XValue[j + 1];
                        var minvalue = optionatt.XValue[j];
                        if (parseInt(this._tableData[m].XValue) < parseInt(maxvalue) && parseInt(this._tableData[m].XValue) >= parseInt(minvalue)) {
                            ndata[j] = ndata[j] + this._tableData[m].ItemCount;
                            nydata[j] = nydata[j] + this._tableData[m].ItemValue;
                        }
//                    }
                }
            }
            if(nydata[j]>0){
                nymarkdata[j] = parseInt( nydata[j]/ndata[j]);
            }
            else{
                nymarkdata[j] = 0;
            }
            if (j == 0) {
                nminvalue = nymarkdata[j];
                nmaxvalue = nymarkdata[j];
            }
            if (nymarkdata[j] > nmaxvalue) {
                nmaxvalue = nymarkdata[j];
                maxname = optionatt.XValue[j];
            }
            if (nymarkdata[j] < nminvalue) {
                nminvalue = nymarkdata[j];
                minname = optionatt.XValue[j];
            }
        }


        var markdata = new Array();
        markdata.push(new MarkModel('最大值', 'max'));
        markdata.push(new MarkModel('最小值', 'min'));
        var nmarkpoint = new MarkData(markdata);
        var markdata = new Array();
        markdata.push(new MarkModel('平均值', 'average'));
        var nmarkline = new MarkData(markdata);
        var tmodel = new SampleStateSeriesDataModel(name, 'bar', ndata, nmarkpoint, nmarkline, '', nmaxvalue, maxname, nminvalue, minname);
        
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            tmodel.barWidth = optionatt.report.BarWidth;
        }
        seriesdata.push(tmodel);
        
        var tyrightmodel = new TatSampleInfoModel(name,'line',nymarkdata,1, nmaxvalue, maxname, nminvalue, minname);
        seriesyrigthdata.push(tyrightmodel);
    }

    
    
    for (var i = 0; i < seriesyrigthdata.length; i++) {
        seriesdata.push(seriesyrigthdata[i]);
    }
    
    var xaxisdata_1 = new Array();//X轴集合显示
    if(optionatt.XValueCondition == 1){
        for(var i=0;i<optionatt.XValue.length;i++){  
            xaxisdata_1.push(optionatt.XValue[i]);
        }
    }      
    else{
        for(var i=0;i<optionatt.XValue.length - 1;i++){  
            xaxisdata_1.push(optionatt.XValue[i]+"-"+optionatt.XValue[i+1]);
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
            subtext: optionatt.SubTitle,
            x: 'left'
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
        xAxis: [
        {
            type: 'category',
            name: optionatt.xShowName,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
            data: xaxisdata_1
        }
    ],
        yAxis: [
        {
            type: 'value',
            name: optionatt.yShowName,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: optionatt.yShowName1,
            axisLabel: {
                formatter: '{value} min'
            }
        }
    ],
        series: seriesdata
    };


    return option;
}

//单个条形图 纵向 XValue,ItemValue
EchartsBarComponent.Bar005 = function (data, optionatt) {
    this._tableData = data;
//    if(this._tableData.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();

    for (var i = 0; i < this._tableData.length; i++) {
        if (!legendvalue.contains(this._tableData[i].XValue)) {
            legendvalue.push(this._tableData[i].XValue);
        }
    }

    for (var i = 0; i < legendvalue.length; i++) {
        var itemcount = 0;
        for (var j = 0; j < this._tableData.length; j++) {
            if (this._tableData[j].XValue == legendvalue[i]) {
                itemcount += parseInt(this._tableData[j].ItemValue);
            }
        }
        var tmodel = new SeriesDataModel(legendvalue[i], itemcount);
        seriesdata.push(tmodel);
    }
    
    seriesdata.sort(function(a,b){return a.value-b.value});
    var newlegendvalue = new Array();
    for(var i=0;i<seriesdata.length;i++){
        newlegendvalue.push(seriesdata[i].name);
    }

    var barWidth=0;
    if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
        barWidth = optionatt.report.BarWidth;
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
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
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
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: optionatt.xShowName,
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            name: optionatt.yShowName,
            data: newlegendvalue
        },
        series: [
        {
            type: 'bar',
            barWidth:barWidth,
            data: seriesdata
        }
    ]
    };

    return option;
}



//单个柱形图集 横向 按ItemName分，每个图X轴显示XValue，显示值用ItemValue ItemName,XValue,ItemCount
EchartsBarComponent.Bar006 = function (data, optionatt) {
//    if(data.length <= 0)
//    {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();
    var pieseriesdata = new Array();

    for (var i = 0; i < data.length; i++) {
        if (data[i].ItemName.length > 0 && !legendvalue.contains(data[i].ItemName)) {
            legendvalue.push(data[i].ItemName);
        }
    }
    //按测试项目从多到少排序
    data.sort(function (a, b) {
        return b.ItemCount - a.ItemCount
    });
    var seriesdata = new Array();
    for (var i = 0; i < legendvalue.length; i++) {
        var itemdata = new Array();
        var itemname = new Array();
        var itemdatatotal = 0;
        for (var j = 0; j < data.length; j++) {
            if (data[j].ItemName == legendvalue[i]) {
                itemdata.push(data[j].ItemCount);
                itemname.push(data[j].XValue);
                itemdatatotal += data[j].ItemCount;
            }
        }
        seriesdata[i] = new Array();
        seriesdata[i][3] = legendvalue[i];
        seriesdata[i][1] = itemname;
        seriesdata[i][2] = itemdata;
        seriesdata[i][0] = itemdatatotal;
    }
    var barWidth=0;
    if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
        barWidth = optionatt.report.BarWidth;
    }
    
    var yMaxValue = null;
    if (optionatt.report.YMaxValue != undefined && optionatt.report.YMaxValue > 0) {
        yMaxValue = optionatt.report.YMaxValue;
    }
    //按仪器从多到少排序
    seriesdata.sort(function (a, b) {
        return b[0] - a[0]
    });
    var options = new Array();
    for (var i = 0; i < seriesdata.length; i++) {
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
                text: seriesdata[i][3],
                textStyle: {
                    color: optionatt.textStyle
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
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
            xAxis: {
                name: optionatt.xShowName,
                data: seriesdata[i][1],
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                name: optionatt.yShowName,
                type: 'value',
                max: yMaxValue,
                boundaryGap: [0, 0.01]
            },
            series: [{
                type: 'bar',
                barWidth:barWidth,
                data: seriesdata[i][2]
            }]
        };

        options.push(option);
    }
    if(options.length > 0){
        return options;
    }
    else{
        return null;
    }
}


//多个柱形图+左侧一个饼图 横向  ItemName,XValue,ItemCount,ItemValue
EchartsBarComponent.Bar007 = function (data, optionatt) {
//    if(data.length <= 0)
//    {
//        return null;
//    }
    var dataname=new Array();
    var legendvalue = new Array();
    var seriesdata = new Array();
    var pieseriesdata = new Array();
    var testitemlegendvalue = new Array();

    for (var i = 0; i < data.length; i++) {
        if (data[i].ItemName.length > 0 && !legendvalue.contains(data[i].ItemName)) {
            legendvalue.push(data[i].ItemName);
        }
        if (data[i].XValue.length > 0 && !testitemlegendvalue.contains(data[i].XValue)) {
            testitemlegendvalue.push(data[i].XValue);
        }
    }
    for (var i = 0; i < testitemlegendvalue.length; i++) {
        dataname.push(testitemlegendvalue[i]);
    }
    for (var i = 0; i < legendvalue.length; i++) {
        dataname.push(legendvalue[i]);
    }

    for (var i = 0; i < legendvalue.length; i++) {
        var samplecount = 0;
        for (var j = 0; j < data.length; j++) {
            if (data[j].ItemName == legendvalue[i]) {
                samplecount += data[j].ItemValue;
            }
        }
        var tmodel = new SeriesDataModel(legendvalue[i], samplecount);
        pieseriesdata.push(tmodel);
    }
    pieseriesdata.sort(function(a,b){return a.value-b.value});
    var xAxis=new Array();
    for(var i=0;i<pieseriesdata.length;i++)
    {
        xAxis.push(pieseriesdata[i].name);
    }
    for(var ii =0;ii<testitemlegendvalue.length;ii++){    
        var itemdata=new Array();
        var totaldatacount=0;
        for (var i = 0; i < xAxis.length; i++) {
            itemdata[i]=0;        
            for (var j = 0; j < data.length; j++) {
                if (data[j].XValue == testitemlegendvalue[ii] && data[j].ItemName == xAxis[i] ) {
                    itemdata[i] = data[j].ItemValue;
                    totaldatacount+=data[j].ItemValue;
                }
            }
        }
        var objRiskRerunSeriesDataModel=new RiskRerunSeriesDataModel(testitemlegendvalue[ii],'bar',itemdata,{trigger: 'item'},'item',totaldatacount);
        
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            objRiskRerunSeriesDataModel.barWidth = optionatt.report.BarWidth;
        }
        seriesdata.push(objRiskRerunSeriesDataModel);
    }
    seriesdata.sort(function(a,b){return b.totaldatacount-a.totaldatacount});

    var pieobj ={
            name:'',
            type:'pie',
            tooltip : {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            center: [160,60],
            radius : [0, 40],
            itemStyle :　{
                normal : {
                    labelLine : {
                        length : 20
                    }
                }
            },
            data:pieseriesdata
        };
        seriesdata.push(pieobj);
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
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
    tooltip : {
        trigger: 'axis'
    },
    toolbox: {
        orient: optionatt.ToolBoxOrient,
        show : true,
        y: 'bottom',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    legend: {
        data:dataname,
        orient:optionatt.LegendOrient,
        x:'left'
    },
    xAxis : [
        {
            type : 'category',
            splitLine : {show : false},
            data : xAxis
        }
    ],
    yAxis : [
        {
            type : 'value',
            position: 'right'
        }
    ],
    series :seriesdata
};

    return option;
}



//多个柱形图 横向 ItemName,XValue,ItemCount
EchartsBarComponent.Bar009 = function (data, optionatt) {
  this._tableData = data;
//    if(this._tableData.length <= 0)
//    {
//        return null;
//    }
  var legendvalue = new Array();
  var xdata = new Array();
  var seriesdata = new Array();

  for (var i = 0; i < this._tableData.length; i++) {
      if (!legendvalue.contains(this._tableData[i].ItemName)) {
          legendvalue.push(this._tableData[i].ItemName);
      }
      if (!xdata.contains(this._tableData[i].XValue)) {
          xdata.push(this._tableData[i].XValue);
      }
  }
  
  for (var i = 0; i < legendvalue.length; i++) {
      var ndatas=new Array();

      for(var j=0;j<xdata.length;j++)
      {
          for (var m = 0; m < this._tableData.length; m++) {
              if (this._tableData[m].ItemName == legendvalue[i] && this._tableData[m].XValue == xdata[j]) {
            	  ndatas.push(this._tableData[m].ItemCount);
              }
          }
      }
      
      var tmodel = {};
      tmodel.name = legendvalue[i];
      tmodel.type = 'bar';
      tmodel.data = ndatas;
        if(optionatt.report.BarWidth != undefined && optionatt.report.BarWidth > 0){
            tmodel.barWidth = optionatt.report.BarWidth;
        }
      seriesdata.push(tmodel);
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
          subtext: optionatt.SubTitle,
          x: 'left'
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
      xAxis: [
      {
          data: xdata
      }
  ],
      yAxis: [
      {
          name: optionatt.yShowName,
          type: 'value'
      }
  ],
      series: seriesdata
  };


  return option;
}
