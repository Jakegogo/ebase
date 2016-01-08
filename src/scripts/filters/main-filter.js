/**
 * Created by Jake on 1/8 0008.
 */
/**
 * 国际化翻译过滤器
 */
define(['app'], function (app) {
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