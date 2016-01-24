/**
 * Created by Jake on 1/8 0008.
 */
define(['app'], function (app) {

    /**
     * 国际化过滤器
     * {{'默认值'|T:'国际化ID':'参数(支持json object)'}}
     */
    app.filter("T", ['$translate', '$parse', function ($translate, $parse) {
        return function (defaultVal, key, paramObj) {
            if (!angular.isObject(paramObj)) {
                paramObj = $parse(paramObj)(this);
            }
            if (!key) {
                return defaultVal;
            }
            var value = $translate.instant(key, paramObj);
            if (value && value != key) {
                return value;
            }
            return defaultVal;
        };
    }]);

});