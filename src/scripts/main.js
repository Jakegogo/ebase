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
 *     使用requirejs管理继承关系
 * </li>
 * <li>
 *     使用方法如:
 *     define(['parentService'], function (parentService) {
 *       var subService = function ($rootScope) {
 *          return serviceExtend(parentService, {
 *              fun1: ..,
 *          })
 *       }
 *       app.factory("subService", [subService]);
 *      });
 * </li>
 * <li>
 * 注意:如果没有扩展(继承)service将注册和使用父类的service，
 * 使用了相同名字的子service和父类之前注册的service对象将不会是同一个对象,而是覆盖了之前的注册
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

/**
 * 继承的工具方法
 * @param dst 目标(子)对象
 * @param src 源(父)对象
 * @returns {*} dst
 */
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