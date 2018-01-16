
var ESFun = {};

//ES自定义报表数据处理
ESFun.getMyDefineData = function (reportarr) {
    var objRequest = new Array();
    objRequest.ProcedureName = "[proc_simplereport_userdefine_config]";
    objRequest.ParameterNames = ["defineId"];
    objRequest.ParameterDataTypes = ["int"];
    objRequest.ParameterValues = [reportarr.CurDefineID];
    var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

    var m_nDefineData = getJsonStoreFromTable(objReturn.Table0)[0]; //自定义数据列表
    var m_nFunData = getJsonStoreFromTable(objReturn.Table1); //度量函数列表
    var m_nConditionData = getJsonStoreFromTable(objReturn.Table2); //度量函数列表
    reportarr.ReportParent1 = m_nDefineData.ReportParent1;
    reportarr.ReportParent2 = m_nDefineData.ReportParent2;
    if (reportarr.isTAT || reportarr.isSampleCount) {
        var isInstrumentOrSpecialityclassify = 0;
        if (m_nDefineData.DataItem.toLowerCase() == "instrumentname" || m_nDefineData.DataItem.toLowerCase() == "specialityclassifyname"
                                || m_nDefineData.DataRow.toLowerCase() == "instrumentname" || m_nDefineData.DataRow.toLowerCase() == "specialityclassifyname") {
            isInstrumentOrSpecialityclassify = 1;
        }
        if (reportarr.TATValues != undefined && reportarr.TATValues.length > 0) {
            //直接使用ES函数来统计 TAT
            var _nResultData = new Array();

            var groupfield = "";
            var groupfieldtype = "";
            if (m_nDefineData.DataRow != undefined && m_nDefineData.DataRow != "") {
                groupfield = m_nDefineData.DataRow;
                groupfieldtype = m_nDefineData.DataRowType;
            }
            if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
                groupfield = m_nDefineData.DataItem;
                groupfieldtype = m_nDefineData.DataItemType;
            }
            if (groupfield != "") {
                //查询单个字段的数据字典
                var _tableData = this.getESDataByFieldDistinct(m_nDefineData, m_nConditionData, m_nFunData, reportarr, groupfield, groupfieldtype);
                var _ndataDict = new Array();
                for (var i = 0; i < _tableData.length; i++) {
                    var _ndictname = _tableData[i].ItemName;
                    //样本中的仪器或者专业组处理 用,分隔开
                    if (isInstrumentOrSpecialityclassify) {
                        var instrumentnames = _ndictname.split(",");
                        for (var it = 0; it < instrumentnames.length; it++) {
                            if (instrumentnames[it].toLowerCase() == "centralink_receive" || instrumentnames[it].toLowerCase() == "centralink_send") {
                                continue;
                            }
                            if (instrumentnames[it] != "" && !_ndataDict.contains(instrumentnames[it])) {
                                _ndataDict.push(instrumentnames[it]);
                            }
                        }
                    }
                    else {
                        if (_ndictname != "" && !_ndataDict.contains(_ndictname)) {
                            _ndataDict.push(_ndictname);
                        }
                    }
                }
                for (var i = 0; i < _ndataDict.length; i++) {
                    //按字段字典来循环
                    var n_newDefineData = {};

                    n_newDefineData.DataSource = m_nDefineData.DataSource;

                    for (var j = 0; j < reportarr.TATSet.length; j++) {
                        //按配置的TAT字段循环
                        var _nTatSet = reportarr.TATSet[j];
                        for (var k = 0; k < reportarr.TATValues.length; k++) {
                            n_newDefineData.DataRowFunType = reportarr.TATValues[k]; //取设置的是什么值 10百分位 25百分位等
                            n_newDefineData.DataRow = _nTatSet.TATTimer; //取TAT的字段
                            var _newtableData = undefined;
                            var nDataSelectConditions = [];
                            if (reportarr.tatMinValue != undefined && reportarr.tatMinValue > 0) {
                                var nDataSelectCondition = {};
                                nDataSelectCondition.DataSelectName = n_newDefineData.DataRow;
                                nDataSelectCondition.DataSelectOption = ">";
                                nDataSelectCondition.DataSelectValue = reportarr.tatMinValue;
                                nDataSelectConditions.push(nDataSelectCondition);
                            }
                            if (reportarr.tatMaxValue != undefined && reportarr.tatMaxValue > 0) {
                                var nDataSelectCondition = {};
                                nDataSelectCondition.DataSelectName = n_newDefineData.DataRow;
                                nDataSelectCondition.DataSelectOption = "<";
                                nDataSelectCondition.DataSelectValue = reportarr.tatMaxValue;
                                nDataSelectConditions.push(nDataSelectCondition);
                            }
                            if (isInstrumentOrSpecialityclassify) {
                                var nDataSelectCondition = {};
                                nDataSelectCondition.DataSelectName = groupfield;
                                nDataSelectCondition.DataSelectOption = "like";
                                nDataSelectCondition.DataSelectValue = _ndataDict[i];
                                nDataSelectConditions.push(nDataSelectCondition);
                                _newtableData = this.getESData(n_newDefineData, m_nConditionData, m_nFunData, reportarr, "", 0, "", 1, nDataSelectConditions);
                            }
                            else {
                                var nDataSelectCondition = {};
                                nDataSelectCondition.DataSelectName = groupfield;
                                nDataSelectCondition.DataSelectOption = "=";
                                nDataSelectCondition.DataSelectValue = _ndataDict[i];
                                nDataSelectConditions.push(nDataSelectCondition);
                                _newtableData = this.getESData(n_newDefineData, m_nConditionData, m_nFunData, reportarr, "", 0, "", 1, nDataSelectConditions);

                            }
                            var _item = {};
                            _item.ItemName = "";
                            _item.XValue = "";
                            _item.ItemCount = "";
                            for (var d = 0; d < _newtableData.length; d++) {
                                if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
                                    _item.ItemName = _ndataDict[i]; // + reportarr.TATValues[k]
                                    if (_nTatSet.TATHour != undefined && _nTatSet.TATHour != "") {
                                        _item.XValue = DateComponent.PrefixInteger(_newtableData[d].ItemName, 2);
                                    }
                                    else {
                                        _item.XValue = _nTatSet.TATName;
                                    }
                                }
                                else {
                                    _item.ItemName = _nTatSet.TATName; // + reportarr.TATValues[k]
                                    _item.XValue = _ndataDict[i];
                                }
                                _item.ItemCount = _newtableData[d].ItemCount;
                                _nResultData.push(_item);
                            }
                        }
                    }
                }
            }
            else {
            }
            return _nResultData;
        }
        else {
            //样本模组统计 分模组 样本数量统计 TAT查询 使用明细数据得出TAT
            var _nResultData = new Array();
            for (var i = 0; i < reportarr.TATSet.length; i++) {
                var _nTatSet = reportarr.TATSet[i];
                var nDataFields = new Array();
                var nTATColumn = "";
                nDataFields.push(_nTatSet.TATHour);
                if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
                    nDataFields.push(m_nDefineData.DataItem);
                }
                if (reportarr.isTAT) {
                    nTATColumn = _nTatSet.TATTimer;
                    nDataFields.push(_nTatSet.TATTimer);
                }

                var _tableData = this.getESDataByField(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn);

                for (var j = 0; j < _tableData.length; j++) {
                    var _item = {};
                    //样本按仪器分组 样本表的仪器与专业组在同一个字段里
                    if (isInstrumentOrSpecialityclassify) {
                        var _ndata = _tableData[j][m_nDefineData.DataItem];
                        var instrumentnames = _ndata.split(",");
                        for (var t = 0; t < instrumentnames.length; t++) {
                            if (instrumentnames[t] != "") {
                                if (m_nDefineData.DataItem.toLowerCase() == "instrumentname" || m_nDefineData.DataItem.toLowerCase() == "specialityclassifyname") {
                                    if (instrumentnames[t].toLowerCase() == "centralink_receive" || instrumentnames[t].toLowerCase() == "centralink_send") {
                                        continue;
                                    }
                                    _item.ItemName = instrumentnames[t];
                                    _item.XValue = DateComponent.PrefixInteger(_tableData[j][_nTatSet.TATHour], 2);
                                }
                                else {
                                    _item.ItemName = _nTatSet.TATName;
                                    _item.XValue = instrumentnames[t];
                                }
                                if (reportarr.isSampleCount) {
                                    _item.ItemCount = 1;
                                    if (reportarr.isTAT) {
                                        _item.ItemValue = _tableData[j][_nTatSet.TATTimer];
                                    }
                                }
                                else {
                                    _item.ItemCount = _tableData[j][_nTatSet.TATTimer];
                                }
                                _nResultData.push(_item);
                            }
                        }
                    }
                    else {
                        //其他正常计算
                        if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
                            _item.ItemName = _tableData[j][m_nDefineData.DataItem];
                        }
                        else {
                            _item.ItemName = _nTatSet.TATName;
                        }
                        _item.XValue = DateComponent.PrefixInteger(_tableData[j][_nTatSet.TATHour], 2);
                        if (reportarr.isSampleCount) {
                            _item.ItemCount = 1;
                            if (reportarr.isTAT) {
                                _item.ItemValue = _tableData[j][_nTatSet.TATTimer];
                            }
                        }
                        else {
                            _item.ItemCount = _tableData[j][_nTatSet.TATTimer];
                        }
                        _nResultData.push(_item);
                    }
                }
            }
            return _nResultData;
        }
    }
    else if (reportarr.isLasSet) {
        //TAT查询
        var _nResultData = new Array();
        if (m_nFunData.length > 0) {
            var nDataFields = new Array();
            nTATColumn = m_nFunData[0].FunField;
            nDataFields.push(m_nDefineData.DataItem); //添加行 field
            nDataFields.push(m_nDefineData.DataRow); //添加列 field
            nDataFields.push(m_nFunData[0].FunField); //添加第一个函数 field
            var _tableData = this.getESDataByField(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn);

            for (var j = 0; j < _tableData.length; j++) {
                var _item = {};
                _item.ItemName = _tableData[j][m_nDefineData.DataItem];
                _item.XValue = DateComponent.PrefixInteger(_tableData[j][m_nDefineData.DataRow], 2);
                _item.ItemCount = _tableData[j][m_nFunData[0].FunField];
                _nResultData.push(_item);
            }
        }
        return _nResultData;
    }
    else {
        //非TAT 普通统计
        var nDataRow = ""; //数据列
        var nDataRowOrder = ""; //数据列排序
        var nDataRowType = ""; //数据列类型
        var nDataRowFunType = m_nDefineData.DataRowFunType; //数据列函数  1最大值、2最小值、3平均值等信息
        var nOriDataRow = nDataRow;
        //列 定义了函数计算 需特殊处理
        if (nDataRowFunType > 0) {
            var nDataSelectConditions = new Array();
            var _tableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, nDataRowFunType, nDataSelectConditions);
            if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
                //按项目分组计算列
                nDataRow = m_nDefineData.DataRow;
                nDataRowOrder = 0;
                nDataRowType = m_nDefineData.DataRowType;
                var _nResultData = new Array();
                for (var i = 0; i < _tableData.length; i++) {
                    var nItemName = _tableData[i].ItemName; //把项目传参当request的条件
                    var nItemCount = _tableData[i].ItemCount; //把计算的值传参当request的条件
                    var nDataSelectConditions = new Array();
                    var nDataSelectCondition = {};
                    nDataSelectCondition.DataSelectName = m_nDefineData.DataItem;
                    nDataSelectCondition.DataSelectOption = "=";
                    nDataSelectCondition.DataSelectValue = nItemName;
                    nDataSelectConditions.push(nDataSelectCondition);
                    var nDataSelectCondition = {};
                    nDataSelectCondition.DataSelectName = m_nDefineData.DataRow;
                    nDataSelectCondition.DataSelectOption = "=";
                    nDataSelectCondition.DataSelectValue = nItemCount;
                    nDataSelectConditions.push(nDataSelectCondition);
                    var _childtableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, 0, nDataSelectConditions);
                    for (var j = 0; j < _childtableData.length; j++) {
                        _childtableData[j].ItemName = nItemName;
                        _childtableData[j].XValue = nItemCount;
                        _nResultData.push(_childtableData[j]);
                    }
                }
                return _nResultData;
            }
            else {
                //不按项目分组计算列
                nDataRow = m_nDefineData.DataRow;
                nDataRowOrder = m_nDefineData.DataRowOrder;
                nDataRowType = m_nDefineData.DataRowType;
                nOriDataRow = nDataRow;
                var _nResultData = new Array();
                for (var i = 0; i < _tableData.length; i++) {
                    var nItemName = _tableData[i].ItemCount; //把计算的值传参当request的条件
                    var nDataSelectConditions = new Array();
                    var nDataSelectCondition = {};
                    nDataSelectCondition.DataSelectName = nOriDataRow;
                    nDataSelectCondition.DataSelectOption = "=";
                    nDataSelectCondition.DataSelectValue = nItemName;
                    nDataSelectConditions.push(nDataSelectCondition);
                    var _childtableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, 0, nDataSelectConditions);
                    for (var j = 0; j < _childtableData.length; j++) {
                        _childtableData[j].ItemName = nItemName;
                        _nResultData.push(_childtableData[j]);
                    }
                }
                return _nResultData;
            }
        }
        else {
            //列 没有定义函数，为常规列方式
            if (m_nDefineData.DataItemOrder > 0) {
                nDataRow = m_nDefineData.DataItem;
                nDataRowOrder = m_nDefineData.DataItemOrder;
                nDataRowType = m_nDefineData.DataItemType;
            }
            else if (m_nDefineData.DataRowOrder > 0) {
                nDataRow = m_nDefineData.DataRow;
                nDataRowOrder = m_nDefineData.DataRowOrder;
                nDataRowType = m_nDefineData.DataRowType;
            }
            if (nDataRow == "") {
                if (m_nDefineData.DataItem != "") {
                    nDataRow = m_nDefineData.DataItem;
                    nDataRowOrder = m_nDefineData.DataItemOrder;
                    nDataRowType = m_nDefineData.DataItemType;
                }
                else if (m_nDefineData.DataRow != "") {
                    nDataRow = m_nDefineData.DataRow;
                    nDataRowOrder = m_nDefineData.DataRowOrder;
                    nDataRowType = m_nDefineData.DataRowType;
                }
            }
            nOriDataRow = nDataRow;
            var nDataSelectConditions = new Array();
            var _tableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, nDataRowFunType, nDataSelectConditions);
            if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "" && m_nDefineData.DataRow != undefined && m_nDefineData.DataRow != "") {
                var _nResultData = new Array();
                for (var i = 0; i < _tableData.length; i++) {
                    var nItemName = _tableData[i].ItemName;
                    if (nItemName != "totle" && nItemName != "") {
                        if (nOriDataRow == m_nDefineData.DataRow) {
                            nDataRow = m_nDefineData.DataItem;
                            nDataRowOrder = m_nDefineData.DataItemOrder;
                            nDataRowType = m_nDefineData.DataItemType;
                            var nDataSelectConditions = new Array();
                            var nDataSelectCondition = {};
                            nDataSelectCondition.DataSelectName = nOriDataRow;
                            nDataSelectCondition.DataSelectOption = "=";
                            nDataSelectCondition.DataSelectValue = nItemName;
                            nDataSelectConditions.push(nDataSelectCondition);
                            var _childtableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, 0, nDataSelectConditions);
                            for (var j = 0; j < _childtableData.length; j++) {
                                var nXValue = _childtableData[j].ItemName;
                                if (nXValue != "totle") {
                                    _childtableData[j].ItemName = nXValue;
                                    _childtableData[j].XValue = nItemName;
                                    _nResultData.push(_childtableData[j]);
                                }
                            }
                        }
                        else {
                            nDataRow = m_nDefineData.DataRow;
                            nDataRowOrder = m_nDefineData.DataRowOrder;
                            nDataRowType = m_nDefineData.DataRowType;
                            var nDataSelectConditions = new Array();
                            var nDataSelectCondition = {};
                            nDataSelectCondition.DataSelectName = nOriDataRow;
                            nDataSelectCondition.DataSelectOption = "=";
                            nDataSelectCondition.DataSelectValue = nItemName;
                            nDataSelectConditions.push(nDataSelectCondition);
                            var _childtableData = this.getESData(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, 0, nDataSelectConditions);
                            for (var j = 0; j < _childtableData.length; j++) {
                                var nXValue = _childtableData[j].ItemName;
                                if (nXValue != "totle") {
                                    _childtableData[j].ItemName = nItemName;
                                    _childtableData[j].XValue = nXValue;
                                    _nResultData.push(_childtableData[j]);
                                }
                            }
                        }
                    }
                }
                return _nResultData;
            }
            else {
                return _tableData;
            }
        }
    }
}
//调用ES获取数据              自定义表     自定义条件表     自定义函数表  图表配置  查询groupby groupby排序 groupby数据类型 列是否为函数     条件字段       条件值             第二个条件字段     第二个条件值
ESFun.getESData = function (m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataRow, nDataRowOrder, nDataRowType, nDataRowFunType, nDataSelectConditions) {
    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }
    reportarr.DataSource = m_nDefineData.DataSource;
    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();
    //查询条件
    this.initESFilterRequest(m_nConditionData, reportarr, Request);
    //must
    for (var i = 0; i < nDataSelectConditions.length; i++) {
        var nDataSelectName = nDataSelectConditions[i].DataSelectName;
        var nDataSelectOption = nDataSelectConditions[i].DataSelectOption;
        var nDataSelectValue = nDataSelectConditions[i].DataSelectValue;
        if (nDataSelectOption == "=") {
            var match = {};
            match.match = {};
            match.match[nDataSelectName] = nDataSelectValue;
            Request.query.bool.must.push(match);
        }
        if (nDataSelectOption == ">") {
            var range = {};
            range.range = {};
            range.range[nDataSelectName] = { "gt": nDataSelectValue };
            Request.query.bool.must.push(range);
        }
        if (nDataSelectOption == "<") {
            var range = {};
            range.range = {};
            range.range[nDataSelectName] = { "lt": nDataSelectValue };
            Request.query.bool.must.push(range);
        }
        if (nDataSelectOption == "like") {
            var wildcard = {};
            wildcard.wildcard = {};
            wildcard.wildcard[this.getFieldByFieldType(reportarr.DataSource, nDataSelectName)] = "*" + nDataSelectValue.toLowerCase() + "*"; //
            Request.query.bool.must.push(wildcard);
        }
    }

    //列是计算函数的情况
    if (nDataRowFunType > 0) {
        reportarr.FunCol1 = "";
        reportarr.FunCol2 = "";
        if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
            Request.aggs = {};
            Request.aggs.result = {};
            Request.aggs.result.terms = {};
            Request.aggs.result.terms.size = top;
            //group by  
            Request.aggs.result.terms.field = this.getFieldByFieldType(reportarr.DataSource, m_nDefineData.DataItem);

            var nFunData = {};
            nFunData.FunType = m_nDefineData.DataRowFunType;
            nFunData.FunField = m_nDefineData.DataRow;
            Request.aggs.result.aggs = {};
            reportarr.FunCol1 = this.concatFun(Request.aggs.result.aggs, nFunData, reportarr);
            //按项目升序
            if (m_nDefineData.DataItemOrder == 1) {
                Request.aggs.result.terms.order = { "_term": "asc" };
            }
            //按项目降序
            else if (m_nDefineData.DataItemOrder == 2) {
                Request.aggs.result.terms.order = { "_term": "desc" };
            }
            else if (m_nDefineData.DataRowOrder == 1) {
                if (reportarr.FunCol1 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol1] = "asc";
                }
            }
            else if (m_nDefineData.DataRowOrder == 2) {
                if (reportarr.FunCol1 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol1] = "desc";
                }
            }
        }
        else {
            Request.aggs = {};
            var nFunData = {};
            nFunData.FunType = m_nDefineData.DataRowFunType;
            nFunData.FunField = m_nDefineData.DataRow;
            reportarr.FunCol1 = this.concatFun(Request.aggs, nFunData, reportarr);
        }
    }
    else {
        //列是常规列的情况
        if (nDataRow != undefined && nDataRow != "") {
            Request.aggs = {};
            Request.aggs.result = {};
            Request.aggs.result.terms = {};
            Request.aggs.result.terms.size = top;

            //拼接聚合函数
            reportarr.FunCol1 = "";
            reportarr.FunCol2 = "";
            if (m_nFunData.length > 0) {
                Request.aggs.result.aggs = {};
                if (m_nDefineData.DataCol != undefined && m_nDefineData.DataCol != "") {
                    for (var i = 0; i < m_nFunData.length; i++) {
                        if (m_nFunData[i].FunID == m_nDefineData.DataCol) {
                            reportarr.FunCol1 = "count";
                            reportarr.FunNameDesc1 = m_nFunData[i].FunName;
                            if (m_nFunData[i].FunType == 2) {
                                //count函数直接取返回数据中的doc_count
                                break;
                            }
                            reportarr.FunCol1 = this.concatFun(Request.aggs.result.aggs, m_nFunData[i], reportarr);
                        }
                    }
                }
                if (m_nDefineData.DataCol2 != undefined && m_nDefineData.DataCol2 != "") {
                    for (var i = 0; i < m_nFunData.length; i++) {
                        if (m_nFunData[i].FunID == m_nDefineData.DataCol2) {
                            reportarr.FunCol2 = "count";
                            reportarr.FunNameDesc2 = m_nFunData[i].FunName;
                            if (m_nFunData[i].FunType == 2) {
                                //count函数直接取返回数据中的doc_count
                                break;
                            }
                            reportarr.FunCol2 = this.concatFun(Request.aggs.result.aggs, m_nFunData[i], reportarr);
                        }
                    }
                }
            }

            //group by  
            Request.aggs.result.terms.field = this.getFieldByFieldType(reportarr.DataSource, nDataRow);

            //按列升序
            if (nDataRowOrder == 1) {
                Request.aggs.result.terms.order = { "_term": "asc" };
            }
            //按列降序
            if (nDataRowOrder == 2) {
                Request.aggs.result.terms.order = { "_term": "desc" };
            }
            //按第一个函数值升序
            if (nDataRowOrder == 3) {
                if (reportarr.FunCol1 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol1] = "asc";
                }
            }
            //按第一个函数值降序
            if (nDataRowOrder == 4) {
                if (reportarr.FunCol1 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol1] = "desc";
                }
            }
            //按第二个函数值升序
            if (nDataRowOrder == 5) {
                if (reportarr.FunCol2 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol2] = "asc";
                }
            }
            //按第二个函数值降序
            if (nDataRowOrder == 6) {
                if (reportarr.FunCol2 != "") {
                    Request.aggs.result.terms.order = {};
                    Request.aggs.result.terms.order[reportarr.FunCol2] = "desc";
                }
            }
        }
        else {
            Request.aggs = {};

            //拼接聚合函数
            reportarr.FunCol1 = "";
            reportarr.FunCol2 = "";
            if (m_nFunData.length > 0) {
                Request.aggs = {};
                if (m_nDefineData.DataCol != undefined && m_nDefineData.DataCol != "") {
                    for (var i = 0; i < m_nFunData.length; i++) {
                        if (m_nFunData[i].FunID == m_nDefineData.DataCol) {
                            reportarr.FunCol1 = "count";
                            if (m_nFunData[i].FunType == 2) {
                                //count函数直接取返回数据中的doc_count
                                break;
                            }
                            reportarr.FunCol1 = this.concatFun(Request.aggs, m_nFunData[i], reportarr);
                        }
                    }
                }
                if (m_nDefineData.DataCol2 != undefined && m_nDefineData.DataCol2 != "") {
                    for (var i = 0; i < m_nFunData.length; i++) {
                        if (m_nFunData[i].FunID == m_nDefineData.DataCol2) {
                            reportarr.FunCol2 = "count";
                            if (m_nFunData[i].FunType == 2) {
                                //count函数直接取返回数据中的doc_count
                                break;
                            }
                            reportarr.FunCol2 = this.concatFun(Request.aggs, m_nFunData[i], reportarr);
                        }
                    }
                }
            }

        }
    }

    Request.size = 0;
    return ESDBHelper.getMyJsonDataByRequest(Request, reportarr);
}

//处理聚合函数 拼接
ESFun.concatFun = function (originResult, nFunData, reportarr) {
    var nFunCol = "";
    if (nFunData.FunType == 1) {
        nFunCol = "result_sum" + "_" + nFunData.FunField;
        originResult[nFunCol] = { sum: { field: nFunData.FunField} };
    }
    if (nFunData.FunType == 2) {
        nFunCol = "count";
    }
    if (nFunData.FunType == 3) {
        nFunCol = "result_cardinality" + "_" + nFunData.FunField;
        originResult[nFunCol] = { cardinality: { field: this.getFieldByFieldType(reportarr.DataSource,nFunData.FunField)} };
    }
    if (nFunData.FunType == 4) {
        nFunCol = "result_max" + "_" + nFunData.FunField;
        originResult[nFunCol] = { max: { field: nFunData.FunField} };
    }
    if (nFunData.FunType == 5) {
        nFunCol = "result_min" + "_" + nFunData.FunField;
        originResult[nFunCol] = { max: { field: nFunData.FunField} };
    }
    if (nFunData.FunType == 6) {
        nFunCol = "result_avg" + "_" + nFunData.FunField;
        originResult[nFunCol] = { max: { field: nFunData.FunField} };
    }
    //第10百分位
    if (nFunData.FunType == 10) {
        nFunCol = "result_per10" + "_" + nFunData.FunField;
        originResult[nFunCol] = { percentiles: { field: nFunData.FunField, percents: [10]} };
    }
    //第25百分位
    if (nFunData.FunType == 25) {
        nFunCol = "result_per25" + "_" + nFunData.FunField;
        originResult[nFunCol] = { percentiles: { field: nFunData.FunField, percents: [25]} };
    }
    //第50百分位
    if (nFunData.FunType == 50) {
        nFunCol = "result_per50" + "_" + nFunData.FunField;
        originResult[nFunCol] = { percentiles: { field: nFunData.FunField, percents: [50]} };
    }
    //第75百分位
    if (nFunData.FunType == 75) {
        nFunCol = "result_per75" + "_" + nFunData.FunField;
        originResult[nFunCol] = { percentiles: { field: nFunData.FunField, percents: [75]} };
    }
    //第90百分位
    if (nFunData.FunType == 90) {
        nFunCol = "result_per90" + "_" + nFunData.FunField;
        originResult[nFunCol] = { percentiles: { field: nFunData.FunField, percents: [90]} };
    }
    return nFunCol;
}

//ES自定义明细数据处理 带一个过滤条件参数    
ESFun.getMyDataSearchEchartParam = function (reportarr, params, nDataFields, nSearchFieldName, nSearchFieldType, nSearchFieldValue) {
    var objRequest = new Array();
    objRequest.ProcedureName = "[proc_simplereport_userdefine_config]";
    objRequest.ParameterNames = ["defineId"];
    objRequest.ParameterDataTypes = ["int"];
    objRequest.ParameterValues = [reportarr.CurDefineID];
    var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

    var m_nDefineData = getJsonStoreFromTable(objReturn.Table0)[0]; //自定义数据列表
    var m_nFunData = getJsonStoreFromTable(objReturn.Table1); //度量函数列表
    var m_nConditionData = getJsonStoreFromTable(objReturn.Table2); //度量函数列表

    var mustlist = ESFun.getEchartParamsFilter(m_nDefineData, reportarr, params);
    if (nSearchFieldType == "=") {
        var match = {};
        match.match = {};
        match.match[nSearchFieldName] = nSearchFieldValue;
        mustlist.push(match);
    }

    return this.getESDataByFieldAndMust(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, mustlist);
}


//ES自定义明细数据处理
ESFun.getMyDetailDefineData = function (reportarr, params) {
    var objRequest = new Array();
    objRequest.ProcedureName = "[proc_simplereport_userdefine_config]";
    objRequest.ParameterNames = ["defineId"];
    objRequest.ParameterDataTypes = ["int"];
    objRequest.ParameterValues = [reportarr.CurDefineID];
    var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

    var m_nDefineData = getJsonStoreFromTable(objReturn.Table0)[0]; //自定义数据列表
    var m_nFunData = getJsonStoreFromTable(objReturn.Table1); //度量函数列表
    var m_nConditionData = getJsonStoreFromTable(objReturn.Table2); //度量函数列表

    var mustlist = ESFun.getEchartParamsFilter(m_nDefineData, reportarr, params);

    var nDataFields = new Array(); //需显示的列
    for (var i = 0; i < reportarr.DetailField.length; i++) {
        nDataFields.push(reportarr.DetailField[i].FieldName);
    }

    return this.getESDataByFieldAndMust(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, mustlist);
}

//ES自定义明细数据处理 不查询自定义的数据作为条件或者依据
ESFun.getMyDetailDefineDataNoDefine = function (reportarr, params, nDataFields, nSearchFieldName, nSearchFieldType, nSearchFieldValue, nOrderFieldName) {

    var mustlist = new Array(); ;
    if (nSearchFieldType == "=") {
        var match = {};
        match.match = {};
        match.match[nSearchFieldName] = nSearchFieldValue;
        mustlist.push(match);
    }

    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }

    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();

    for (var i = 0; i < mustlist.length; i++) {
        Request.query.bool.must.push(mustlist[i]);
    }
    if (nOrderFieldName != "") {
        Request.sort = {};
        Request.sort[this.getFieldByFieldType(reportarr.DataSource, nOrderFieldName)] = { "order": "asc" };
    }

    Request.size = top;

    //查询字段
    if (nDataFields && nDataFields.length > 0) {
        Request._source = nDataFields;
    }
    return ESDBHelper.getMyJsonDetailByRequest(Request, reportarr);
}

//ES获取echart图表点击事件参数过滤条件
ESFun.getEchartParamsFilter = function (m_nDefineData, reportarr, params) {
    var mustlist = new Array();
    if (reportarr.isDataItemCondition) {
        if (m_nDefineData.DataItem != undefined && m_nDefineData.DataItem != "") {
            var match = {};
            match.match = {};

            var paramvalue = params.seriesName;
            if (params.componentType == "series" && paramvalue[1] == "-") {
                paramvalue = params.name;
            }
            //如果行也不为空，忽略掉项目的过滤条件
            if (m_nDefineData.DataRow == undefined || m_nDefineData.DataRow == "") {
                if (paramvalue == "" && params.name != "") {
                    paramvalue = params.name;
                }
            }
            if (paramvalue != "") {
                match.match[m_nDefineData.DataItem] = DateComponent.getWeekValue(paramvalue);
                mustlist.push(match);
            }
        }
    }
    if (reportarr.isDataRowCondition) {
        if (m_nDefineData.DataRow != undefined && m_nDefineData.DataRow != "") {
            if (reportarr.timeCondition == 1) {
                //如果X值取的不是范围
                var match = {};
                match.match = {};
                var paramvalue = params.name;
                if (paramvalue == "" && params.seriesName != "") {
                    paramvalue = params.seriesName;
                }
                if (paramvalue == "more") {
                    var range = {};
                    range.range = {};
                    range.range[m_nDefineData.DataRow] = { "gt": reportarr.endTime };
                    mustlist.push(range);
                }
                else {
                    if (paramvalue != "") {
                        match.match[m_nDefineData.DataRow] = DateComponent.getWeekValue(paramvalue);
                        mustlist.push(match);
                    }
                }
            }
            else {
                //如果X值取的是范围
                var paramvalue = params.name;
                if (paramvalue == "" && params.seriesName != "") {
                    paramvalue = params.seriesName;
                }
                if (paramvalue != "") {
                    var paramsplits = paramvalue.split('-');
                    if (paramsplits.length == 2) {
                        var paramsplits1 = paramsplits[0].split(':');
                        var range = {};
                        range.range = {};
                        range.range[m_nDefineData.DataRow] = { "gte": paramsplits1[0] };
                        mustlist.push(range);

                        var paramsplits1 = paramsplits[1].split(':');
                        var range = {};
                        range.range = {};
                        range.range[m_nDefineData.DataRow] = { "lt": paramsplits1[0] };
                        mustlist.push(range);
                    }
                }
            }
        }
    }
    return mustlist;
}

//ES明细使用统计聚合函数
ESFun.getMyDetailDefineDataByFun = function (reportarr, params, nGroupByFieldName, nGroupByDataType, nFunFieldName, nFunType) {
    var objRequest = new Array();
    objRequest.ProcedureName = "[proc_simplereport_userdefine_config]";
    objRequest.ParameterNames = ["defineId"];
    objRequest.ParameterDataTypes = ["int"];
    objRequest.ParameterValues = [reportarr.CurDefineID];
    var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

    var m_nDefineData = getJsonStoreFromTable(objReturn.Table0)[0]; //自定义数据列表
    var m_nFunData = getJsonStoreFromTable(objReturn.Table1); //度量函数列表
    var m_nConditionData = getJsonStoreFromTable(objReturn.Table2); //度量函数列表
    reportarr.DataSource = m_nDefineData.DataSource;

    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }
    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();
    //添加图表过滤条件
    var nMustList = ESFun.getEchartParamsFilter(m_nDefineData, reportarr, params);
    for (var i = 0; i < nMustList.length; i++) {
        Request.query.bool.must.push(nMustList[i]);
    }

    Request.aggs = {};
    Request.aggs.result = {};
    Request.aggs.result.terms = {};
    Request.aggs.result.terms.size = top;
    //group by  
    Request.aggs.result.terms.field = this.getFieldByFieldType(reportarr.DataSource, nGroupByFieldName);

    var nFunData = {};
    nFunData.FunType = nFunType;
    nFunData.FunField = nFunFieldName;
    Request.aggs.result.aggs = {};
    reportarr.FunCol1 = this.concatFun(Request.aggs.result.aggs, nFunData, reportarr);
//    Request.aggs.result.terms.order = { "_term": "desc" };

    //查询条件
    this.initESFilterRequest(m_nConditionData, reportarr, Request);

    Request.size = 0;
    return ESDBHelper.getMyJsonDataByRequest(Request, reportarr);
}

//ES自定义明细数据处理     报表属性、ECHART点击参数、字段名、字段处理类型、需查询字段、TAT计算字段、TAT取小时字段、TAT开始时间、TAT结束时间
ESFun.getMyDetailDefineDataBySpecialTAT = function (reportarr, params, nFieldName, nDataType, nDataFields, nTATColumn, nTATHour, nStartTime, nEndTime) {
    var objRequest = new Array();
    objRequest.ProcedureName = "[proc_simplereport_userdefine_config]";
    objRequest.ParameterNames = ["defineId"];
    objRequest.ParameterDataTypes = ["int"];
    objRequest.ParameterValues = [reportarr.CurDefineID];
    var objReturn = JQGlobal.SendMessage("DB_CallProcedure", objRequest);

    var m_nDefineData = getJsonStoreFromTable(objReturn.Table0)[0]; //自定义数据列表
    var m_nFunData = getJsonStoreFromTable(objReturn.Table1); //度量函数列表
    var m_nConditionData = getJsonStoreFromTable(objReturn.Table2); //度量函数列表
    reportarr.DataSource = m_nDefineData.DataSource;

    var Request = ESFun.getESDataByFieldRequest(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn);
    if (nDataType == "max") {
        Request.sort = {};
        Request.sort[nFieldName] = { "order": "desc" };
        Request.size = 1;
    }
    if (nDataType == "cardinality") {
        Request.size = 1;
    }
    if (nTATHour != "") {
        var range = {};
        range.range = {};
        range.range[nTATHour] = { "gte": nStartTime };
        Request.query.bool.must.push(range);

        var range = {};
        range.range = {};
        range.range[nTATHour] = { "lt": nEndTime };
        Request.query.bool.must.push(range);
    }
    return ESDBHelper.getMyJsonDetailByRequest(Request, reportarr);
}

//调用ES获取明细数据 查询明细列表字段
ESFun.getESDataByFieldAndMust = function (m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nMustList) {
    reportarr.DataSource = m_nDefineData.DataSource;
    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }
    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();

    for (var i = 0; i < nMustList.length; i++) {
        Request.query.bool.must.push(nMustList[i]);
    }

    //查询条件
    this.initESFilterRequest(m_nConditionData, reportarr, Request);
    Request.size = top;

    Request.sort = {};
    Request.sort[this.getFieldByFieldType(reportarr.DataSource, "TestDate")] = { "order": "asc" };

    //查询字段
    Request._source = nDataFields;

    return ESDBHelper.getMyJsonDetailByRequest(Request, reportarr);
}

//调用ES获取明细数据 查询指定字段
ESFun.getESDataByField = function (m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn) {
    reportarr.DataSource = m_nDefineData.DataSource;
    var Request = ESFun.getESDataByFieldRequest(m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn);

    return ESDBHelper.getMyJsonDetailByRequest(Request, reportarr);
}

//调用ES获取明细数据 查询指定字段 获取单个字段的数据字典
ESFun.getESDataByFieldDistinct = function (m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataField, nDataType) {
    reportarr.DataSource = m_nDefineData.DataSource;
    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }
    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();

    //查询条件
    this.initESFilterRequest(m_nConditionData, reportarr, Request);

    Request.aggs = {};
    Request.aggs.result = {};
    Request.aggs.result.terms = {};
    Request.aggs.result.terms.size = top;
    //group by  
    Request.aggs.result.terms.field = this.getFieldByFieldType(reportarr.DataSource, nDataField);

    return ESDBHelper.getMyJsonDataByRequest(Request, reportarr);
}

//调用ES获取明细数据 查询指定字段
ESFun.getESDataByFieldRequest = function (m_nDefineData, m_nConditionData, m_nFunData, reportarr, nDataFields, nTATColumn) {
    var top = window._webconfig.ESReturnCount;
    if (reportarr.Top && reportarr.Top > 0) {
        top = reportarr.Top;
    }
    var Request = {};
    Request.query = {};
    Request.query.bool = {};
    Request.query.bool.must = new Array();
    Request.query.bool.must_not = new Array();

    //查询条件
    this.initESFilterRequest(m_nConditionData, reportarr, Request);

    //模组设置为true时，模组条件拼接
    if (reportarr.isLasSet) {
        var nTatLasCodes = new Array();
        for (var l = 0; l < reportarr.LasSet.length; l++) {
            nTatLasCodes.push(reportarr.LasSet[l].StartLas + "-" + reportarr.LasSet[l].EndLas);
        }

        var terms = {};
        terms.terms = {};
        terms.terms[this.getFieldByFieldType(reportarr.DataSource, m_nDefineData.DataItem)] = nTatLasCodes;
        Request.query.bool.must.push(terms);
    }
    //TAT设置
    if (nTATColumn != "") {
        var range = {};
        range.range = {};
        range.range[nTATColumn] = { "gt": 10 };
        Request.query.bool.must.push(range);
    }
    if (reportarr.tatMinValue != undefined && reportarr.tatMinValue > 0) {
        var range = {};
        range.range = {};
        range.range[nTATColumn] = { "gte": reportarr.tatMinValue };
        Request.query.bool.must.push(range);
    }
    if (reportarr.tatMaxValue != undefined && reportarr.tatMaxValue > 0) {
        var range = {};
        range.range = {};
        range.range[nTATColumn] = { "lte": reportarr.tatMaxValue };
        Request.query.bool.must.push(range);
    }
    /////////////

    //查询字段
    Request._source = nDataFields;

    Request.size = top;
    return Request;
}

//初始化查询条件
ESFun.initESFilterRequest = function (m_nConditionData, reportarr, Request) {
    function concatESFilter(nFilterCode, nFilterName, nFilterType) {
        var hasFilter = 0;
        if (reportarr[nFilterCode]) {
            if (reportarr[nFilterCode + "Where"] != undefined && reportarr[nFilterCode + "Where"].length > 0) {
                var terms = {};
                terms.terms = {};
                terms.terms[nFilterName] = reportarr[nFilterCode + "Where"];
                Request.query.bool.must.push(terms);
                hasFilter = 1;
            }
        }
        if (hasFilter == 0) {
            var _datafiltervalue = new Array();
            for (var j = 0; j < top.JQGlobal._dataSourceFilter.length; j++) {
                var _datasourcefilter = top.JQGlobal._dataSourceFilter[j];
                for (var k = 0; k < top.JQGlobal._dataSourceFilterValue.length; k++) {
                    var _datasourcefiltervalue = top.JQGlobal._dataSourceFilterValue[k];
                    if (_datasourcefilter.SourceCode == reportarr.DataSource && _datasourcefilter.FilterCode == nFilterCode && nFilterCode == _datasourcefiltervalue.OperateCode) {
                        if (nFilterType == "number") {
                            _datafiltervalue.push(parseInt(_datasourcefiltervalue.OperateValue));
                        }
                        else {
                            _datafiltervalue.push(_datasourcefiltervalue.OperateValue);
                        }
                    }
                }
            }
            if (_datafiltervalue.length > 0) {
                var terms = {};
                terms.terms = {};
                terms.terms[nFilterName] = _datafiltervalue;
                Request.query.bool.must_not.push(terms);
            }
        }
    }
    //过滤条件拼接
    for (var i = 0; i < window._webconfig.table_filter_collection.length; i++) {
        var nTableFilter = window._webconfig.table_filter_collection[i];
        var nFilterName = nTableFilter[5];
        var nFilterCode = nTableFilter[4];
        var nFilterType = nTableFilter[6];
        concatESFilter(nFilterCode, nFilterName, nFilterType);
    }
    //数据库字典
    for (var i = 0; i < top.JQGlobal._dictType.length; i++) {
        var nTableFilter = top.JQGlobal._dictType[i];
        var _name = nTableFilter.DictFieldName;
        var _code = nTableFilter.DictTypeCode;
        var _type = nTableFilter.DictFieldType;
        concatESFilter(_code, _name, _type);
    }
    //查询条件 时间
    var startdate = window.nReportStartDate + " 00:00.000";
    var enddate = window.nReportEndDate + " 23:59";
    var range = {};
    range.range = {};
    range.range["TestDate"] = { "gte": DateComponent.getTimeStampByDate(startdate) };
    Request.query.bool.must.push(range);

    var range = {};
    range.range = {};
    range.range["TestDate"] = { "lte": DateComponent.getTimeStampByDate(enddate) };
    Request.query.bool.must.push(range);

    //查询条件拼接
    for (var i = 0; i < m_nConditionData.length; i++) {
        var m_Condition = m_nConditionData[i];
        //must-not
        if (m_Condition.ConditionType == "!=") {
            var term = {};
            term.term = {};
            term.term[m_Condition.ConditionField] = m_Condition.ConditionValue;
            Request.query.bool.must_not.push(term);
        }
        if (m_Condition.ConditionType == "not in") {
            var terms = {};
            terms.terms = {};
            var conditionValues = m_Condition.ConditionValue.toLowerCase().split(",");
            terms.terms[m_Condition.ConditionField] = conditionValues;
            Request.query.bool.must_not.push(terms);
        }
        if (m_Condition.ConditionType == "not like") {
            var wildcard = {};
            wildcard.wildcard = {};
            var conditionValues = m_Condition.ConditionValue;
            wildcard.wildcard[this.getFieldByFieldType(reportarr.DataSource, m_Condition.ConditionField)] = "*" + conditionValues.toLowerCase() + "*"; //+ ".keyword"
            Request.query.bool.must_not.push(wildcard);
        }
        //must
        if (m_Condition.ConditionType == "=") {
            var match = {};
            match.match = {};
            match.match[m_Condition.ConditionField] = m_Condition.ConditionValue;
            Request.query.bool.must.push(match);
        }
        if (m_Condition.ConditionType == "in") {
            var terms = {};
            terms.terms = {};
            var conditionValues = m_Condition.ConditionValue.toLowerCase().split(",");
            terms.terms[m_Condition.ConditionField] = conditionValues;
            Request.query.bool.must.push(terms);
        }
        if (m_Condition.ConditionType == ">") {
            var range = {};
            range.range = {};
            range.range[m_Condition.ConditionField] = { "gt": m_Condition.ConditionValue };
            Request.query.bool.must.push(range);
        }
        if (m_Condition.ConditionType == ">=") {
            var range = {};
            range.range = {};
            range.range[m_Condition.ConditionField] = { "gte": m_Condition.ConditionValue };
            Request.query.bool.must.push(range);
        }
        if (m_Condition.ConditionType == "<") {
            var range = {};
            range.range = {};
            range.range[m_Condition.ConditionField] = { "lt": m_Condition.ConditionValue };
            Request.query.bool.must.push(range);
        }
        if (m_Condition.ConditionType == "<=") {
            var range = {};
            range.range = {};
            range.range[m_Condition.ConditionField] = { "lte": m_Condition.ConditionValue };
            Request.query.bool.must.push(range);
        }
        if (m_Condition.ConditionType == "like") {
            var wildcard = {};
            wildcard.wildcard = {};
            var conditionValues = m_Condition.ConditionValue;
            wildcard.wildcard[this.getFieldByFieldType(reportarr.DataSource, m_Condition.ConditionField)] = "*" + conditionValues.toLowerCase() + "*"; //+ ".keyword"
            Request.query.bool.must.push(wildcard);
        }
    }

}
//获取字段的传参数关键词 针对某些查询条件string型的字段需添加.keyword而设计  
//数据源CODE，字段名
ESFun.getFieldByFieldType = function (dataSourceCode, fieldName) {
    var _result = fieldName;
    for (var i = 0; i < top.JQGlobal._dataSourceComment.length; i++) {
        var _dataSourceComment = top.JQGlobal._dataSourceComment[i];
        if (_dataSourceComment.FieldSource == dataSourceCode && _dataSourceComment.FieldName == fieldName) {
            if (_dataSourceComment.FieldType == "string") {
                _result = fieldName + ".keyword";
            }
        }
    }
    return _result;
}