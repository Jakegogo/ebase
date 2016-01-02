var apiRoot = "api/ebase/"; //API根路径
var resRoot = ""; //静态资源根路径

var xpath = {
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
        "services/util-service",
        "services/repo-service",
        "directives/util-directive"
    ],
    function () {
        angular.bootstrap(document, [ "eBaseFront" ]);
    });