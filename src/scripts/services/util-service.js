define([platform], function (app) {
    var utilService = function ($rootScope, $modal, $location, $q, $translate) {

        /**
         * 获取多选行的Id
         * @param items {Array} 模型数组
         * @param idKey {String} ID属性名(不传或空则返回数组元素对象)
         * @returns {Array}
         */
        var selectedIds = function (items, idKey) {
            var rets = [];
            var hasKey = angular.isDefined(idKey);
            if (angular.isDefined(items)) {
                angular.forEach(items, function (o) {
                    if (o.$selected == true) {
                        if (hasKey) {
                            rets.push(o[idKey]);
                        } else {
                            rets.push(o);
                        }
                    }
                });
            }
            return rets;
        };

        /**
         * 构建表格查询参数
         * @param tblParam {Object} ngTable的参数
         * @param otherParam {Object} 自定义参数
         * @returns {{count: *, page: *, sorts: *, params: *}}
         */
        var buildTableQueryParam = function (tblParam, otherParam) {
            return {
                count: tblParam.count(),
                page: tblParam.page(),
                sorts: tblParam.sorting(),
                params: otherParam
            }
        }


        /**
         * 国际化翻译
         * @param key KEY
         * @returns {string}
         */
        var translate = function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }

        return {
            selectedIds: selectedIds,
            buildQueryParam: buildTableQueryParam,
            translate: translate
        };
    };
    app.factory("utilService", ["$rootScope", "$modal", '$location', '$q', '$translate', utilService]);
});
