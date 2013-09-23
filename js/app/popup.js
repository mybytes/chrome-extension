myApp.service('pageInfoService', function() {
    this.getInfo = function(callback) {
        var model = {};
        var facebookUrl = /.*facebook.*/g;
        var googleUrl = /.*google.*/g;
        chrome.tabs.query({'active': true},
        function (tabs) {
            if (tabs.length > 0)
            {
                model.title = tabs[0].title;
                model.url = tabs[0].url;

                model.authorizationState = "cannotAuthorize";

                if (googleUrl.test(model.url)) {
                    model.authorizationState = "hasAuthorized";
                    model.jobs = [
                        { date: "2013-09-23 11:21:00Z", description: "63 items downloaded"},
                        { date: "2013-09-22 11:21:00Z", description: "56 items downloaded"},
                        { date: "2013-09-21 11:21:00Z", description: "43 items downloaded"}
                    ];
                }

                if (facebookUrl.test(model.url)) {
                    model.authorizationState = "needToAuthorize";
                }

                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    callback(model);
                });

            }

        });
    };
});

myApp.controller("PageController", function ($scope, pageInfoService) {

    pageInfoService.getInfo(function (info) {
        $scope.authorizationState = info.authorizationState;
        $scope.title = info.title;
        $scope.url = info.url;
        $scope.jobs = info.jobs; 
        
        $scope.$apply();
    });
});



