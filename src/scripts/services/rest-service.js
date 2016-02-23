define([platform], function (app) {
    var restService = function ($http, $q, util) {

        /**
         * 路径配置管理
         * @type {{api: pathManager.api, res: pathManager.res}}
         */
        var pathManager = {
            /**
             * 获取api接口路径
             * @param path 接口相对路径
             * @returns {string}
             */
            api: function (path) {
                return serverConfig.apiRoot + path;
            },
            /**
             * 获取静态资源路径
             * @param path 相对路径
             * @returns {string}
             */
            res: function (path) {
                return serverConfig.resRoot + path;
            }
        }

        /*
         * GET请求
         * @param url
         * @returns {*}
         */
        var httpGet = function (url) {
            var defer = $q.defer();
            url = pathManager.api(url);
            $http.get(url).success(function (data, status, headers, config) {
                defer.resolve(data);
            });
            return defer.promise;
        }

        /*
         * POST请求
         * @param url
         * @param paramObj
         * @param onSuccess
         * @returns {*}
         */
        var httpPost = function (url, paramObj, onSuccess) {
            url = pathManager.api(url);
            var defer = $q.defer();
            (angular.isUndefined(paramObj) ? $http.post(url) : $http.post(url,angular.toJson(paramObj)))
                .success(function (data, status, headers, config) {
                    if (angular.isDefined(onSuccess)) {
                        onSuccess(data, status, headers, config);
                    }
                    defer.resolve(data);
                });
            return defer.promise;
        }

        /*
         * PUT请求
         * @param url
         * @param paramObj
         * @param onSuccess
         * @returns {*}
         */
        var httpPut = function (url, paramObj, onSuccess) {
            url = pathManager.api(url);
            var defer = $q.defer();
            (angular.isUndefined(paramObj) ? $http.put(url) : $http.put(url,angular.toJson(paramObj)))
            .success(function (data, status, headers, config) {
                if (angular.isDefined(onSuccess)) {
                    onSuccess(data, status, headers, config);
                }
                defer.resolve(data);
            });
            return defer.promise;
        }

        /*
         * REMOVE请求
         * @param url
         * @param paramObj
         * @param onSuccess
         * @returns {*}
         */
        var httpRemove = function (url, paramObj, onSuccess) {
            url = pathManager.api(url);
            var defer = $q.defer();
            (angular.isUndefined(paramObj) ? $http.remove(url) : $http.remove(url,angular.toJson(paramObj)))
                .success(function (data, status, headers, config) {
                    if (angular.isDefined(onSuccess)) {
                        onSuccess(data, status, headers, config);
                    }
                    defer.resolve(data);
                });
            return defer.promise;
        }

        /*
         * POST BY URL ENCODE请求
         * @param url
         * @param paramObj
         * @returns {*}
         */
        var postByUrlEncode = function (url, paramObj) {
            url = pathManager.api(url);
            var defer = $q.defer();
            $http.post(url, $.param(paramObj), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            });
            return defer.promise;
        }

        return {
            /**
             * 路径配置管理
             * @type {{api: pathManager.api, res: pathManager.res}}
             */
            pathManager: pathManager,
            /**
             * GET请求
             * @param url 请求url
             * @returns {defer.promise}
             */
            httpGet: httpGet,
            /**
             * POST请求
             * @param url 请求url
             * @param paramObj 提交对象
             * @param onSuccess(data, status, headers, config) 成功回调
             * @returns {defer.promise}
             */
            httpPost: httpPost,
            /**
             * PUT请求
             * @param url 请求url
             * @param paramObj 提交对象
             * @param onSuccess(data, status, headers, config) 成功回调
             * @returns {defer.promise}
             */
            httpPut: httpPut,
            /**
             * POST BY URL ENCODE请求
             * @param url 请求url
             * @param paramObj 提交对象
             * @returns {defer.promise}
             */
            postByUrlEncode: postByUrlEncode,
            /**
             * 通用查询
             * @param opts {url:rest地址,showName:实体名称}
             * @param params 查询参数
             * @returns {defer.promise}
             */
            query: function (opts, params) {
                return this.queryByPath(opts.url + "/list", params, opts.showName);
            },
            /**
             * 分页查询
             * @param opts {url:rest地址,showName:实体名称}
             * @param params 查询参数
             * @returns {defer.promise}
             */
            page: function (opts, params) {
                return this.queryByPath(opts.url + "/page", params, opts.showName);
            },
            /**
             * 通用新增
             * @param opts {url:rest地址,showName:实体名称}
             * @param obj 新增对象
             * @returns {defer.promise}
             */
            add: function (opts, obj) {
                return this.saveByPath(opts.url, obj, opts.showName, "新增");
            },
            /**
             * 通用更新
             * @param opts {url:rest地址,showName:实体名称}
             * @param obj 更新对象
             * @returns {defer.promise}
             */
            update: function (opts, obj) {
                return this.saveByPath(opts.url, obj, opts.showName, "更新");
            },
            /**
             * 通用保存
             * @param opts {url:rest地址,showName:实体名称}
             * @param obj 更新对象
             * @returns {defer.promise}
             */
            save: function (opts, obj) {
                return this.saveByPath(opts.url, obj, opts.showName, "保存");
            },
            /**
             * 通用删除
             * @param opts {url:rest地址,showName:实体名称}
             * @param id 删除对象ID
             * @returns {defer.promise}
             */
            remove: function (opts, id) {
                var newOpts = angular.extend([], opts);
                var items = [{
                    id: id,
                    $selected: true
                }];
                return this.removeAll(newOpts, items, "id");
            },
            /**
             * 通用删除
             * @param opts {url:rest地址,showName:实体名称}
             * @param items 删除对象数组
             * @param idKey ID属性名
             * @returns {defer.promise}
             */
            removeAll: function (opts, items, idKey) {
                var defer = $q.defer();
                var ids = util.selectedIds(items, idKey);
                if (ids.length == 0) {
                    toastr.warning("请先选择要删除的" + opts.showName + "！");
                    defer.reject();
                    return defer.promise;
                }
                return this.removeByPath(opts.url, ids, opts.showName, defer);
            },
            /**
             * 保存
             * @param url 地址
             * @param obj 对象
             * @param showName 对象类型名
             * @param action 操作名称
             * @returns {defer.promise}
             */
            saveByPath: function (url, obj, showName, action) {
                var defer = $q.defer();
                httpPut(url, obj, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                        toastr.success(action + showName + "成功。");
                    } else {
                        defer.reject(data);
                        toastr.error(action + showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            /**
             * 删除
             * @param url 地址
             * @param ids ID数组
             * @param showName 对象类型名
             * @param defer defer
             * @returns {defer.promise}
             */
            removeByPath: function (url, ids, showName, defer) {
                util.confirm("确定删除所选" + showName + "？", function () {
                    httpRemove(url, ids, function (data, status, headers, config) {
                        if (util.isRespOK(data)) {
                            defer && defer.resolve(data);
                            toastr.success("删除" + showName + "成功。");
                        } else {
                            defer && defer.reject(data);
                            toastr.error("删除" + showName + "失败: " + data.errorMsg);
                        }
                    });
                });
                return defer && defer.promise;
            },
            /**
             * 查询
             * @param url 地址
             * @param params 查询参数
             * @param showName 对象类型名
             * @returns {defer.promise}
             */
            queryByPath: function (url, params, showName) {
                httpPost(url + path, params, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                        toastr.error("查询" + showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            }

        };
    };
    app.factory("restService", ["$http", "$q", "utilService", restService]);
});
