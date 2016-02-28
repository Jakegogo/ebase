/**
 * Created by Jake on 2/27 0027.
 */
define([platform, 'services/common-service'], function (app, baseService) {
    var commonService = function ($http, $q, util, rest, ngTableParams) {

        // 初始化表格
        var initTable = function ($scope, config) {
            return $scope[config.alias + 'Table'] = new ngTableParams({page:1, count:20}, {
                total: 0,
                getData: function($defer, params) {
                    rest.httpPost(config.url + '/page', $scope.queryParams).then(function (response) {
                        var data = response.data;
                        var pageInfo = data.pageInfo;
                        params.total(pageInfo.total);
                        $defer.resolve($scope[config.alias] = data.data);
                    });
                }
            });
        };

        return serviceExtend(baseService, {
            /**
             * 初始化表格
             * (回调)
             */
            initTable:initTable
        });
    };
    app.factory("commonService", ["$http", "$q", "utilService", "restService", "ngTableParams", commonService]);

    return commonService;
});
