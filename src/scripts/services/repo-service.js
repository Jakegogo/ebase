define(["app"], function (app) {
    var repoService = function ($http, $q, util) {

        var httpGet = function (url) {
            var defer = $q.defer();
            url = pathManager.api(url);
            $http.get(url).success(function (data, status, headers, config) {
                defer.resolve(data);
            });
            return defer.promise;
        }

        var httpPost = function (url, paramObj, onSuccess) {
            url = pathManager.api(url);
            var defer = $q.defer();
            if (angular.isUndefined(paramObj)) {
                $http.post(url).success(function (data, status, headers, config) {
                    if (angular.isDefined(onSuccess)) {
                        onSuccess(data, status, headers, config);
                    }
                    defer.resolve(data);
                });
                return defer.promise;
            }
            $http.post(url, angular.toJson(paramObj)).success(
                function (data, status, headers, config) {
                    if (angular.isDefined(onSuccess)) {
                        onSuccess(data, status, headers, config);
                    }
                    defer.resolve(data);
                });
            return defer.promise;
        }

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

        var postByXform = function (url, paramObj) {
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
            get: function (opts, id) {
                var url = opts.url + "/get";
                if (angular.isDefined(id) && id != null) {
                    url += "?id=" + id;
                }
                return httpGet(url);
            },
            rest: function (opts, id) {
                var url = opts.url;
                if (angular.isDefined(id) && id != null) {
                    url += "/" + id;
                }
                return httpGet(url);
            },
            getExt: function (opts, action, id) {
                var url = opts.url + "/getExt?action=" + action;
                if (angular.isDefined(id) && id != null) {
                    url += "&id=" + id;
                }
                return httpGet(url);
            },
            getByPath: function (opts, path) {
                var url = opts.url;
                if (angular.isDefined(path) && path != null) {
                    url += path;
                }
                return httpGet(url);
            },
            getByUrl: function (url) {
                return httpGet(url);
            },
            post: httpPost,
            put: httpPut,
            postByXform: postByXform,
            add: function (opts, obj) {
                var url = opts.url + "/save";
                var defer = $q.defer();
                httpPost(url, obj, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                        toastr.success("新增" + opts.showName + "成功。");
                    } else {
                        defer.reject(data);
                        toastr.error("新增" + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            query: function (opts, params) {
                var url = opts.url + "/list";
                var defer = $q.defer();
                httpPost(url, params, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                        toastr.error("查询" + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            queryByPath: function (opts, path, params) {
                var defer = $q.defer();
                httpPost(opts.url + path, params, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                        toastr.error("查询" + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            queryByUrl: function (url, opts, params) {
                var defer = $q.defer();
                httpPost(url, params, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                        toastr.error("查询" + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            update: function (opts, obj) {
                var url = opts.url + "/save";
                var defer = $q.defer();
                httpPost(url, obj, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                        toastr.success("更新" + opts.showName + "成功。");
                    } else {
                        defer.reject(data);
                        toastr.error("更新" + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            updateByPath: function (opts, suffixUrl, obj, tips) {
                var url = opts.url + suffixUrl;
                var defer = $q.defer();
                httpPost(url, obj, function (data, status, headers, config) {
                    if (util.isRespOK(data)) {
                        defer.resolve(data);
                        toastr.success(tips == null ? "更新" : tips + opts.showName + "成功。");
                    } else {
                        defer.reject(data);
                        toastr.error(tips == null ? "更新" : tips + opts.showName + "失败: " + data.errorMsg);
                    }
                });
                return defer.promise;
            },
            remove: function (opts, items, idKey) {
                var defer = $q.defer();
                var ids = util.selectedIds(items, idKey);
                if (ids.length == 0) {
                    toastr.warning("请先选择要删除的" + opts.showName + "！");
                    defer.reject();
                    return defer.promise;
                }
                util.confirm("确定删除所选" + opts.showName + "？", function () {
                    var url = opts.url + "/del";
                    httpPost(url, ids, function (data, status, headers, config) {
                        if (util.isRespOK(data)) {
                            defer.resolve(data);
                            toastr.success("删除" + opts.showName + "成功。");
                        } else {
                            defer.reject(data);
                            toastr.error("删除" + opts.showName + "失败: " + data.errorMsg);
                        }
                    });
                });
                return defer.promise;
            },
            removeOne: function (opts, id, name) {
                var newOpts = angular.extend([], opts);
                var items = [{
                    id: id,
                    $selected: true
                }];
                if (angular.isDefined(name)) {
                    newOpts.showName += "[" + name + "]";
                }
                return this.remove(newOpts, items, "id");
            },
            // 获取参数字典，key为空是获取全部
            getDictionary: function (key) {
                var obj = {};
                obj.key = key;
                var url = "common?action=dictionary";
                var promise = httpPost(url, obj, function (data, status, headers, config) {
                    if (data.status != 0) {
                        toastr.error("查询参数字典失败: " + data.errorMsg);
                    }
                });
                return promise;
            },
            // excel导出
            exportExcel: function (scope, url, condition, str) {
                util.htmlModal(scope, "导出Excel数据", "modal/loading.tpl.html", function (modal) {
                    var mScope = modal.$scope;
                    mScope.loadState = 0;
                    mScope.loadingContent = "正在导出 <b>" + str + "</b> 数据，请稍后...";
                    mScope.okBtn = {
                        hide: true
                    };
                    httpPost(url, condition, function (data, status, headers, config) {
                        mScope.loadState = 1;
                        if (status == 200 && data.status == 0) {
                            var fileUrl = data.data;
                            mScope.loadedContent = '<a href="' + fileUrl + '" target="_blank">导出 <b>' + str + '</b> 数据完成，点击下载或右键“另存为”。</a>';
                        } else {
                            mScope.loadedContent = "导出Excel错误: " + data.errorMsg;
                        }
                    });
                });
            },
            //加载和保存数据列选项数据
            loadPreferenceCols: function (key, cols) {
                key = "cols@" + key;
                var url = "home?action=getUserPreference&key=" + key;
                httpGet(url).then(function (data) {
                    if (data.status == 0 && data.data != null) {
                        var result = angular.fromJson(data.data);
                        angular.forEach(cols, function (clo) {
                            angular.forEach(result, function (ret) {
                                if (ret.title == clo.title) {
                                    clo.show = !ret.show ? false : true;
                                }
                            });
                        });
                    }
                });
                $(document).off("blur", "#colsPopDiv :checkbox");
                $(document).on("blur", "#colsPopDiv :checkbox", function () {
                    var value = angular.toJson(cols);
                    var condition = {
                        "key": key,
                        "value": value
                    };
                    var url = "home?action=updateUserPreference";
                    httpPost(url, condition, function (data, status, headers, config) {
                        if (data.status != 0) {
                            toastr.error("保存数据列选项失败: " + data.errorMsg);
                        }
                    });
                });
            }
        };
    };
    app.factory("repoService", ["$http", "$q", "utilService", repoService]);
});
