/**
 * Created by Jake on 1/5 0005.
 */

// 运行平台设置
var platform = "pc";

require.config({
    baseUrl: "js", // js根路径
    packages: [
    {
        name: 'pc',// platform package name
        location: 'platform/pc',  // default 'packagename'
        main: 'app'                // default 'main'
    }]
});

require([
    platform,
    "services/util-service",
    "services/rest-service",
    "directives/util-directive",
    "filters/main-filter"
], function (app) {
    app.start();
});