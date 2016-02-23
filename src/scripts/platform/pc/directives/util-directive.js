define([platform], function (app) {

    /**
     * 文本框回车事件directive,
     * eg:<input type="text" ng-enter="tenantProductsTable.reload()" />
     */
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    /**
     * 时间控件
     * <input
     * class="form-control" id="starttime"
     * ng-model="param.startTime"
     * ng-date max-date="param.endTime"
     * date-format="yyyy-MM-dd HH:mm:ss"
     * class="Wdate" type="text" >
     */
    app.directive('ngDate', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                minDate: '=',
                maxDate: '=',
                isShowClear: '=',
                dateFormat: '@'
            },
            link: function (scope, element, attr, ngModel) {

                function onpicking(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue(date);
                    });
                }

                function oncleared(){
                    scope.$apply(function () {
                        ngModel.$setViewValue("");
                    });
                }

                element.bind('click', function () {
                    var minDate, maxDate;
                    if(scope.minDate){
                        minDate = new Date(scope.minDate.replace(/-/g,"/"));
                    }
                    if(scope.maxDate){
                        maxDate = new Date(scope.maxDate.replace(/-/g,"/"));
                    }
                    WdatePicker({
                        onpicking: onpicking,
                        oncleared:oncleared,
                        dateFmt: (scope.dateFormat || 'yyyy-MM-dd'),
                        minDate: scope.minDate,
                        maxDate: scope.maxDate,
                        isShowClear: scope.isShowClear,
                        autoPickDate:true
                    })
                });
            }
        };
    });

});