angular.module('eBaseFront').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});