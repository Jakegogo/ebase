var apiRoot = "api/ebase/"; //API根路径
var resRoot = ""; //静态资源根路径

var pathManager = {
    api: function (path) {
        return apiRoot + path;
    },
    res: function (path) {
        return resRoot + path;
    }
}

require.config({
    baseUrl: "js"
});
require([
        "app",
        "services/util-service",
        "services/repo-service",
        "directives/util-directive",
        "directives/main-directive"
    ],
    function () {
        angular.bootstrap(document, [ "eBaseFront" ]);
    });

