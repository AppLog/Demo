// json.js


var Json = 
{
    a : null,    //序列化数组
    k : "",     //主对象 分量名称
    v : null,   //主对象 分量值
    t : "",     //主对象 分量类型
    b : false,  //主对象
    m :         //转义符替换对象
    {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    }
};

//序列化成JSON字串
//参数说明:
//msg    : 发送或接收对象(必须是对象类型)
//返回值 : JSON字串
Json.toString = function( msg )
{
    this.a = ['{'];
    this.b = true;

    for( this.k in msg )
    {
        if( !msg.hasOwnProperty(this.k) )
            continue;
            
        this.v = msg[this.k];
        this.t = typeof this.v;
        
        if( this.t==="function" || this.t==="undefined" )
            continue;
        
        //分隔符及成员名称
        if( this.b ) this.b = false; else this.a.push(',');
        this.p( this.k );
        this.a.push( ':' );
        
        if( this.v == null )
            this.a.push( "null" );
        else if( this.v.join == null )  //普通数据
            this.p( this.v );
        else                            //数组
            this.jsonArray( this.v );
    }

    this.a.push('}');
    
    var str = this.a.join("");
    this.a = null;
    this.v = null;
    return str;
}

//反序列化成JSON对象
//参数说明:
//str    : JSON字串
//返回值 : JSON对象
Json.fromString = function( str )
{
//  if (/^{("(\\.|[^"\\\n\r])*?"|[,:\(\)\[\]0-9.\-+Eaeflnr-u \n\r\t]|[new jsTable|new Date])+?}$/.test(str))
    try 
    {
        var obj = eval( '(' + str + ')' );
        return obj;
    }
    catch( e )
    {
        throw new SyntaxError("反序列化异常1:" + e);
    }
}

////////////////////////////////////////////////////////////
//序列化JSON数组(序列化过程中,外部可调用)
Json.jsonArray = function( v )
{
    //起始符
    this.a.push( '[' );
    
    l = v.length;
    //加入第一个成员
    if( l > 0 ) this.p( v[0] );
    //加入第二个成员及以后的成员
    for( var i = 1; i < l; i++)
    {
        this.a.push( ',' );
        this.p( v[i] );
    }
    
    //结束符
    this.a.push( ']' );
}

Json.jsonRaw = function( str )
{
    this.a.push( str );
}

Json.jsonString = function( str )
{
    if (/["\\\x00-\x1f]/.test(str))
    {
        this.a.push( '"' + str.replace(/([\x00-\x1f\\"])/g,
            function (a, b)
            {
                var c = Json.m[b];
                if (c) return c;
                c = b.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }
        ) + '"' );
    }
    else
        this.a.push( '"' + str + '"' );
}

////////////////////////////////////////////////////////////
//序列化/反序列化 成员对象

Json.jsonMember = function( v )
{
    this.a = [];
    this.v = v;

    if( this.v == null )
        this.a.push( "null" );
    else if( this.v.join == null )  //普通数据
        this.p( this.v );
    else                            //数组
        this.jsonArray( this.v );

    var str = this.a.join("");
    this.a = null;
    this.v = null;
    return str;
}

Json.parseMember = function (str)
{
    try
    {
        if (/^("(\\.|[^"\\\n\r])*?"|[,:\(\)\[\]0-9.\-+Eaeflnr-u \n\r\t]|[new jsTable|new Date])+?$/.
            test(str))
        {
            var obj = eval('(' + str + ')');
            return obj;
        }
    }
    catch (e)
    {
    }
    throw new SyntaxError("反序列化失败");
}

////////////////////////////////////////////////////////////
//内部私有函数
Json.p = function( v )
{
    if( v == null )
    {
        this.a.push( "null" );
        return;
    }
    
    //序列化基本对象 : 布尔型 数值型 字串型 日期型 数据表
    switch( typeof v )
    {
    case 'boolean': //布尔型
        this.a.push( String( v ) );
        break;
    case 'number':  //数值型
        this.a.push( isFinite( v ) ? String( v ) : "null" );
        break;
    case 'string':  //字串型
        if (/["\\\x00-\x1f]/.test(v))
        {
            this.a.push( '"' + v.replace(/([\x00-\x1f\\"])/g,
                function (a, b)
                {
                    var c = Json.m[b];
                    if (c) return c;
                    c = b.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }
            ) + '"' );
        }
        else
            this.a.push( '"' + v + '"' );
        break;
    case 'object'://对象型
        if( v.getFullYear != null )
        {//日期型
            this.a.push( 'new Date(' + 
                    v.getFullYear() + ',' +
                    v.getMonth()    + ',' +
                    v.getDate()     + ',' +
                    v.getHours()    + ',' +
                    v.getMinutes()  + ',' +
                    v.getSeconds()  + ')' );
        }
        else if( v.getRecordCount != null )
        {//数据表
            v.jsonString();
        }
        else
            this.a.push( "null" );
        break;
    default:
        this.a.push( "null" );
    }
}

