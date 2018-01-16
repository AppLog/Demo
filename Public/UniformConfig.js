// UniformConfig.js
// 统一配置接口类(仅TOP层定义)

////////////////////////////////////////////////////////////////////////////////
// 用户/机器/本地 统一配置类

var UniformConfig = {};

//用户/机器/系统/Cookie/本地 配置数据 moduleName -- object (configName -- value)
UniformConfig._moduleObjectUser    = {};
UniformConfig._moduleObjectMachine = {};
UniformConfig._moduleObjectSystem  = {};
UniformConfig._moduleObjectCookie  = {};
UniformConfig._moduleObjectLocal   = {};
//仪器组 配置数据 moduleName -- object( instruemntgroup-object(configName -- value))
UniformConfig._moduleObjectIG      = {};


//用户/机器/系统/Cookie 修改状态UniformConfig._moduleChangeUser    = {};
UniformConfig._moduleChangeMachine = {};
UniformConfig._moduleChangeSystem  = {};
UniformConfig._moduleChangeCookie  = {};
//仪器组 修改状态 修改总状态
UniformConfig._moduleChangeIG      = {};
//仪器组 修改状态 moduleName -- object{ instruemntgroup-changflag }
UniformConfig._moduleChangeIG2     = {};

//用户/机器/系统 清除状态UniformConfig._moduleClearUser    = {};
UniformConfig._moduleClearMachine = {};
UniformConfig._moduleClearSystem  = {};
//仪器组 清除状态1 全部清除
UniformConfig._moduleClearIG      = {};
//仪器组 清除状态2 moduleName -- object{ instruemntgroup-clearflag }
UniformConfig._moduleClearIG2     = {};

//Cookie是否读取
UniformConfig._bReadCookie        = false;
//保存使用的定时事件
UniformConfig._timerSaveConfig    = null;


//读取配置(普通值)
// configType:配置类型(可选,其值为:system/user/machine/IG(即instrumentgroup)/cookie/local或<空>  即当前登录)
// moduleName:模块名称
// configName:配置名称
// defaultValue:无配置项时的默认值
// instrumentgroupid:配置类型为IG(即instrumentgroup)时使用
UniformConfig.readValue   = function( configType, moduleName, configName, defaultValue, instrumentgroupid )
{
    if( configType=="IG" ) configType = "instrumentgroup";
    var findModule = this.myFindModule( moduleName, configType );
    if( configType=="instrumentgroup" )
    {
        if( findModule[instrumentgroupid] == null )
            findModule[instrumentgroupid] = {};
        findModule = findModule[instrumentgroupid];
    }
    var findValue  = findModule[configName];
    if( findValue == null )
        return defaultValue===undefined ? null : defaultValue;
    return findValue;
}

//读取配置(数组对象)
UniformConfig.readArray  = function( configType, moduleName, configName, instrumentgroupid )
{
    if( configType=="IG" ) configType = "instrumentgroup";
    var findModule = this.myFindModule( moduleName, configType );
    if( configType=="instrumentgroup" )
    {
        if( findModule[instrumentgroupid] == null )
            findModule[instrumentgroupid] = {};
        findModule = findModule[instrumentgroupid];
    }
    var findValue  = findModule[configName];
    if( findValue == null || findValue.splice == null )
        return [];
    return findValue;
}

//写入配置(普通值)
UniformConfig.writeValue   = function( configType, moduleName, configName, value, instrumentgroupid )
{
    if( configType=="IG" ) configType = "instrumentgroup";
    var findModule = this.myFindModule( moduleName, configType );
    if( configType=="instrumentgroup" )
    {
        if( findModule[instrumentgroupid] == null )
            findModule[instrumentgroupid] = {};
        findModule = findModule[instrumentgroupid];
    }
    
    findModule[configName] = value;    
    this.myPostSaveConfig( configType, moduleName, instrumentgroupid );
}

//写入配置(数组对象)
UniformConfig.writeArray  = function( configType, moduleName, configName, value, instrumentgroupid )
{
    if( configType=="IG" ) configType = "instrumentgroup";
    var findModule = this.myFindModule( moduleName, configType );
    if( configType=="instrumentgroup" )
    {
        if( findModule[instrumentgroupid] == null )
            findModule[instrumentgroupid] = {};
        findModule = findModule[instrumentgroupid];
    }

    if( value.splice == null )
        value = [];
    findModule[configName] = value;

    this.myPostSaveConfig( configType, moduleName, instrumentgroupid );
}

//清除指定模块的所有配置
UniformConfig.clear = function( configType, moduleName, instrumentgroupid )
{
    if( configType=="IG" ) configType = "instrumentgroup";
    switch( configType )
    {
    case "user":
        this._moduleObjectUser[moduleName] = {};
        this._moduleClearUser[moduleName]  = true;
        this._moduleChangeUser[moduleName] = true;
        break;
    case "machine":
        this._moduleObjectMachine[moduleName] = {};
        this._moduleClearMachine[moduleName]  = true;
        this._moduleChangeMachine[moduleName] = true;
        break;
    case "system":
        this._moduleObjectSystem[moduleName] = {};
        this._moduleClearSystem[moduleName]  = true;
        this._moduleChangeSystem[moduleName] = true;
        break;
    case "instrumentgroup":
        if( instrumentgroupid == null )
        {//清除全部仪器组
            this._moduleObjectIG[moduleName]     = {};
            this._moduleClearIG[moduleName]      = true;
            this._moduleChangeIG[moduleName]     = true;
        }
        else
        {//清除指定仪器组
            var findModule = this.myFindModule( moduleName, configType );
            if( findModule[instrumentgroupid] == null )
                findModule[instrumentgroupid] = {};
            findModule[instrumentgroupid] = {};
            
            if( this._moduleClearIG2[moduleName] == null )
                this._moduleClearIG2[moduleName] = {};
            this._moduleClearIG2[moduleName][instrumentgroupid] = true;
            this._moduleChangeIG[moduleName] = true;
            if( this._moduleChangeIG2[moduleName] == null )
                this._moduleChangeIG2[moduleName] = {};
            this._moduleChangeIG2[moduleName][instrumentgroupid] = true;
        }
        break;
    case "cookie":
        this._moduleObjectCookie[moduleName] = {};
        this._moduleChangeCookie[moduleName] = true;
        break;       
    case "local":
    case null:
    case undefined:
        this._moduleObjectLocal[moduleName] = {};
        break;
    }

    this.myPostSaveConfig( configType, moduleName, instrumentgroupid );
}

////////////////////////////////////////////////////////////////////////////////

//找到对象
UniformConfig.myFindModule = function( moduleName, configType )
{
    var findModule;
    
    switch( configType )
    {
    case "user":
        findModule = this._moduleObjectUser[moduleName];
        if( findModule == null )
        {
            this.myReadConfig( configType, moduleName );
            findModule = this._moduleObjectUser[moduleName];
        }
        break;
    
    case "machine":
        findModule = this._moduleObjectMachine[moduleName];
        if( findModule == null )
        {
            this.myReadConfig( configType, moduleName );
            findModule = this._moduleObjectMachine[moduleName];
        }
        break;
        
    case "system":
        findModule = this._moduleObjectSystem[moduleName];
        if( findModule == null )
        {
            this.myReadConfig( configType, moduleName );
            findModule = this._moduleObjectSystem[moduleName];
        }
        break;
    
    case "instrumentgroup":
        findModule = this._moduleObjectIG[moduleName];
        if( findModule == null )
        {
            this.myReadConfig( configType, moduleName );
            findModule = this._moduleObjectIG[moduleName];
        }
        break;

    case "cookie":
        if( !this._bReadCookie )
        {
            //第一次读取Cookie类数据时,从Cookie读取并分解
            this._bReadCookie = true;
            var arrayCookie = document.cookie.split( "; " );
            for( var nIndex=0; nIndex<arrayCookie.length; nIndex++ )
            {
                var array = arrayCookie[nIndex].split( "=" );
                if( array[0]==null || array[0]=="" || array.length<2 )
                    continue;
                try
                {
                    this._moduleObjectCookie[array[0]] = Json.fromString( unescape(array[1]) );
                }
                catch(e)
                {
                    this._moduleObjectCookie[array[0]] = {};
                }
            }            
        }
        findModule = this._moduleObjectCookie[moduleName];
        if( findModule == null )
        {
            this._moduleObjectCookie[moduleName] = {};
            findModule = this._moduleObjectCookie[moduleName];
        }
        break;
        
    case "local":
    case null:
    case undefined:
        findModule = this._moduleObjectLocal[moduleName];
        if( findModule == null )
        {
            this._moduleObjectLocal[moduleName] = {};
            findModule = this._moduleObjectLocal[moduleName];
        }
        break;
        
    default:
        findModule = {};
        break;
    }
    
    return findModule;
}

UniformConfig.myPostSaveConfig = function( configType, moduleName, instrumentgroupid )
{
    var bDelaySave = false;
    switch( configType )
    {
    case "user":
        bDelaySave = true;
        this._moduleChangeUser[moduleName] = true;
        break;
    case "machine":
        bDelaySave = true;
        this._moduleChangeMachine[moduleName] = true;
        break;
    case "system":
        bDelaySave = true;
        this._moduleChangeSystem[moduleName] = true;
        break;
    case "instrumentgroup":
        bDelaySave = true;
        this._moduleChangeIG[moduleName]     = true;
        if( instrumentgroupid != null )
        {
            if( this._moduleChangeIG2[moduleName] == null )
                this._moduleChangeIG2[moduleName] = {};
            this._moduleChangeIG2[moduleName][instrumentgroupid] = true;
        }
        break;
    case "cookie":
        bDelaySave = true;
        this._moduleChangeCookie[moduleName] = true;
        break;
    }
        //延迟100ms后保存    if( bDelaySave && this._timerSaveConfig == null )
        this._timerSaveConfig = JQGlobal.timerCall( this, this.mySaveConfig, moduleName, 100 )
}

UniformConfig.mySaveConfig = function( )
{
    //清除定时器    this._timerSaveConfig = null;
    
    //保存用户配置
    for( var moduleName in this._moduleChangeUser )
    {
        if( typeof this._moduleChangeUser[moduleName] == "function" )
            continue;
        this.myWriteConfig( "user", moduleName );
    }
    this._moduleChangeUser = {};

    //保存机器配置
    for( var moduleName in this._moduleChangeMachine )
    {
        if( typeof this._moduleChangeMachine[moduleName] == "function" )
            continue;
        this.myWriteConfig( "machine", moduleName );
    }
    this._moduleChangeMachine = {};

    //保存系统配置
    for( var moduleName in this._moduleChangeSystem )
    {
        if( typeof this._moduleChangeSystem[moduleName] == "function" )
            continue;
        this.myWriteConfig( "system", moduleName );
    }
    this._moduleChangeSystem = {};

    //保存仪器组配置
    for( var moduleName in this._moduleChangeIG )
    {
        if( typeof this._moduleChangeIG[moduleName] == "function" )
            continue;
        this.myWriteConfig( "instrumentgroup", moduleName );
    }
    this._moduleChangeIG = {};
    this._moduleChangeIG2 = {};
    
    //保存Cookie配置
    for( var moduleName in this._moduleChangeCookie )
    {
        if( typeof this._moduleChangeCookie[moduleName] == "function" )
            continue;
        try
        {
            var strData = Json.toString( this._moduleObjectCookie[moduleName] );
        }
        catch(e)
        {
            var strData = "{}";
        }
        if( strData == "{}" )
            document.cookie = moduleName + "={}";
        else
            document.cookie = moduleName + "=" + escape(strData) + "; expires=Fri, 1 Jan 2100 00:00:00 UTC";
    }
    this._moduleChangeCookie = {};
}

////////////////////////////////////////////////////////////////////////////////

//从服务器下载 用户配置
UniformConfig.myReadConfig = function( configType, moduleName )
{
    var Request = JQGlobal.NewMessage();
    Request.ConfigType = configType;
    Request.ModuleID   = moduleName;
    var Return = JQGlobal.SendMessage( "CFG_GetConfig", Request );
    
    var moduleConfig = {};
    if( Return.ErrorID == 0 )
        moduleConfig = this.myTableToObject( Return.ConfigInfo, configType );
    
    switch( configType )
    {
    case "user":
        this._moduleObjectUser[moduleName] = moduleConfig;
        break;
    case "machine":
        this._moduleObjectMachine[moduleName] = moduleConfig;
        break;
    case "system":
        this._moduleObjectSystem[moduleName] = moduleConfig;
        break;
    case "instrumentgroup":
        this._moduleObjectIG[moduleName] = moduleConfig;
        break;
    }
}
 
 //向服务器保存 用户配置
UniformConfig.myWriteConfig = function( configType, moduleName )
{
    var sConfigID = "";
    switch( configType )
    {
    case "user":
        var bOverlay = this._moduleClearUser[moduleName] != null;
        if( bOverlay ) delete this._moduleClearUser[moduleName];
        break;
    case "machine":
        var bOverlay = this._moduleClearMachine[moduleName] != null;
        if( bOverlay ) delete this._moduleClearMachine[moduleName];
        break;
    case "system":
        var bOverlay = this._moduleClearSystem[moduleName] != null;
        if( bOverlay ) delete this._moduleClearSystem[moduleName];
        break;
    case "instrumentgroup":
        var bOverlay = this._moduleClearIG[moduleName] != null;
        if( !bOverlay )
        {
            var clearModule = this._moduleClearIG2[moduleName];
            var arrayInstrumentGroupID = [];
            for( var nInstrumentGroupID in clearModule )
            {
                if( clearModule[nInstrumentGroupID] !== true )
                    continue;
                arrayInstrumentGroupID.push( nInstrumentGroupID );
            }
            sConfigID = arrayInstrumentGroupID.join( "," );
            bOverlay = sConfigID != "";
        }
        delete this._moduleClearIG[moduleName];
        delete this._moduleClearIG2[moduleName];
        break;
    }
    if( bOverlay )
    {
        var Request = JQGlobal.NewMessage();
        Request.ConfigType = configType;
        Request.ModuleID    = moduleName;
        if( sConfigID != "" ) Request.ConfigID = sConfigID;
        var Return = JQGlobal.SendMessage( "CFG_ClearConfig", Request );
        if( Return.ErrorID != 0 )
            return;
    }

    var moduleConfig = {};
    switch( configType )
    {
    case "user":
        moduleConfig = this._moduleObjectUser[moduleName];
        break;
    case "machine":
        moduleConfig = this._moduleObjectMachine[moduleName];
        break;
    case "system":
        moduleConfig = this._moduleObjectSystem[moduleName];
        break;
    case "instrumentgroup":
        moduleConfig = this._moduleObjectIG[moduleName];
        break;
    }

    var tableConfig = this.myObjectToTable( moduleConfig, configType, moduleName );
    if( tableConfig == null || tableConfig.getRecordCount()==0 )
        return;

    var Request = JQGlobal.NewMessage();
    Request.ConfigType = configType;
    Request.ModuleID   = moduleName;
    Request.ConfigInfo = tableConfig;
    var Return = JQGlobal.SendMessage( "CFG_SetConfig", Request );

    if( Return.ErrorID != 0 )
        return;
}

////////////////////////////////////////
//将配置从数据表转换成内部对象(下载使用)
UniformConfig.myTableToObject = function( tableConfig, configType )
{
    var moduleConfig = {};
    if( configType!="instrumentgroup" )
    {
        for( var indexRecord=0; indexRecord<tableConfig.getRecordCount(); indexRecord++ )
        {
            var name      = tableConfig.getValue( indexRecord, "ParamCode" );
            var valueSave = tableConfig.getValue( indexRecord, "ParamValue" );
            var value     = Json.parseMember( valueSave );
            
            moduleConfig[name] = value;
        }
    }
    else
    {//IG(或instrumentgroup)
        for( var indexRecord=0; indexRecord<tableConfig.getRecordCount(); indexRecord++ )
        {
            var name      = tableConfig.getValue( indexRecord, "ParamCode" );
            var valueSave = tableConfig.getValue( indexRecord, "ParamValue" );
            var configID  = tableConfig.getValue( indexRecord, "ConfigID", "" );
            var value     = Json.parseMember( valueSave );
            
            if( moduleConfig[configID] == null )
                moduleConfig[configID] = {};
            moduleConfig[configID][name] = value;
        }
    }
    return moduleConfig;
}

//将配置从内部对象转换成数据表(保存使用)
UniformConfig.myObjectToTable = function( moduleConfig, configType, moduleName )
{
    if( configType!="instrumentgroup" )
    {
        var tableConfig = new jsTable( [["ParamCode","ParamValue"],["S","S"]] );
        for( var name in moduleConfig )
        {
            if( typeof moduleConfig[name] == "function" )
                continue;

            var value     = moduleConfig[name];
            var valueSave = Json.jsonMember( value );

            var indexRecord = tableConfig.addRecord( );
            
            tableConfig.setValue( indexRecord, "ParamCode",  name );
            tableConfig.setValue( indexRecord, "ParamValue", valueSave );
            
        }
    }
    else
    {//IG(或instrumentgroup)
        if( this._moduleChangeIG2[moduleName] == null )
            this._moduleChangeIG2[moduleName] = {};
        moduleChange = this._moduleChangeIG2[moduleName];

        var tableConfig = new jsTable( [["ParamCode","ParamValue","ConfigID"],["S","S","S"]] );
        for( var nInstrumentGroupID in moduleConfig )
        {
            if( typeof moduleConfig[nInstrumentGroupID] == "function" )
                continue;
            if( moduleChange[nInstrumentGroupID] !== true )
                continue;

            var moduleConfig2 = moduleConfig[nInstrumentGroupID];
            for( var name in moduleConfig2 )
            {
                var value     = moduleConfig2[name];
                var valueSave = Json.jsonMember( value );

                var indexRecord = tableConfig.addRecord( );
                tableConfig.setValue( indexRecord, "ParamCode",  name );
                tableConfig.setValue( indexRecord, "ParamValue", valueSave );
                tableConfig.setValue( indexRecord, "ConfigID",   nInstrumentGroupID );
            }
        }
    }
    
    return tableConfig;
}
//通过通用查询获取基础配置信息
UniformConfig._CommonQuerySysConfig = function (sConfigType, sConfigID, sModuleID, sParamCode)
{

    var tableSelect = new jsTable([["TableName", "FieldName", "FieldNameAS", "AggregateFunction"], ["S", "S", "S", "S"]]);
    var tableFrom = new jsTable([["TableName", "JoinMode", "JoinFieldName", "JoinTargetTableName", "JoinTargetFieldName"], ["S", "S", "S", "S", "S"]]);
    var tableWhere = new jsTable([["TableName", "FieldName", "CmpOperator", "FieldValue1", "FieldValue2"], ["S", "S", "S", "S", "S"]]);
    var tableOrderBy = new jsTable([["TableName", "FieldName", "SortOrder"], ["S", "S", "S"]]);
    var nSelect = tableSelect.addRecord();
    tableSelect.setValue(nSelect, "TableName", "SYS_Config");
    tableSelect.setValue(nSelect, "FieldName", "ParamValue");
    var nFrom = tableFrom.addRecord();
    tableFrom.setValue(nSelect, "TableName", "SYS_Config");
    var nRecNo
    nRecNo = tableWhere.addRecord();
    tableWhere.setValue(nRecNo, "TableName", "SYS_Config");
    tableWhere.setValue(nRecNo, "FieldName", "ConfigID");
    tableWhere.setValue(nRecNo, "CmpOperator", "=");
    tableWhere.setValue(nRecNo, "FieldValue1", sConfigID);
    nRecNo = tableWhere.addRecord();
    tableWhere.setValue(nRecNo, "TableName", "SYS_Config");
    tableWhere.setValue(nRecNo, "FieldName", "ModuleID");
    tableWhere.setValue(nRecNo, "CmpOperator", "=");
    tableWhere.setValue(nRecNo, "FieldValue1", sModuleID);
    nRecNo = tableWhere.addRecord();
    tableWhere.setValue(nRecNo, "TableName", "SYS_Config");
    tableWhere.setValue(nRecNo, "FieldName", "ParamCode");
    tableWhere.setValue(nRecNo, "CmpOperator", "=");
    tableWhere.setValue(nRecNo, "FieldValue1", sParamCode);
    nRecNo = tableWhere.addRecord();
    tableWhere.setValue(nRecNo, "TableName", "SYS_Config");
    tableWhere.setValue(nRecNo, "FieldName", "ConfigType");
    tableWhere.setValue(nRecNo, "CmpOperator", "=");
    tableWhere.setValue(nRecNo, "FieldValue1", sConfigType);
    var Request = new JQGlobal.NewMessage();
    Request.Select = tableSelect;
    Request.From = tableFrom;
    Request.Where = tableWhere;
    //向接口发送请求体
    var Return = JQGlobal.SendMessage("DB_CommonQuery", Request);
    if (Return.ErrorID != 0)
    {
        return "0";
    }
    else
    {
        var UserTable = Return.Table0;
        if (UserTable.getRecordCount() > 0)
        {
            return UserTable.getValue(0, "ParamValue");
        }
        return "0";
    }

}