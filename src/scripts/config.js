/**
 * Created by Jake on 2/27 0027.
 */

define([platform, "services/common-util"], function (app, util) {


    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
    app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true
        });
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
            files:[
                {// 标签
                    prefix: 'i18n/',
                    suffix: '.json'
                },
                {// 错误码
                    prefix: 'i18n/errorcode-',
                    suffix: '.json'
                }
            ]});
    }]);

    app.config(['$controllerProvider', '$provide', '$httpProvider', '$injector',
        function ($controllerProvider, $provide, $httpProvider, $injector) {

            // app注册接口
            app.registry = {
                controller: $controllerProvider.registry,
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
                    location.href = "/login.html";
                } else if (angular.isDefined(accessState) && accessState == "unauthorized") {
                    util.alertError("对不起，你没有权限进行此项操作。请联系系统管理员！");
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

            // 支持json注释
            $httpProvider.defaults.transformResponse = [function (data, headers) {
                if (typeof data === 'string' && (data.indexOf('//SUPPORT COMMENT') === 0)) {
                    return Hjson.parse(data);
                }
                return data;
            }].concat($httpProvider.defaults.transformResponse);
        }]);


    /* Init global settings and run the app */
    app.run(["$rootScope", "settings", "$state", "$timeout", function ($rootScope, settings, $state, $timeout) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }]);

});