/**
 * API根路径
 * @type {string}
 */
var apiRoot = "api/ebase/";
/**
 * 静态资源根路径
 * @type {string}
 */
var resRoot = "";

/**
 * 路径配置管理
 * @type {{api: pathManager.api, res: pathManager.res}}
 */
var pathManager = {
    /**
     * 获取api接口路径
     * @param path 接口相对路径
     * @returns {string}
     */
    api: function (path) {
        return apiRoot + path;
    },
    /**
     * 获取静态资源路径
     * @param path 相对路径
     * @returns {string}
     */
    res: function (path) {
        return resRoot + path;
    }
}


require.config({
    baseUrl: "js" // js根路径
});

// 加载自定义依赖库
require([
        "controllers/mainController",
        "services/util-service",
        "services/rest-service",
        "directives/util-directive",
        "directives/main-directive"
    ],
    function () {
        angular.bootstrap(document, [ "eBaseFront" ]);
    });

