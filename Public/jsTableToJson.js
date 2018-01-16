function getJsonStoreFromJSTable(nJSTable) {
    var nJsonStore = [];

    if (nJSTable != null && nJSTable.getRecordCount() > 0) {
        var nfieldsTitles = nJSTable._fieldsTitle;
        for (var idx = 0; idx < nJSTable.getRecordCount(); idx++) {
            var rcd = {};

            for (var i = 0; i < nfieldsTitles.length; i++) {
                var field = nfieldsTitles[i];
                rcd[field] = nJSTable.getValue(idx, field, "");
            }
            nJsonStore.push(rcd);
        }
    }
    return nJsonStore;
}

function getJsonStoreFromTable(nTable) {
    if (window._webconfig._sysDataType.toUpperCase() == "JSTABLE") {
        return getJsonStoreFromJSTable(nTable);
    }
    else {
        return nTable;
    }
}

function getJsonStoreFromTableAndFromType(nTable, nFromType) {
    if (nFromType.toUpperCase() == "JSTABLE") {
        return getJsonStoreFromJSTable(nTable);
    }
    else {
        return nTable;
    }
}