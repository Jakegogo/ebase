
define([], function () {

    /**
     * 模块依赖配置
     * @type {Array}
     */
    var dependenciesConfig = [
        'ngResource',
        'ngSanitize',
        'ngTable',
        'w5c.validator',
        "ui.router",
        'ui.sortable',
        "ui.bootstrap",
        "oc.lazyLoad",
        "ncy-angular-breadcrumb",
        "pascalprecht.translate"
    ];

    var app = angular.module(appName, dependenciesConfig);

    /* Setup global settings */
    app.factory('settings', ['$rootScope', function ($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: '../vendor/themes',
            globalPath: '../vendor/themes/global',
            layoutPath: '../vendor/themes/layouts/layout2',
        };

        $rootScope.settings = settings;

        return settings;
    }]);


    app.config(['$breadcrumbProvider', function($breadcrumbProvider) {

    }]);

    // 添加渲染皮肤切面处理
    //app.config(function ($controllerProvider, $provide) {
    //    $provide.decorator('$rootScope', function ($delegate) {
    //        var barBackup = $delegate.$apply;
    //        $delegate.$apply = function () {
    //            barBackup.apply($delegate, arguments);
    //            App.initAjax();// 渲染皮肤
    //            console.log('called $apply ' + $delegate.$id);
    //        };
    //        return $delegate;
    //    });
    //});


    /* Init global settings and run the app */
    app.run(["$rootScope", "settings", "$state", "$timeout", function ($rootScope, settings, $state, $timeout) {
        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //    event.targetScope.$watch('$viewContentLoaded', function () {
        //        // initialize core components
        //        $timeout(function(){
        //            App.initAjax();
        //        });
        //    });
        //})
    }]);

    // start 启动回调
    app.start = function () {
        require([
            "platform/pc/services/util-service",
            "platform/pc/directives/main-directive",
            "platform/pc/directives/util-directive",
            "platform/pc/services/common-service",
            "platform/pc/controllers/mainController"
        ], function () {
            angular.bootstrap(document, ['eBaseFront']);
        });
    };

    return app;
});