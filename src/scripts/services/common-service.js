/**
 * Created by Jake on 2/26 0026.
 */
define([platform], function (app) {
    var commonService = function ($http, $q, util, rest) {

        // 初始化rest请求
        var initRest = function ($scope, config) {
            var alias = config.alias;

            // 初始化查询参数
            $scope.queryParams = $scope.queryParams || {};
            $scope.queryParams.page = {
                "page":1,
                "size":10
            }

            // 初始化表格
            initTable($scope, config);

            // 初始化新增方法
            $scope[alias + 'ShowAdd'] = function () {

            }

        }

        // 初始化表格
        var initTable = Interface.create(function($scope, config){
            // nothing
        });

        return {
            /**
             * 初始化rest请求
             */
            initRest: initRest,
            /**
             * 初始化表格
             */
            initTable:initTable
        };
    };

    app.factory("commonService", ["$http", "$q", "utilService", "restService", commonService]);
    return commonService;
});
