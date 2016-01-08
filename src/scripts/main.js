/**
 * Created by Jake on 1/5 0005.
 */

require.config({
    baseUrl: "js" // js根路径
});

require([
    'app',
    "services/util-service",
    "services/rest-service",
    "directives/util-directive",
    "directives/main-directive",
    "filters/main-filter",
    "controllers/mainController"
], function (app) {
    app.start();
});