define([platform, 'services/common-util'], function (app, baseUtil) {
    var utilService = function ($rootScope, $modal, $location, $q, $translate) {

        var confirmScope = $rootScope.$new();

        /**
         * 隐藏弹窗
         * @param modal 弹窗对象
         */
        var hideModal = function (modal) {
            if (modal == undefined) {
                if ($(".modal").length > 0) {
                    $(".modal").remove();
                    $(".modal-backdrop").remove();
                    $("body").removeClass("modal-open modal-with-am-fade");
                }
            } else {
                modal.$promise.then(modal.hide);
            }
        };

        /**
         * 普通弹窗，从html加载内容
         * @param parentScope 父容器Scope
         * @param title 标题
         * @param contentUrl html的url
         * @param init 弹窗初始化回调(显示前)
         */
        var commonModal = function (parentScope, title, contentUrl, init) {
            var modal = $modal({
                scope: parentScope,
                title: title,
                template: "modal/common.tpl.html",
                contentTemplate: "view/" + contentUrl,
                show: false,
                backdrop: "static"
            });
            modal.$promise.then(function () {
                init(modal);
                modal.show();
            });
            var scope = modal.$scope;
            scope.$on("modal.hide", function () {
                scope.$destroy();
            });
        };

        /**
         * script模板弹窗
         * @param parentScope 父容器Scope
         * @param title 标题
         * @param tempId 模板id, 如<script type="text/ng-template" id="modal/common.tpl.html">
         * @param init 弹窗初始化回调(显示前)
         */
        var templateModal = function (parentScope, title, tempId, init) {
            var modal = $modal({
                scope: parentScope,
                title: title,
                template: "modal/common.tpl.html",
                contentTemplate: tempId,
                html: true,
                show: false,
                backdrop: "static"
            });
            modal.$promise.then(function () {
                init(modal);
                modal.show();
            });
            var scope = modal.$scope;
            scope.$on("modal.hide", function () {
                scope.$destroy();
            });
        };

        /**
         * 进度弹窗
         * @param parentScope 父容器Scope
         * @param title 标题
         */
        var procModal = function (parentScope, title) {
            var modal = $modal({
                scope: parentScope,
                title: title,
                template: "modal/process.tpl.html",
                show: false,
                backdrop: "static"
            });
            var scope = modal.$scope;
            modal.$promise.then(function () {
                scope.okBtn = {
                    click: function () {
                        hideModal(modal)
                    }
                }
                modal.show();
            });
            scope.$on("modal.hide", function () {
                scope.$destroy();
            });
            return modal;
        };

        /**
         * 确认弹窗
         * @param content 会话内容
         * @param okFn 点击确定的回调函数
         */
        var confirmModal = function (content, okFn) {
            var modal = $modal({
                scope: confirmScope,
                content: content,
                template: "modal/confirm.tpl.html",
                show: true,
                backdrop: "static"
            });
            var scope = modal.$scope;
            scope.$on("modal.hide", function () {
                scope.$destroy();
            });
            scope.okBtn = {
                click: function () {
                    okFn();
                    hideModal(modal);
                }
            }
        };


        /**
         * 进度弹窗(带进度文字)
         * @param parentScope 父容器scope
         * @param title 标题
         * @returns {*}
         */
        var proccessModal = function proccessModal(parentScope, title) {
            var modal = procModal(parentScope, title + '进度');
            var mScope = modal.$scope;
            var proc = mScope.proc = {
                msgs: ['正在' + title + '，请稍候...']
            };
            //get base URL
            var url = $location.absUrl();
            var idx = url.indexOf('#', 0);
            if (idx > 0) {
                url = url.substring(0, idx);
            }
            var defer = $q.defer();
            var sock = new SockJS(addContext(url + 'sock')); //close by server
            sock.onopen = function () {
                defer.resolve(modal);
            };
            sock.onmessage = function (e) {
                proc.msgs.push(e.data);
                mScope.$apply();
            };
            return defer.promise;
        }

        /**
         * 弹出错误提示
         * @param msg 提示消息
         */
        var alertError = function(msg){
            toastr.error(msg);
        };

        return serviceExtend(baseUtil, {
            hideModal: hideModal,
            commonModal: commonModal,
            templateModal: templateModal,
            procModal: procModal,
            confirm: confirmModal,
            proccessModal: proccessModal,
            alertError: alertError
        });
    };
    app.factory("utilService", ["$rootScope", "$modal", '$location', '$q', '$translate', utilService]);
});
