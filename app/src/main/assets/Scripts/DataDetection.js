var valuecode, valuecname;
/// <summary>
/// 根据id查找对象
/// </summary>
/// <param name="id">id名称</param>
/// <param name="parent">容器对象</param>
/// <returns>页面元素对象</returns>
function $ID(id, parent) {
    parent = (parent ? (parent.document ? parent.document : parent) : document);
    return parent.getElementById(id);
}

/// <summary>
/// 根据name查找对象$("input[name='detail_isprovince']")
/// </summary>
/// <param name="name">name名称</param>
/// <param name="parent">容器对象</param>
/// <returns>名称对象集合</returns>
function $N(name, parent) {
    parent = (parent ? (parent.document ? parent.document : parent) : document);
    return parent.getElementsByName(name);
}

/// <summary>
/// 根据name查找对象
/// </summary>
/// <param name="name">name名称</param>
/// <param name="parent">容器对象</param>
/// <returns>名称对象集合</returns>
function $NJ(name) {
    return $("input[name='" + name + "']");
}
/// <summary>
/// 根据name查找对象
/// </summary>
/// <param name="name">name名称</param>
/// <param name="parent">容器对象</param>
/// <returns>名称对象集合</returns>
function $NJS(name) {
    return $("select[name='" + name + "']");
}
/* 获取随机数*/
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}
function dialog(msg, t) {
    $.dialog({
        id: "msg",
        title: t,
        icon: 'error.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { }
    });
}
function dialogts(msg, t) {
    $.dialog({
        id: "msg",
        title: t,
        icon: 'confirm.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { }
    });
}
/// <summary>
/// 弹出提示框
/// </summary>
/// <param name="msg">信息</param>
/// <param name="control">控件</param>
function dialogAlert(msg, control) {

    $.dialog({
        title: "温馨提示",
        icon: 'error.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (control != null) setFocus(control); }
    });
}
/// <summary>
/// 弹出提示框
/// </summary>
/// <param name="msg">信息</param>
/// <param name="control">控件</param>
function dialogAlertTX(msg, control) {

    $.dialog({
        title: "温馨提示",
        icon: 'confirm.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (control != null) setFocus(control); }
    });
}
function dialogAlertOk(msg, control) {

    $.dialog({
        title: "温馨提示",
        icon: 'success.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (control != null) setFocus(control); }
    });
}

/// <summary>
/// 如果可以获得焦点, 让控件获得焦点
/// </summary>
/// <param name="control">控件对象</param>
function setFocus(control) {
    control.focus
    try {
        control.focus();
        control.select();
    }
    catch (e) {
    }
}

/// <summary>
/// 弹出提示框
/// </summary>
/// <param name="msg">信息</param>
/// <param name="control">控件</param>
function dialogAlert2(msg, control) {
    var api = frameElement.api;
    W = api.opener;
    W.$.dialog({
        id: "alert",
        title: "温馨提示",
        icon: 'error.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (control != null) setFocus(control); }
    });
}
function dialogAlert4(msg, URL) {
    var api = frameElement.api;
    W = api.opener;
    W.dialogOk(msg, '温馨提示', URL);
}
var api1;
var ccode;
function FAlertGo(msg, url) {
    $.dialog.alert(msg, function () {
        if (api1 != null) {
            api1.close(); //关闭弹出窗口
            location.href = url;
        }
    }).title("温馨提示");
}
function dialogOk(msg, t, gourl) {
    $.dialog({
        title: t,
        icon: 'success.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (gourl != "") location.href = gourl }
    });


}
function dialogError(msg, t, gourl) {
    $.dialog({
        title: t,
        icon: 'error.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (gourl != "") location.href = gourl }
    });


}

function dialogOk1(msg, t, gourl) {
    $.dialog({
        title: t,
        icon: 'success.gif',
        lock: true,
        content: "<font color='red'>" + msg + "<font>",
        ok: function () { if (gourl != "") window.open(gourl) }
    });
}