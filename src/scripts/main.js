/**
 * Created by Jake on 1/5 0005.
 */

// 运行平台设置
var platform = "pc";
var appName = "eBaseFront";

require.config({
    baseUrl: "js", // js根路径
    packages: [
        {
            name: 'pc',// platform package name
            location: 'platform/pc',  // default 'packagename'
            main: 'app'                // default 'main'
        },
        {
            name: 'mobile',// platform package name
            location: 'platform/mobile',  // default 'packagename'
            main: 'app'                // default 'main'
        }
    ]
});

// 启动程序
require([
    platform,
    "config",
    "services/common-util",
    "services/common-rest",
    "services/common-service",
    "directives/common-directive",
    "filters/common-filter"
], function (app) {
    app.start();
});


/**
 * 实现service继承
 * <li>
 *     define(['parentService'], function (parentService) {
 *       var subService = function ($rootScope) {
 *          return serviceExtend(parentService, {
 *              fun1: ..,
 *          })
 *       }
 *       app.factory("subService", [subService]);
 *      });
 * </li>
 * @param parent 父service定义
 * @param instance 子service定义
 */
function serviceExtend(parent, instance) {
    return extend(
        parent.apply(serviceExtend.caller.arguments),
        instance);
}

var Interface = {};
/**
 * 定义接口
 * @param defaults 调用默认的方法(未实现的情况下)
 * @returns {proxy}
 */
Interface.create = function(defaults) {
    var proxy = function() {
        return proxy.real.apply(this, arguments);
    }
    proxy.prototype.real = defaults || function(){};
    return proxy;
}

// 继承的工具方法
function extend(dst) {
    var objs = [].slice.call(arguments, 1);
    for (var i = 0, ii = objs.length; i < ii; ++i) {
        var obj = objs[i];
        if (obj === null ||
        !(typeof obj === 'object' || typeof obj === 'function'))
            continue;
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
            var key = keys[j];
            var src = obj[key];
            var dest = dst[key];
            if (dest && dest.prototype.real) {
                // 使用代理方法
                dest['real'] = src;
            } else {
                dst[key] = src;
            }
        }
    }
    return dst;
}