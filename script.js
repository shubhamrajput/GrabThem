(function () {

    'use strict';
    var myapp = angular.module("app", []);

    myapp.controller("MyCtrl", function ($scope) {
        $scope.URLS = [];
        $scope.array = [];
        $scope.extract = function () {

            $scope.show_extract_table = 1;
            $scope.show_display_table = 0;
            chrome.tabs.query({
                currentWindow: true
            }, function (tabs) {
                $scope.$apply(function () {
                    $scope.array = tabs;
                });
            });


        };


        $scope.saveURLS = function () {
            var urls = [];
            //$scope.array.length = $scope.array.length || 0;
            for (let i = 0; i < $scope.array.length; i++) {
                if (!urls.includes($scope.array[i].url) && !$scope.array[i].url.startsWith("chrome://")) {
                    urls.push($scope.array[i].url);
                }
            }

            chrome.storage.sync.get('urls', function (i) {
                if (i.urls === undefined) {
                    chrome.storage.sync.set({
                        urls
                    });
                } else {
                    urls.push(...i.urls);
                    urls = $scope.removeDuplicates(urls);
                    chrome.storage.sync.set({
                        urls
                    });


                }
            });
        };

        $scope.removeDuplicates = function (urls) {

            return urls.filter(function (item, index, inputArray) {
                return inputArray.indexOf(item) == index;
            });
        };


        $scope.getURLS = function () {
            $scope.show_extract_table = 0;
            $scope.show_display_table = 1;
            chrome.storage.sync.get('urls', function (items) {
                if (items.urls != null) {
                    
                    $scope.$apply(function(){
                    	$scope.URLS = items.urls;

                    });
                }

            });


        };

        $scope.clear = function () {
            chrome.storage.sync.remove('urls');
            $scope.URLS = [];
        };

        $scope.openUrls = function () {
            if ($scope.URLS != undefined) {
                for (let i = 0; i < $scope.URLS.length; i++) {

                    chrome.tabs.create({
                        'url': $scope.URLS[i]
                    });
                }
            }

        };



    });
})();