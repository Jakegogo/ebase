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
        routeDef.templateUrl = pathManager.res("view" + url + ".html?ran=" + Math.random());
        routeDef.controller = ctrl;
        routeDef.resolve = {
            load: ['$q', '$rootScope',
                function($q, $rootScope) {
                    var defer = $q.defer();
                    require([pathManager.res("js/controllers") + reqJs],
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

    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
    app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // global configs go here
        });
    }]);

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

    });

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

    /********************************************
     END: BREAKING CHANGE in AngularJS v1.3.x:
     *********************************************/

    /* Setup global settings */
    app.factory('settings', ['$rootScope', function($rootScope) {
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

    /* Setup App Main Controller */
    app.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.$on('$viewContentLoaded', function() {
            App.initComponents(); // init core components
            //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
        });
    }]);

    /***
     Layout Partials.
     By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
     initialization can be disabled and Layout.init() should be called on page load complete as explained above.
     ***/

    /* Setup Layout Part - Header */
    app.controller('HeaderController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initHeader(); // init header
        });
    }]);

    /* Setup Layout Part - Sidebar */
    app.controller('SidebarController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initSidebar(); // init sidebar
        });
    }]);

    /* Setup Layout Part - Quick Sidebar */
    app.controller('QuickSidebarController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            setTimeout(function(){
                QuickSidebar.init(); // init quick sidebar
            }, 2000)
        });
    }]);

    /* Setup Layout Part - Theme Panel */
    app.controller('ThemePanelController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Demo.init(); // init theme panel
        });
    }]);

    /* Setup Layout Part - Footer */
    app.controller('FooterController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initFooter(); // init footer
        });
    }]);

    /* Setup Rounting For All Pages */
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise("/dashboard.html");

        $stateProvider

        // Dashboard
            .state('dashboard', {
                url: "/dashboard.html",
                templateUrl: "view/dashboard.html",
                data: {pageTitle: 'Admin Dashboard Template'},
                controller: "DashboardController",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'js/controllers/DashboardController.js',
                            ]
                        });
                    }]
                }
            })


    }]);

    /* Init global settings and run the app */
    app.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }]);

    return app;
});
