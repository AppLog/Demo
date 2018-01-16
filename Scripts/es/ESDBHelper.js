var ESDBHelper = {};

//返回带聚合函数的数据列表
ESDBHelper.getMyJsonDataByRequest = function (Request, reportarr) {
    var Return = JQGlobal.SendESMessage(this.getDataSourceUrlByCode(reportarr.DataSource), Request);
    var _tableData = new Array();
    var tooks = getJsonStoreFromTableAndFromType(Return, reportarr.dataResultFormat);
    if (tooks == undefined || tooks.hits == undefined) {
        return _tableData;
    }
    if (tooks.aggregations == undefined) {
        //没有聚合函数 无返回数据 只取总记录数
        if (tooks.hits.total != undefined) {
            var count = tooks.hits.total;
            var nDataItem = {};
            var nItemName = reportarr.textStyle;
            if (nItemName == "") {
                nItemName = "total";
            }
            nDataItem.ItemName = nItemName;
            nDataItem.ItemCount = count;
            _tableData.push(nDataItem);
        }
    }
    else {
        if (tooks.aggregations.result == undefined) {
            //单纯返回一个数量 没有其他数据
            if (tooks.aggregations[reportarr.FunCol1].value != undefined) {
                var count = tooks.aggregations[reportarr.FunCol1].value;
                var nDataItem = {};
                var nItemName = reportarr.FunCol1;
                nDataItem.ItemName = nItemName;
                nDataItem.ItemCount = count;
                _tableData.push(nDataItem);
            }
            //单纯返回一组数量 没有其他数据
            if (tooks.aggregations[reportarr.FunCol1].values != undefined) {
                var values = tooks.aggregations[reportarr.FunCol1].values;
                var jsonobj = JSON.stringify(values).trimEnd("}").split(":");
                var count = parseInt(jsonobj[1]);
                var nDataItem = {};
                var nItemName = reportarr.FunCol1;
                nDataItem.ItemName = nItemName;
                nDataItem.ItemCount = count;
                _tableData.push(nDataItem);
            }

        }
        else {
            if (tooks.aggregations.result.buckets != undefined) {
                if (tooks.aggregations.result.buckets.length > 0) {
                    var buckets = tooks.aggregations.result.buckets;
                    for (var i = 0; i < buckets.length; i++) {
                        var bucket = buckets[i];
                        if (bucket.result == undefined) {
                            //只有一个group by 
                            var key = bucket.key;
                            var nDataItem = {};
                            nDataItem.ItemName = key;
                            var count = 0;
                            var value = 0;
                            if (reportarr.FunCol1 != undefined && reportarr.FunCol1 != "") {//第一个函数
                                if (reportarr.FunCol1 == "count") {
                                    count = bucket.doc_count;
                                }
                                else {
                                    count = bucket[reportarr.FunCol1].value;
                                }
                                nDataItem.ItemCount = count;
                            }
                            if (reportarr.FunCol2 != undefined && reportarr.FunCol2 != "") {//第二个函数
                                if (reportarr.FunCol2 == "count") {
                                    value = bucket.doc_count;
                                }
                                else {
                                    value = bucket[reportarr.FunCol2].value;
                                }
                                nDataItem.ItemValue = value;
                            }
                            _tableData.push(nDataItem);
                        }
                        else {
                            //有两个group by 
                            for (var j = 0; j < bucket.result.buckets.length; j++) {
                                var key = bucket.key;
                                var xval = bucket.result.buckets[j].key;
                                var nDataItem = {};
                                nDataItem.ItemName = key;
                                nDataItem.XValue = xval;

                                var count = 0;
                                var value = 0;
                                if (reportarr.FunCol1 != undefined && reportarr.FunCol1 != "") {//第一个函数
                                    if (reportarr.FunCol1 == "count") {
                                        count = bucket.result.buckets[j].doc_count;
                                    }
                                    else {
                                        count = bucket.result.buckets[j][reportarr.FunCol1].value;
                                    }
                                    nDataItem.ItemCount = count;
                                }
                                if (reportarr.FunCol2 != undefined && reportarr.FunCol2 != "") {//第二个函数
                                    if (reportarr.FunCol2 == "count") {
                                        value = bucket.result.buckets[j].doc_count;
                                    }
                                    else {
                                        value = bucket.result.buckets[j][reportarr.FunCol2].value;
                                    }
                                    nDataItem.ItemValue = value;
                                }
                                _tableData.push(nDataItem);
                            }
                        }
                    }
                }
            }
            else {
                //单纯返回一个数量 没有其他数据
                var count = tooks.aggregations.result.value;
                var nDataItem = {};
                var nItemName = reportarr.textStyle;
                if (nItemName == "") {
                    nItemName = "total";
                }
                nDataItem.ItemName = nItemName;
                nDataItem.ItemCount = count;
                _tableData.push(nDataItem);
            }
        }
    }

    return _tableData;
}

//返回指定列数据的明细列表
ESDBHelper.getMyJsonDetailByRequest = function (Request, reportarr) {
    var Return = JQGlobal.SendESMessage(this.getDataSourceUrlByCode(reportarr.DataSource), Request);
    var _tableData = new Array();
    var tooks = getJsonStoreFromTableAndFromType(Return, reportarr.dataResultFormat);
    if (tooks == undefined || tooks.hits == undefined || tooks.hits.hits == undefined) {
        return _tableData;
    }
    for (var i = 0; i < tooks.hits.hits.length; i++) {
        var hit = tooks.hits.hits[i];
        _tableData.push(hit._source);
    }
    return _tableData;
}

ESDBHelper.getDataSourceUrlByCode = function (code) {
    var _url = code;
    for (var i = 0; i < top.JQGlobal._dataSource.length; i++) {
        var _datasource = top.JQGlobal._dataSource[i];
        if (_datasource.SourceCode == code) {
            _url = _datasource.SourceUrl;
        }
    }
    return _url;
}