// XMLHttp.js// XMLHttp类构造函数(仅TOP层定义)
/**
 * XMLHttp类构造函数.
 * 
 * @param owner {Object} 本对象所属的对象
 */
function XMLHttp(owner)
{
    if (window.ActiveXObject)
        this._xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    else
        this._xmlHttp = new XMLHttpRequest();

    this._async = true;
    
    //XMLHttp的事件
    this.owner = owner;
    //状态改变事件  参数:this
    //this.onreadystatechange = null;
    //成功返回事件  参数:this
    this.onsuccess = null;
    //异常返回事件  参数:this
    this.onerror = null;
    
    //XMLHttp的状态属性
    this.status = 0;
    this.statusText = undefined;
    this.readyState = undefined;
    
    //XMLHttp的高级属性
    this.responseText = undefined;

    var THIS = this;
    this._xmlHttp.onreadystatechange = function()
    {
        THIS._handleStateChange();
    }
}

XMLHttp.prototype.destroy = function()
{
    if( this._xmlHttp != null )
    {
        delete this._xmlHttp;
        this._xmlHttp = null;        
    }

    this.onsuccess = null;
    this.onerror = null;
}

XMLHttp.prototype.abort = function XMLHttp_abort()
{
    this._xmlHttp.abort();
}
XMLHttp.prototype.getAllResponseHeaders = function XMLHttp_getAllResponseHeaders()
{
    return this._xmlHttp.getAllResponseHeaders();
}
XMLHttp.prototype.getResponseHeader = function XMLHttp_getResponseHeader( header )
{
    return this._xmlHttp.getResponseHeader( header );
}
XMLHttp.prototype.open = function XMLHttp_open( method, url, async )
{
    this._xmlHttp.open( method, url, async );
    this._async = async;
}
XMLHttp.prototype.send = function XMLHttp_send( content )
{
    this._xmlHttp.send( content );
    
    if( this._async === false )
    {//同步方式
        //更新XMLHttp的状态属性
        this.readyState = this._xmlHttp.readyState;
        this.status = this._xmlHttp.status;
        this.statusText = this._xmlHttp.statusText;

        //XMLHttp的高级属性
        this.responseText = this._xmlHttp.responseText;
    }
}
XMLHttp.setRequestHeader = function XMLHttp_setRequestHeader( header, value )
{
    this._xmlHttp.setRequestHeader( header, value );
}
XMLHttp.prototype._handleStateChange = function XMLHttp__handleStateChange()
{
    if( this._async === false )
        return;

    this.readyState   = 0;
    this.status       = 0;
    this.statusText   = "";
    this.responseText = "";

    try
    {
        //更新XMLHttp的状态属性
        this.readyState = this._xmlHttp.readyState;
        
        if( this.readyState === 4 )
        {
            this.status = this._xmlHttp.status;
            this.statusText = this._xmlHttp.statusText;

            //XMLHttp的高级属性
            this.responseText = this._xmlHttp.responseText;
        }
    }
    catch( e )
    {
    }

    //回调
    //Global.doCallBack( this.owner, this.onreadystatechange, this );
        
    if( this.readyState === 4 )
    {
        //去除为0的无效状态(YGF 2007.8.2)
        if( 0 == this._xmlHttp.status )
            return;
            
        switch( this._xmlHttp.status )
        {
        case 200: //OK
            JQGlobal.doCallBack( this.owner, this.onsuccess, this );
            break;                 
        case 403: //Forbidden
        case 404: //Not Found
        case 503: //Service Unavailable
        case 12029: //在网络线未连接时产生的错误
        case 12152: //在应用服务器重新发布时产生的错误
            JQGlobal.doCallBack(this.owner, this.onerror, this);
            break;                 

        case 100: //Continue
        case 101: //Switching protocols
        case 201: //Created
        case 202: //Accepted
        case 203: //Non-Authoritative Information
        case 204: //No Content
        case 205: //Reset Content
        case 206: //Partial Content
        case 300: //Multiple Choices
        case 301: //Moved Permanently
        case 302: //Found
        case 303: //See Other
        case 304: //Not Modified
        case 305: //Use Proxy
        case 307: //Temporary Redirect
        case 400: //Bad Request
        case 401: //Unauthorized
        case 402: //Payment Required
        case 405: //Method Not Allowed
        case 406: //Not Acceptable
        case 407: //Proxy Authentication Required
        case 408: //Request Timeout
        case 409: //Conflict
        case 410: //Gone
        case 411: //Length Required
        case 412: //Precondition Failed
        case 413: //Request Entity Too Large
        case 414: //Request-URI Too Long
        case 415: //Unsupported Media Type
        case 416: //Requested Range Not Suitable
        case 417: //Expectation Failed
        case 500: //Internal Server Error
        case 501: //Not Implemented
        case 502: //Bad Gateway
        case 503: //Service Unavailable
        case 504: //Gateway Timeout
        case 505: //HTTP Version Not Supported
        default:
            alert( "未知错误:[" + this.statusText + "]");
            break;                 
        }
   }
}
