'use strict';
define([], function() {

    var app = angular.module('eBaseFront', dependenciesConfig);

    // 表单验证全局配置
    app.config(["w5cValidatorProvider",
        function(w5cValidatorProvider) {
            // 全局配置
            w5cValidatorProvider.config({
                blurTrig: true,
                showError: true,
                removeError: true
            });
            w5cValidatorProvider.setRules(validatorConfig);
        }
    ]);

    app.config(function($controllerProvider, $provide, $httpProvider) {
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
        var checkAccessState = function(resp) {
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
        $httpProvider.interceptors.push(function($q) {
            return {
                "response": function(resp) {
                    return checkAccessState(resp);
                },
                "responseError": function(rejection) {
                    var ret = checkAccessState(rejection);
                    if (angular.isDefined(ret)) {
                        toastr.error("请求处理失败！");
                    }
                    return $q.reject(rejection);
                }
            };
        });

    });

    /* 页面路由配置 */
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise("/dashboard");

        angular.forEach(routeConfig, function(value, key) {
            $stateProvider.state(value.name, {
                url: value.path,
                templateUrl: "view/" + value.html,
                data: {pageTitle: value.name},
                controller: value.controller,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'eBaseFront',
                            // load the above css files before a LINK element with this ID.
                            // Dynamic CSS files must be loaded between core and theme css files
                            insertBefore: '#ng_load_plugins_before',
                            files: value.files
                        });
                    }]
                }
            })
        })


    }]);

    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
    app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // global configs go here
        });
    }]);

    //AngularJS v1.3.x workaround for old style controller declarition in HTML
    app.config(['$controllerProvider', function($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }]);

    /* Init global settings and run the app */
    app.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }]);

    return app;
});
