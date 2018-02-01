
//    否则在下次程序更新时,本config.js可能让开发人员已经更新.
window._webconfig = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LIS4基本配置控制
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//应用服务器地址
window._webconfig._sysLocation = window.location.protocol + "//" + window.location.host;
var _sysHost = window._webconfig._sysLocation + "/DataCakeApp/";

//ES 应用服务器地址
var _sysHost1 = window.location.protocol + "//" + window.location.hostname + ":9200/";

window._webconfig._addressServerName = _sysHost; 
//ES数据库 应用服务器地址
window._webconfig._addressESServerName = _sysHost1; 

//开始日期
window._webconfig.nStartDate = "2017-12-15";
//结束日期
window._webconfig.nEndDate = "2017-12-15";

//开始日期
window._webconfig.nWeekStartDate = "2017-12-11";
//结束日期
window._webconfig.nWeekEndDate = "2017-12-17";

//开始日期
window._webconfig.nMonthStartDate = "2017-12-01";
//结束日期
window._webconfig.nMonthEndDate = "2017-12-30";

//开始日期
window._webconfig.nYearStartDate = "2017-01-01";
//结束日期
window._webconfig.nYearEndDate = "2017-12-31";

//图表数据来源  ES,MYSQL,MSSQL
window._webconfig._sysDataSource = "MYSQL";
//返回数据类型 需要 JSTABLE,JSON
window._webconfig._sysDataType = "JSTABLE";

//图表背景色
window._webconfig.backgroundColor = "#FFFFFF"; //#F2F2E6
//图表色系

//window._webconfig.color = [
//            "#0026ff", 
//            "#eb0b1b",
//            "#088a03",
//            "#ffd000",
//            "#000000",
//            "#8e0091",
//            "#00ffe1",
//            "#ab5212",
//            "#6e5d5d",
//            "#820909"];
window._webconfig.color = ["#0091a2",
            "#b63589",
            "#ea6602",
            "#f29048",
            "#f2cb02",
            "#f1b98d",
            "#8676b3",
            "#cda819"];
//window._webconfig.color = [
//        '#44B7D3','#E42B6D','#F4E24E','#FE9616','#8AED35',
//        '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
//        '#E95569','#ff6347','#7b68ee','#00fa9a','#ffd700',
//        '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'
//    ];
//图表标题颜色
window._webconfig.textStyle = "#080707";
//图表子标题颜色
window._webconfig.subtextStyle = "#63615b";

//图表背景色
window._webconfig.mobilebackgroundColor = "#FFF";
//图表色系
window._webconfig.mobilecolor = [
        '#1790cf', '#1bb2d8', '#99d2dd', '#88b0bb',
        '#1c7099', '#038cc4', '#75abd0', '#afd6dd'
    ];
//图表标题颜色
window._webconfig.mobiletextStyle = "#8A826D";
//图表子标题颜色
window._webconfig.mobilesubtextStyle = "#E877A3";

//ES中聚合函数返回的数据记录条数
window._webconfig.ESReturnCount = 10000;

window._webconfig.systemuserid = 1;
window._webconfig.systemusercode = "system";

//未注册显示的图表数量
window._webconfig.usecount = 5;


//过滤器配置
window._webconfig.table_filter_collection = [
//    //表名                  过滤器名                数据类型                查询字段                             编码                         过滤器查询条件字段        过滤器查询条件字段类型
 //  ["BSC_Hospital",        "医院",           "Enum",             ["HospitalCode", "HospitalName"],         "HospitalSearch",             "HospitalCode",           "string"],
//    ["bsc_instrument",      "仪器",           "Enum",             ["InstrumentID", "InstrumentName"],     "InstrumentSearch",         "InstrumentID",          "number"],
//    ["bsc_testitem",        "测试项目",           "Enum",         ["TestItemID", "TestItemName"],         "TestItemSearch",               "TestItemID",          "number"],
//    ["bsc_patienttype",     "病人类型",           "Enum",         ["PatientTypeID", "PatientTypeName"],   "PatientTypeSearch",            "PatientTypeID",          "number"],
//    ["bsc_priorityflag",    "样本优先级",           "Enum",        ["PriorityID", "PriorityName"],         "PrioritySearch",               "PriorityID",          "number"],
//    ["BSC_SexType",         "性别",                "Enum",          ["SexID", "SexName"],                   "SexSearch",                    "SexID",          "number"],
//    ["bsc_speciality_classify", "专业类别",           "Enum",     ["SpecialityClassifyID","SpecialityClassifyName"], "SpecialitySearch", "SpecialityClassifyID",          "number"],
//    ["BSC_Ward",            "申请科室",           "Enum",          ["WardID", "WardName"],                "WardSearch",                       "WardID",          "number"],
//    ["BSC_SampleType",      "样本类型",            "Enum",        ["SampleTypeID", "SampleTypeName"],         "SampleTypeSearch",             "SampleTypeID" ,         "number"],
//    ["BSC_SampleState",     "样本状态",             "List",     [[400, "已登记"], [420, "IOM"], [401, "已编程"], [410, "测试中"], [500, "已完成"], [800, "已上传"]],   "SampleStateSearch",    "SampleState",  "number"],
//    ["BSC_ReagentType", "试剂类型", "List", [["primary", "Primary"], ["reagent", "Reagent"], ["ancillary", "Ancillary"], ["consumable", "Consumable"]], "ReagentTypeSearch", "reagent_type", "string"]

];

//图表集合
window._webconfig.echartsType = [
        ["canvas001", "画单个圆ItemCount","6.png"],
        ["canvas002", "画单个圆ItemValue", "6.png"],
        ["canvas003", "画两个圆", "1.png"],
        ["pie003", "单个数量图", "pie003.png"],
        ["pie001", "标准饼图", "2.png"],
        ["pie002", "环形图", "3.png"],
        ["bar001", "柱形图", "8.png"],
        ["bar002", "条形图", "7.png"],
        ["line001", "线形图", "line.png"],
        ["bar005", "标准条形图ItemValue", "7.png"],
        ["bar003", "多系列柱形图X轴为时间系(总和)", "4.png"],
        ["bar008", "多系列柱形图X轴为时间系(平均值)", "4.png"],
        ["bar004", "多系列柱形图X轴为时间系双Y轴", "11.png"],
        ["bar006", "标准柱形图集合", "10.png"],
        ["bar007", "多系列柱形图加标准饼图", "9.png"],
        ["bar009", "多系列柱形图", "8.png"],
        ["box001", "TAT箱线图", "tat.png"],
        ["box002", "TAT箱线图", "boxplot1.png"],
        ["map001", "标准地图", "map.png"],
        ["map002", "地图加左侧柱形图", "map1.png"],
        ["map003", "地图加下方柱形图", "map3.png"],
        ["mix001", "年报-时间轴柱形图加饼图", "mix1.png"],
        ["mix002", "年报-时间轴柱形图", "mix2.png"],
        ["mix003", "年报-时间轴饼图", "mix3.png"],
        ["other001", "其他", "5.png"],
        ["other003", "单行表格", "sigletable.png"],
        ["other004", "TAT时间轴", "tattimeline.png"]
    ];


//维护表集合
window._webconfig.tablecollection = [
    "pms_role_databrief",
    "pms_role_databrief_operateperm",
    "pms_roleuser_databriefperm",
    "pms_databrief_define",
    "pms_databrief_datasource",
    "pms_databrief_datasource_roleperm",
    "pms_databrief_fun",
    "pms_databrief_condition",
    "pms_databrief_comment",
    "pms_databrief_datasource_filter",
    "sys_dicttype",
    "sys_dict",
    "pms_databrief_userfavorite"
];
//维护表字段集合
window._webconfig.tablecolumncollection = [
    ["RoleID", "RoleName", "RoleDataSource", "DisableFlag", "ObsoleteFlag"],
    ["RoleID", "OperateCode", "OperateParam", "OperateType", "OperateValue"],
    ["RoleID", "UserID"],
    ["DefineID", "DefineName", "DataSource", "DataItem", "DataItemDefine", "DataItemType", "DataRow", "DataRowDefine", "DataRowType", "DataRowFunType", "DataItemOrder", "DataRowOrder", "DataCol", "DataCol2", "ReportType", "ReportParent1", "ReportParent2", "UserID", "DisableFlag", "ObsoleteFlag"],
    ["SourceID", "SourceCode", "SourceName", "SourceUrl", "SelectOneSql", "SourceType", "ReturnFormat", "DisableFlag", "ObsoleteFlag"],
    ["SourceCode", "RoleID"],
    ["FunID", "FunName", "FunType", "FunField", "DataSource", "UserID", "DisableFlag", "ObsoleteFlag"],
    ["ConditionID", "DefineID", "ConditionField", "ConditionType", "ConditionValue", "ConditionJoin", "FrontTag", "EndTag", "OrderIndex", "DisableFlag", "ObsoleteFlag"],
    ["CommentID", "FieldName", "FieldDesc", "FieldSource", "FieldType", "FieldMeaning", "DisableFlag", "ObsoleteFlag"],
    ["SourceCode", "FilterCode"],
    ["DictTypeID", "DictTypeCode", "DictTypeName", "DictFieldName", "DictFieldType", "ObsoleteFlag", "DisableFlag", "MemorySymbol", "Comment"],
    ["DictId", "DictCode", "DictName", "DictEnglishName", "DictTypeCode", "DictIndex", "ObsoleteFlag", "DisableFlag", "MemorySymbol", "Comment"],
    ["UserID", "ReportCode", "OrderIndex"]
];
//维护表字段类型定义集合
window._webconfig.tablecolumntypecollection = [
    ["I", "S", "S", "I", "I"],
    ["I", "S", "S", "S", "S"],
    ["I", "I"],
    ["I", "S", "S", "S", "S", "S", "S", "S", "S", "I", "I", "I", "S", "S", "S", "S", "S", "I", "I", "I"],
    ["I", "S", "S", "S", "S", "S", "S", "I", "I"],
    ["S", "I"],
    ["I", "S", "I", "S", "S", "I", "I", "I"],
    ["I", "I", "S", "S", "S", "S", "S", "S", "I", "I", "I"],
    ["I", "S", "S", "S", "S", "S", "I", "I"],
    ["S", "S"],
    ["I", "S", "S", "S", "S", "I", "I", "S", "S"],
    ["I", "S", "S", "S", "S", "I", "I", "I", "S", "S"],
    ["I", "S", "I"],
];

//模组定义集合
window._webconfig.lascollection = [
    ["IOM", "进出样"],
    ["CM_IN", "进离心"],
    ["CM_OUT", "出离心"],
    ["DCM", "去盖"],
    ["DSM", "去膜"],
    ["ALQ", "分杯"],
    ["INS", "仪器"],
    ["SM", "封膜"],
    ["RCM", "加盖"],
    ["RSM", "进冰箱"]
];