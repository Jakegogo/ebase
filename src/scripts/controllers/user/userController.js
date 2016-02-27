/**
 * Created by Jake on 2/26 0026.
 */
define([platform], function (app) {
    app.controller('UserController',
        ['$rootScope', '$scope', 'commonService', 'utilService',
            function($rootScope, $scope, commonService, util) {

                // 初始化rest请求
                commonService.initRest($scope, {
                    url: '/user', //基本URL，必填
                    alias:'users',// 别名
                    name: '用户', //提示的名称，一般为模块名，必填
                });

                // util.alertError("初始化成功");
            }]);
});