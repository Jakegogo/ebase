
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

    var app = angular.module('eBaseFront', dependenciesConfig);


    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
    app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true
        });
    }]);

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

    /* 页面路由配置 */
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise("/dashboard");

        angular.forEach(routeConfig, function (value, key) {
            var resolves = {
                loadModule: ['$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
                    // 加载requirejs文件
                    var deferred = $q.defer();
                    require(value.requireJs, function () {
                        $ocLazyLoad.inject('eBaseFront');
                        deferred.resolve();
                    });
                    return deferred.promise;
                }]
            };
            if (value.files && value.files.length > 0) {
                resolves.deps = ['$ocLazyLoad', function ($ocLazyLoad) {
                    // 加载其它文件
                    return $ocLazyLoad.load({
                        name: 'eBaseFront',
                        // load the above css files before a LINK element with this ID.
                        // Dynamic CSS files must be loaded between core and theme css files
                        insertBefore: '#ng_load_plugins_before',
                        files: value.files
                    });
                }];
            }
            $stateProvider.state(value.path, {
                title: value.name,
                url: value.path,
                templateUrl: "view/" + value.html,
                data: {pageTitle: value.name},
                controller: value.controller,
                caseInsensitiveMatch: false,
                resolve: resolves,
                depends:value.depends || [],
                ncyBreadcrumb: {
                    label: value.name,
                    parent:value.parent
                }
            })
        })

    }]);


    //AngularJS v1.3.x workaround for old style controller declarition in HTML
    app.config(['$controllerProvider', function ($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }]);


    // 表单验证全局配置
    app.config(["w5cValidatorProvider",
        function (w5cValidatorProvider) {
            // 全局配置
            w5cValidatorProvider.config({
                blurTrig: true,
                showError: true,
                removeError: true
            });
            w5cValidatorProvider.setRules(validatorConfig);
        }
    ]);

    // 配置国际化文件
    app.config(['$translateProvider',function($translateProvider){
        var lang = window.localStorage.lang || 'cn';
        $translateProvider.preferredLanguage(lang);
        $translateProvider.useStaticFilesLoader({
            prefix: '/i18n/',
            suffix: '.json'
        });
    }]);

    app.config(['$controllerProvider', '$provide', '$httpProvider',
        function ($controllerProvider, $provide, $httpProvider) {
        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

        /**
         * 检查请求状态是否合法
         * @param resp Response
         * @returns {*}
         */
        var checkAccessState = function (resp) {
            var headers = resp.headers();
            var accessState = headers["access-state"];
            if (angular.isDefined(accessState) && accessState == "login") {
                location.href = addContext("login");
            } else if (angular.isDefined(accessState) && accessState == "unauthorized") {
                toastr.error("对不起，你没有权限进行此项操作。请联系系统管理员！");
                location.href = "#/";
            } else {
                return resp;
            }
        }

        // http请求切面配置
        $httpProvider.interceptors.push(function ($q) {
            return {
                "response": function (resp) {
                    return checkAccessState(resp);
                },
                "responseError": function (rejection) {
                    var ret = checkAccessState(rejection);
                    if (angular.isDefined(ret)) {
                        toastr.error("请求处理失败！");
                    }
                    return $q.reject(rejection);
                }
            };
        });

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
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //    event.targetScope.$watch('$viewContentLoaded', function () {
        //        // initialize core components
        //        $timeout(function(){
        //            App.initAjax();
        //        });
        //    });
        //})
    }]);

    app.start = function () {
        angular.bootstrap(document, ['eBaseFront']);
    };

    return app;
});