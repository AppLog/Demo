function SeriesDataModel(name, value) {
    this.name = name;
    this.value = value;
}
function SeriesDataTypeModel(name, type, value) {
    this.name = name;
    this.value = value;
    this.type = type;
}
function MarkData(data) {
    this.data = data;
}
function MarkModel(name, type) {
    this.name = name;
    this.type = type;
}
function InstrumentSeriesDataModelStyle(name, value, itemstyle) {
    this.name = name;
    this.value = value;
    this.itemStyle = itemstyle;
}
function InstrumentSeriesDataModel(type, center, radius, x, y, itemStyle, data) {
    this.type = type;
    this.center = center;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.itemStyle = itemStyle;
    this.data = data;
}
function SampleStateSeriesDataModel(name, type, data, markPoint, markLine, stack, max, maxname, min, minname) {
    this.type = type;
    this.name = name;
    this.data = data;
    this.markPoint = markPoint;
    this.markLine = markLine;
    this.stack = stack;
    this.max = max;
    this.maxname = maxname;
    this.minname = minname;
    this.min = min;
}
function RiskRerunSeriesDataModel(name, type, data, tooltip, stack,totaldatacount) {
    this.type = type;
    this.name = name;
    this.data = data;
    this.tooltip = tooltip;
    this.stack = stack;
    this.totaldatacount = totaldatacount;
}
function TatSampleInfoModel(name, type, data, yAxisIndex, max, maxname, min, minname) {
    this.type = type;
    this.name = name;
    this.data = data;
    this.yAxisIndex = yAxisIndex;
    this.max = max;
    this.maxname = maxname;
    this.minname = minname;
    this.min = min;
}


function OptionAtt() {
    /// <summary>
    /// 图表DIV ID
    /// </summary>
    this.DivId = "div1";
    /// <summary>
    /// 图表类型
    /// </summary>
    this.OptionType="pie001";
    /// <summary>
    /// 主标题
    /// </summary>
    this.Title="";
    /// <summary>
    /// 副标题
    /// </summary>
    this.SubTitle = "";
    /// <summary>
    /// 标题对齐方式 center,left,right
    /// </summary>
    this.HorizontalType = "center";
    /// <summary>
    /// 项目布局方向 horizontal,vertical,radial
    /// </summary>
    this.LegendOrient = "horizontal";
    /// <summary>
    /// 项目对齐方式 center,left,right
    /// </summary>
    this.LegendHorizontalType = "left";
    /// <summary>
    /// 项目对齐方式 horizontal,vertical,radial
    /// </summary>
    this.ToolBoxOrient = "horizontal";
    //Y轴显示名称
    this.yShowName = "";
    //双Y轴 右侧 显示名称
    this.yShowName1 = "";
    //Y轴显示名称
    this.xShowName = "";
    /// <summary>
    /// 图表横向X轴 或者纵向Y轴内容
    /// </summary>
    this.XValue = "";
    /// <summary>
    /// 值比较条件 1表示= 2表示范围
    /// </summary>
    this.XValueCondition = "1";
    //图表背景色
    this.backgroundColor = "";
    //图表色系
    this.color = "";
    //标题颜色
    this.textStyle = "";
    //副标题颜色
    this.subtextStyle = "";

    //结果集筛选项
    this.dataFilterName = "";
    //均线值
    this.avgvalue = 0;

    this.report = {};
}