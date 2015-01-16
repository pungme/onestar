//oneStarApp.config(function($locationProvider) {
//    $locationProvider.html5Mode(true);
//});
oneStarApp.controller("PlaceController",[ '$scope','$http','$location', 'locationService',
                                  function($scope,$http,$location,locationService){
    
    $scope.place = {};
    $scope.objectId = $location.search().objectId;
    $scope.locationService = locationService;
    $scope.userLocation = $scope.locationService.getLocation();

    //TODO: get place from objectId and get all review of this place.
    
    $scope.loadPlaceFromParse = function(){
        
        var Places = Parse.Object.extend("Places");
        var query = new Parse.Query(Places);
        query.equalTo("objectId", $scope.objectId);

        query.first({
          success: function(object) {
              console.log(object);
              $scope.place = object;
              $scope.calculateDistance($scope.userLocation.lat,$scope.userLocation.lon);
              $scope.$apply();
            // Successfully retrieved the object.
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    }
    $scope.loadPlaceFromParse();
    //pass the current location
    $scope.calculateDistance = function(lat,lon){
        var location = $scope.place.get("location");
        var distance = getDistance(lat,lon, location.latitude, location.longitude, "K");
        $scope.place.distance = Math.round(distance * 10) / 10;
        $scope.$apply();
    }
}]);