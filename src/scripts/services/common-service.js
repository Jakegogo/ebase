/**
 * Created by Jake on 2/26 0026.
 */
define([platform], function (app) {
    var commonService = function ($http, $q, util, rest, ngTableParams) {

        // 初始化rest请求
        var initRest = function ($scope, config) {
            var path = config.url;
            var alias = config.alias;
            var name = config.name;


            $scope.queryParams = $scope.queryParams || {};
            $scope.queryParams.page = {
                "page":1,
                "size":10
            }

            // 初始化表格
            $scope[alias + 'Table'] = new ngTableParams({page:1, count:20}, {
                total: 0,
                getData: function($defer, params) {
                    rest.httpPost(path + '/page', $scope.queryParams).then(function (response) {
                        var data = response.data;
                        var pageInfo = data.pageInfo;
                        params.total(pageInfo.total);
                        $defer.resolve($scope[alias] = data.data);
                    });
                }
            });



        }

        return {
            /**
             * 初始化rest请求
             */
            initRest: initRest,
        };
    };
    app.factory("commonService", ["$http", "$q", "utilService", "restService", "ngTableParams", commonService]);
});
