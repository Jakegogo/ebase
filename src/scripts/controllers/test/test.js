define([platform], function (app) {
    app.controller('TestController',
        ['$rootScope', '$scope', '$http', '$timeout',
        function($rootScope, $scope, $http, $timeout) {
        // set sidebar closed and body solid layout mode
        $scope.aa = 3;

        ///**
        // * added at the end of the execution stack
        // * could be used to replace jquery's ready
        // * there's already a DOM ready in the directive
        // * so this is only useful in CTRLs
        // */
        //$timeout(function(){
        //    App.initAjax();
        //});

        $scope.roles = [
            'guest',
            'user',
            'customer',
            'admin'
        ];
        $scope.user = {
            roles: ['user']
        };
        $scope.checkAll = function() {
            $scope.user.roles = angular.copy($scope.roles);
        };
        $scope.uncheckAll = function() {
            $scope.user.roles = [];
        };
        $scope.checkFirst = function() {
            $scope.user.roles.splice(0, $scope.user.roles.length);
            $scope.user.roles.push('guest');
        };
        $scope.addItem = function() {
            $scope.roles.push(Math.round(Math.random()*100));
        }

    }]);
});