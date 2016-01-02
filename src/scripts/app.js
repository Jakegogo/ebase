'use strict';
define([], function() {

    /**
     * 路由设置函数，所以这里定义setRoute
     *
     * @param {[type]}　url [模块相对路径]
     * @param {[type]}　ctrl [Controller名称]
     * @param {[type]}　reqJs [模块对应的控制器JS文件]
     * @param {[type]}　label [标签，对应于导航条]
     */
    function setRoute(url, ctrl, reqJs, label) {
        var routeDef = {};
        routeDef.templateUrl = xpath.res("view" + url + ".html?ran=" + Math.random());
        routeDef.controller = ctrl;
        routeDef.resolve = {
            load: ['$q', '$rootScope',
                function($q, $rootScope) {
                    var defer = $q.defer();
                    require([xpath.res("js/controllers") + reqJs],
                        function() {
                            defer.resolve();
                            $rootScope.$apply();
                        });
                    return defer.promise;
                }
            ]
        };
        routeDef.label = label;
        return routeDef;
    }

    var app = angular.module('eBaseFront', dependenciesConfig);

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

    app.config(function($routeProvider, $controllerProvider, $provide, $httpProvider) {
        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

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

        /** 设置路由 */
        angular.forEach(routeConfig, function(value, key) {
            $routeProvider
                .when(value.path, setRoute(value.html, 'bizObjCtrl', value.js, value.name))
        })

    });
    return app;
});
