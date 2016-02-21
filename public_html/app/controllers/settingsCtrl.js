'use strict';

mapp.controller('settingsCtrl', ['$scope',
function($scope)
{
    $scope.gaskets = [
        'White',
        'Brown',
        'Black',
        'Custom'
    ];

    $scope.product_types = [
        'Standard',
        'Museum',
        'Commercial',
        'Privacy',
        'Blackout',
        'Accoustic',
        'Accoustic Black-out',
        'Accoustic Commercial',
        'Shade'
    ];

    $scope.frame_depths = [
        '5/8',
        '3/4'
    ];

    if ( localStorage["mapp.settings.storage"] === "true" )
    {
        $scope.settings = JSON.parse(localStorage["mapp.settings"]);

    } else {

        var settings = {
            gasket       : "White",
            product_type : "Standard",
            frame_depth  : "5/8"
        };

        localStorage["mapp.settings"] = JSON.stringify(settings);
        localStorage["mapp.settings.storage"]  = "true";

        $scope.settings = settings;
    }

    $scope.saveSettings = function()
    {
        localStorage["mapp.settings"] = JSON.stringify($scope.settings);
        localStorage["mapp.settings.storage"]  = "true";
    }
}]);
