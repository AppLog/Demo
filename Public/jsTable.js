// jsTable.js 文件
// JavaScript数据表类(仅TOP层定义)

//  参数:
//  arrayInitData:表初始化数据  示例为:[["A","B"],["I","S"],[1,"aaa"],[2,"bbb"]]
//  注意: 为了加快速度,jsTable直接引用arrayInitData的二级(内部)数组,所以创建完后外部不应对二级数组进行修改
//
//表支持的数据类型:
// 编号  代码  名称       支持Null代码  
//   0     I    整数型       IN
//   1     F    浮点型       FN
//   2     S    字串型       SN
//   3     B    逻辑型       BN
//   4     D    日期型       DN
//
function jsTable( arrayInitData )
{
    //各字段名称 字串型数组    this._fieldsTitle = [];
    
    //各字段类型 整数型数组	this._fieldsType = [];
	
	//字字段值是否支持Null 逻辑型数组	this._allowNull = [];
	
	//各记录数据(二维数组)
	this._rowsData = [];
	
	//关键字字段 FieldNo列表
	this._fieldsKey = [];

    /////////////////////////////////////////////////////////
	//字段名查找对象 存入的名称为小写对象
	this._fieldFindIndex = {};
	
	//关键字查找对象	this._keyFindIndex = {};
	
	if(arrayInitData && arrayInitData.length >= 2)//判断jstable数组的不能不存在 并且 长度不能小于2
	{
        this._fieldsTitle = arrayInitData[0];//jstable字段名称
        var arrayType     = arrayInitData[1];//jstable字段类型
        
    	if( this._fieldsTitle.length != arrayType.length )//字段个数不等于给它设置的类型的个数    	    throw "DataType length invalidate!";
    	
    	//将各字段加入到 字段名查找对象        for( var indexCol=0; indexCol<this._fieldsTitle.length; indexCol++ )
        {
            var FieldName = this._fieldsTitle[indexCol];
            
            //检查字段名是否有效
            if( !this.myCheckFieldName( FieldName ) )
                throw "Invalid FieldName!";
                
            //字段名是否重复            if( this.getFieldNo( FieldName ) >= 0 )
                throw "Field Repeated!";
            
            this._fieldFindIndex[FieldName.toLowerCase()] = indexCol;
        }
    	    
        for( var indexCol=0; indexCol<arrayType.length; indexCol++ )
        {
            var typeField = arrayType[indexCol];
            if( !this.myCheckDataType(typeField)  )
                throw "Invalid Field Type!";
            
            this._fieldsType.push( this.myGetType(typeField) );
            this._allowNull .push( this.myGetAllowNull(typeField) )
        }

        for(var indexRow=2; indexRow<arrayInitData.length; indexRow++)
        {
            if( this._fieldsTitle.length != arrayInitData[indexRow].length )
                throw "RowData length invalidate!"

            this._rowsData[indexRow-2] = arrayInitData[indexRow];
        }
	}
}

////////////////////////////////////////////////////////////////////////////////
//jsTable表结构操作
//获取字段个数
jsTable.prototype.getFieldCount = function()
{
    return this._fieldsTitle.length;
}

//增加一字段 成功返回字段的编号,失败抛出异常
jsTable.prototype.addField = function( FieldName, typeField )
{
    //检查字段名是否有效
    if( !this.myCheckFieldName( FieldName ) )
        throw "Invalid FieldName!";
    //检查字段名是否重复
    if( this.getFieldNo( FieldName ) >= 0 )
        throw "FieldName is Exist!";
    if( !this.myCheckDataType( typeField ) )
        throw "Invalid Field Type!";

    var indexField = this._fieldsTitle.length;
    
    this._fieldsTitle[indexField] = FieldName;
    this._fieldsType [indexField] = this.myGetType(typeField);
    this._allowNull  [indexField] = this.myGetAllowNull(typeField);

 	//将新增字段加入到 字段名查找对象    this._fieldFindIndex[FieldName.toLowerCase()] = indexField;

   //修改数据区    var addValue = this.myGetDefaultValue(indexField);
    for( var indexRow = 0; indexRow < this._rowsData.length; indexRow++ )
        this._rowsData[indexRow].push( addValue );
        
    return indexField;
}

//删除一字段 成功返回true,,失败抛出异常
jsTable.prototype.deleteField = function( FieldID )
{  
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";
        
    this._fieldsTitle.splice( FieldID, 1 );
    this._fieldsType .splice( FieldID, 1 );
    this._allowNull  .splice( FieldID, 1 );
    
    for( var indexRow=0; indexRow<this._rowsData.length; indexRow++ )
        this._rowsData[indexRow].splice( FieldID, 1 );

	//重新将各字段加入到 字段名查找对象	this._fieldFindIndex = {};
    for( var indexCol=0; indexCol<this._fieldsTitle.length; indexCol++ )
        this._fieldFindIndex[this._fieldsTitle[indexCol].toLowerCase()] = indexCol;
        
    return true;
}

//增加一字段 成功返回字段的编号,失败抛出异常
jsTable.prototype.renameField = function( FieldID, newFieldName )
{
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";

    //如果相同则直接返回    if( this._fieldsTitle[FieldID] == newFieldName )
        return;
    
    //检查字段名是否有效
    if( !this.myCheckFieldName( newFieldName ) )
        throw "Invalid FieldName!";
    //检查字段名是否重复
    if( this.getFieldNo( newFieldName ) >= 0 )
        throw "FieldName is Exist!";

 	//删除旧的,增加新的
 	delete this._fieldFindIndex[this._fieldsTitle[FieldID]];
    this._fieldFindIndex[newFieldName.toLowerCase()] = FieldID;

    this._fieldsTitle[FieldID] = newFieldName;

    return FieldID;
}

//获得字段序号 找到返回对应序号(>=0),未找到返回-1
jsTable.prototype.getFieldNo = function( FieldName )
{
    var nFieldNo = this._fieldFindIndex[FieldName.toLowerCase()];
    if( nFieldNo == undefined )
        return -1;  
    return nFieldNo;        
}

//获得字段名jsTable.prototype.getFieldName = function( nFieldNo )
{
    if( nFieldNo < 0 || nFieldNo >= this._fieldsTitle.length )
    {
        throw "Invalid FieldId!";
        return "";
    }
        
    return this._fieldsTitle[nFieldNo];
}

//通过字段名或字段号得到字段类型jsTable.prototype.getFieldDataType = function( FieldID )
{
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";

    return this.myGetDataType(FieldID);
}

//通过一个字段名或字段号测试这个字段是否支持null
jsTable.prototype.isAllowNull = function(FieldID)
{
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";

    return this._allowNull[FieldID];
}

////////////////////////////////////////////////////////////////////////////////
//jsTable表数据操作
//清空所有的数据
jsTable.prototype.clearContent = function()
{
	//各记录数据(二维数组)
    this._rowsData = [];
	//关键字查找对象	this._keyFindIndex = {};
}

//增加一条空记录 返回所增加的记录的记录索引
jsTable.prototype.addRecord = function()
{
    var newRecord = [];
    for(var indexCol=0; indexCol<this._fieldsType.length; indexCol++)
        newRecord.push( this.myGetDefaultValue( indexCol ) );
        
    this._rowsData.push( newRecord );     
    return this._rowsData.length - 1;
}


//增加一条空记录 返回所增加的记录的记录索引
jsTable.prototype.insertRecord = function( nInsertRecNo )
{
    if( nInsertRecNo<0 )
        nInsertRecNo = 0;
    else if( nInsertRecNo>this._rowsData.length )
        nInsertRecNo = this._rowsData.length;

    var newRecord = [];
    for(var indexCol=0; indexCol<this._fieldsType.length; indexCol++)
        newRecord.push( this.myGetDefaultValue( indexCol ) );
        
    this._rowsData.splice( nInsertRecNo, 0, newRecord );     
    return nInsertRecNo;
}

//删除指定行的记录
jsTable.prototype.deleteRecord = function( nRecNo )
{
    if( nRecNo < 0 || nRecNo >= this._rowsData.length )
    {
        throw "Invalid nRecNo!";
        return false;
    }
    
    this._rowsData.splice( nRecNo, 1 );
    return true;
}

//克隆表结构
//说明:
//  1.不复制原表记录
//  2.不复制关键字索引信息
jsTable.prototype.clone = function( )
{
    var fieldsTitle = this._fieldsTitle.slice( 0 );
    var fieldsType  = [];
    for( var indexCol=0; indexCol<this._fieldsType.length; indexCol++ )
        fieldsType.push( this.myGetDataType( indexCol ) );

    var newTable = new jsTable( [ fieldsTitle, fieldsType ] );
    return newTable;
}

//复制表记录
//参数说明:
//  tableSource      : 源jsTable表对象
//  indexRecordArray : 需要复制的源表记录号列表
//                     可为空,为空复制源表所有记录
//  fieldNameArray   : 需要复制的字段名称列表
//                     可为空,为空复制共有字段(同名)
//说明:
//  目标表的结构必须已经创建,原有记录不清空
//  不能处理两表字段类型不同情况(即不实现类型转换),外部需保证这点
//  能正确处理两表字段Null属性不同情况
jsTable.prototype.copyRecord = function( tableSource, indexRecordArray, fieldNameArray )
{
    //本表各字段对应源表的字段号(-1未找到对应)
    var relationFieldNoList = [];
    
    //创建要复制的字段索引
    if( fieldNameArray != null )
    {
        for( var indexCol=0; indexCol<this._fieldsType.length; indexCol++ )
            relationFieldNoList.push( -1 );

        for( var index=0; index<fieldNameArray.length; index++ )
        {
            var nThisNo   = this.getFieldNo( fieldNameArray[index] );
            var nSourceNo = tableSource.getFieldNo( fieldNameArray[index] );
            
            if( nThisNo<0 || nSourceNo<0 )
                continue;

            relationFieldNoList[nThisNo] = nSourceNo;
        }
    }
    else
    {//复制共有字段
        for( var indexCol=0; indexCol<this._fieldsType.length; indexCol++ )
        {
            var nSourceNo = tableSource.getFieldNo( this._fieldsTitle[indexCol] );
            relationFieldNoList.push( nSourceNo );                
        }
    }
    
    //复制记录
    var index = 0;
    while( true )
    {
        if( indexRecordArray != null )
        {//指定的源表记录
            if( index >= indexRecordArray.length )
                break;
            var sourceRecord = tableSource._rowsData[indexRecordArray[index]];
        }
        else
        {//所有源表记录
            if( index >= tableSource._rowsData.length )
                break;
            var sourceRecord = tableSource._rowsData[index];
        }
        var newRecord    = [];

        for( var indexCol=0; indexCol<this._fieldsType.length; indexCol++ )
        {
            var nSourceNo = relationFieldNoList[indexCol];
        
            if( nSourceNo < 0 )
            {
                newRecord.push( this.myGetDefaultValue( indexCol ) );
            }
            else
            {
                var data = sourceRecord[nSourceNo];
                if( this._allowNull[indexCol] )
                    newRecord.push( data );
                else if( data != null )
                    newRecord.push( data );
                else
                    newRecord.push( this.myGetDefaultValue( indexCol ) );
            }
        }
            
        this._rowsData.push( newRecord );
        index++;
    }
}

//获得Table的当前最大行数jsTable.prototype.getRecordCount = function()
{
    return this._rowsData.length;
}

//通过指定的记录号和字段获得指定位置的值//  defaultValue:值为null时的替代值jsTable.prototype.getValue = function( nRecNo, FieldID, defaultValue )
{
    if( nRecNo < 0 || nRecNo >= this._rowsData.length )
        throw "Invalid nRecNo!";
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";
        
    if( this._rowsData[nRecNo][FieldID] == null )
        return defaultValue==null ? null : defaultValue;
    return this._rowsData[nRecNo][FieldID];    
}

//通过指定的记录号和字段获得指定位置的值(直接字段位置方式)//  defaultValue:值为null时的替代值jsTable.prototype.getValue2 = function( indexRecord, indexField, defaultValue )
{
    if( indexRecord < 0 || indexRecord >= this._nRecordCount )
        throw "Invalid indexRecord!";
    if( indexField < 0 || indexField >= this._nFieldCount )
        throw "Invalid FieldId!";
    
    var value = this._rowsData[indexRecord][indexField];
    if( value == null && defaultValue != null )
        return defaultValue;
    return value;
}

//设置指定位置的值jsTable.prototype.setValue = function( nRecNo, FieldID, value )
{
    if( nRecNo < 0 || nRecNo >= this._rowsData.length )
        throw "Invalid nRecNo!";
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";

    //通用类型转换的做法
    if( value == null )
    {
        this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
    }
    else
    {
        switch( this._fieldsType[FieldID] )
        {
        case 0: //整数型            if( value.MAX_VALUE !== undefined )
            {//源/目标类型相同
                this._rowsData[nRecNo][FieldID] = Math.floor( value );
            }
            else if( value === "" )            {//转换成null或默认值                this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
            }            else
            {//其它类型
                var data = parseInt( value );                if( isNaN(data) ) data = 0;                this._rowsData[nRecNo][FieldID] = data;
            }
            break;
        case 1: //浮点型            if( value.MAX_VALUE !== undefined )
            {//源/目标类型相同
                this._rowsData[nRecNo][FieldID] = value;
            }
            else if( value === "" )            {//转换成null或默认值                this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
            }            else            {//其它类型                var data = parseFloat( value );                if( isNaN(data) ) data = 0;                this._rowsData[nRecNo][FieldID] = data;
            }
            break;
        case 2: //字串型            if( value.replace !== undefined )            {//源/目标类型相同                this._rowsData[nRecNo][FieldID] = value;
            }            else            {//其它类型                this._rowsData[nRecNo][FieldID] = value.toString();
            }
            break;
        case 3: //逻辑型            if( value === "" )            {//转换成null或默认值                this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
            }            else            {//同类型 或 其它类型                this._rowsData[nRecNo][FieldID] = ( value === true || value === "true" || value===1 || value === "1" );
            }
            break;
        case 4: //日期型            if( value.getMonth !== undefined )
            {//源/目标类型相同
                this._rowsData[nRecNo][FieldID] = value;
            }
            else if( value === "" )            {//转换成null或默认值                this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
            }            else
            {//其它类型
                this._rowsData[nRecNo][FieldID] = Date.parse( value );
            }
        }
    }

    return true;
}

//判断指定记录行的指定名字或者字段号的值是否可以为null;
jsTable.prototype.isNullValue = function( nRecNo, FieldID )
{
    if( nRecNo < 0 || nRecNo >= this._rowsData.length )
        throw "Invalid nRecNo!";
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";

    return this._rowsData[nRecNo][FieldID] == null;
}

//设置指定记录数的指定字段名或者是字段号的值jsTable.prototype.setNullValue = function( nRecNo, FieldID )
{
    if( nRecNo < 0 || nRecNo >= this._rowsData.length )
        throw "Invalid nRecNo!";
    if( typeof FieldID == "string" )
        FieldID = this.getFieldNo(FieldID);
    if( FieldID < 0 || FieldID >= this._fieldsTitle.length )
        throw "Invalid FieldId!";
   
    this._rowsData[nRecNo][FieldID] = this.myGetDefaultValue( FieldID );
}

////////////////////////////////////////////////////////////////////////////////
//jsTable表高级操作

//重建关键字查找对象//  参数为关键字列表 格式如:"SampleNo,TestItemID"
//  fieldsKeyName可不传,表示按原些设定的关键字//  注意: 在修改过程中是不会自动调整关键字查找对象,
//        所以增删记录或修改关键字字段的值后,如果要查找,应先重键关键字jsTable.prototype.createKey = function( fieldsKeyName )
{
    //重新设置关键字    if( fieldsKeyName != undefined )
    {
        this._fieldsKey = [];
        this._keyFindIndex = {};
        
        var arrayKeyName = fieldsKeyName.split( "," );
        for( var index=0; index<arrayKeyName.length; index++ )
        {
            var indexKey = this.getFieldNo( arrayKeyName[index] );
            if( indexKey<0 )
                throw "Invalid Key Field Name!";
            //检查是否重复            for( var n=0; n<this._fieldsKey.length; n++ )
            {
                if( this._fieldsKey[n] == indexKey )
                    throw "Key Field Repeated Error!";
            }
            //加入this._fieldsKey
            this._fieldsKey.push( indexKey );
        }
    }
    
    //重建关键字查找对象    this._keyFindIndex = {};
    if( this._fieldsKey.length > 0 )
    {
        for( var indexRow = 0; indexRow<this._rowsData.length; indexRow++ )
        {
            var rowData = this._rowsData[indexRow];
            var strKey = this.myMakeKey( rowData );
            this._keyFindIndex[strKey] = indexRow;
        }
    }
}

//按关键字查找记录 返回记录号,未找到返回-1
jsTable.prototype.findRow = function( )
{
    if( this._fieldsKey.length < 0 )
        throw "Key not created!";
    if( arguments.length != this._fieldsKey.length )
        throw "Find Key Number not matching Key Number!";
    
    //转换成字符串数组    
    var arrayKey = [];
    for( var index=0; index<arguments.length; index++ )
        arrayKey.push( arguments[index] == null ? "null" : arguments[index].toString() );
    
    //使用__连接起来成为索引键    
    var strKey = arrayKey.join("__");
    //查找记录索引
    var findRowNo = this._keyFindIndex[strKey];
    if( findRowNo == undefined )
        return -1;
    return findRowNo;
}

//记录排序
jsTable.prototype.sortRecord = function( fieldSortName )
{
    var arrayIndex = [];

    //重新设置关键字    var arraySortName = fieldSortName.split( "," );
    for( var index=0; index<arraySortName.length; index++ )
    {
        var indexKey = this.getFieldNo( arraySortName[index] );
        if( indexKey<0 )
            throw "Invalid Key Field Name!";
        //检查是否重复        for( var n=0; n<this._fieldsKey.length; n++ )
        {
            if( this._fieldsKey[n] == indexKey )
                throw "Key Field Repeated Error!";
        }
        arrayIndex.push( indexKey );
    }
 
    var arrayFun   = [];
   //布尔 数值 日期型
    for( var index=0; index<arrayIndex.length; index++ )
    {
        //字串类型及非字串类型
        if( this._allowNull[arrayIndex[index]] )
        {
            switch( this._fieldsType[arrayIndex[index]] )
            {
            case 0:
            case 1:
                arrayFun.push( this.my_SORT_NumberNull );
                break;
            case 2:
                arrayFun.push( this.my_SORT_StringNull );
                break;
            case 3:
                arrayFun.push( this.my_SORT_BoolNull );
                break;
            case 4:
                arrayFun.push( this.my_SORT_DateNull );
                break;
            }
        }
        else
        {
            switch( this._fieldsType[arrayIndex[index]] )
            {
            case 0:
            case 1:
                arrayFun.push( this.my_SORT_Number );
                break;
            case 2:
                arrayFun.push( this.my_SORT_String );
                break;
            case 3:
                arrayFun.push( this.my_SORT_Bool );
                break;
            case 4:
                arrayFun.push( this.my_SORT_Date );
                break;
            }
        }
    }

    this._rowsData.sort(
        function( rows1, rows2 )
        {
            for( var index=0; index<arrayIndex.length; index++ )
            {
                var indexData = arrayIndex[index];
                var nComp = arrayFun[index]( rows1[indexData], rows2[indexData] );
                if( nComp != 0 ) return nComp;
            }
            return 0;
        }
    );
}

jsTable.prototype.my_SORT_Number = function( data1, data2 )
{
    return data1 - data2;
}
jsTable.prototype.my_SORT_String = function( data1, data2 )
{
    return data1.localeCompare( data2 );
}
jsTable.prototype.my_SORT_Bool = function( data1, data2 )
{
    return data1 - data2;
}
jsTable.prototype.my_SORT_Date = function( data1, data2 )
{
    return data1 - data2;
}
jsTable.prototype.my_SORT_NumberNull = function( data1, data2 )
{
    if( data1 == null ) data1 = 0;
    if( data2 == null ) data2 = 0;
    return data1 - data2;
}
jsTable.prototype.my_SORT_StringNull = function( data1, data2 )
{
    if( data1 == null ) data1 = "";
    if( data2 == null ) data2 = "";
    return data1.localeCompare( data2 );
}
jsTable.prototype.my_SORT_BoolNull = function( data1, data2 )
{
    if( data1 == null ) data1 = false;
    if( data2 == null ) data2 = false;
    return data1 - data2;
}
jsTable.prototype.my_SORT_DateNull = function( data1, data2 )
{
    if( data1 == null ) data1 = 0;
    if( data2 == null ) data2 = 0;
    return data1 - data2;
}

//将jsTable对象转化为JSON字符串jsTable.prototype.jsonString = function()
{
    //JSON表头
    Json.jsonRaw( "new jsTable([" );
    
    //第一行:标题行数据    Json.jsonArray( this._fieldsTitle );
    //第二行:类型行数据    Json.jsonRaw( ",[" );
    for( var indexCol=0; indexCol<this._fieldsType.length; indexCol++ )
    {
        if( indexCol != 0 )
            Json.jsonRaw( "," );
        Json.jsonString( this.myGetDataType(indexCol) );
    }
    Json.jsonRaw( "]" );
    //第3至N+3行:记录数据
    for( var indexRow=0; indexRow<this._rowsData.length; indexRow++ )
    {
        Json.jsonRaw( "," );
        Json.jsonArray( this._rowsData[indexRow] );
    }
    
    //JSON表尾
    Json.jsonRaw( "])" );
}

////////////////////////////////////////////////////////////////////////////////
//jsTable私有函数

//检查数据类型代码是否合法 返回false表示非法
jsTable.prototype.myCheckDataType = function( typeField )
{
    return /^[IFSBD]N?$/.test( typeField );
}

//获得数据类型代码的对应数据类型编号jsTable.prototype.myGetType = function( typeField )
{
    switch( typeField.charAt(0) )
    {
    case "I":
        return 0;   //整数型    case "F":
        return 1;   //浮点型    case "S":
        return 2;   //字串型    case "B":
        return 3;   //逻辑型    case "D":
        return 4;   //日期型    default:
        throw "Invalid Field Type!"        
    }
}

//获得数据类型代码的对应数据是否可为空
jsTable.prototype.myGetAllowNull = function( typeField )
{
    return typeField.charAt(1) === "N";
}

//获得指定字段的数据类型代码jsTable.prototype.myGetDataType = function( nFieldNo )
{
    return "IFSBD".charAt( this._fieldsType[nFieldNo] ) + (this._allowNull[nFieldNo] ? "N" : "");
}

//获得默认值jsTable.prototype.myGetDefaultValue = function( nFieldNo )
{
    if( this._allowNull[nFieldNo] )
        return null;
    return [0, 0.0, "", false, new Date(2000,1,1)] [this._fieldsType[nFieldNo]];
}

//检查字段名是否有效 返回false表示字段名无效jsTable.prototype.myCheckFieldName = function( FieldName )
{
    return /^[a-zA-z_][a-zA-z0-9_]*$/.test( FieldName );
}

//生成关键字查找串
jsTable.prototype.myMakeKey = function( rowData )
{
    var arrayFindKey = [];
    for( var index=0; index<this._fieldsKey.length; index++ )
    {
        var data = rowData[this._fieldsKey[index]];
        arrayFindKey.push( data==null ? "null" : data.toString() );
    }
    
    return arrayFindKey.join("__");
}
