var oneStarApp = angular.module("oneStarApp",['ngRoute']);

oneStarApp.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

oneStarApp.controller("MainController",function($scope,$http){
    
    $scope.CLIENT_ID = "PHKKTXSG2M0I5CXJFKZKXQ4ALX3G3CO13YASIUEX3OPTEKWV";
    $scope.CLIENT_SECRET = "RQF2NDLN3ARNLQ3LDSAL2RK5WYTL20E4QW2QFNXBHLLY5IQT";
    $scope.GOOGLE_API_KEY = "AIzaSyAJxIsvGYFXhFHOusqY2r2_jMlyK0TzAnc";
    
//  Yelp api desn't support sort by rating !!
    $scope.yelpData = {};
    
    $scope.getYelpReview = function(location,cll){
          $http({
            method: 'POST', 
            url: 'php/getonestar_yelp.php',
            data : { 
                location : location,
                cll:cll
            }
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              $scope.yelpData = data;
          }).
          error(function(data, status, headers, config) {
              console.log("AJAX Error.");
          });
    }
    
    $scope.getGooglePlaces = function(ll){
        
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + ll +
            "&radius=" + 10000 + 
            "&key=" + $scope.GOOGLE_API_KEY,
//            data: myData,
            type: 'GET',
            dataType: 'jsonp',
            success: function() { 
//                console.log(data) 
            },
            error: function() { 
                console.log("AJAX fail") 
            }
        });
    }
    
    $scope.getFourSquarePlaces= function(ll){
    
      $http({
        method: 'POST', 
        url: "https://api.foursquare.com/v2/venues/search?client_id=" + $scope.CLIENT_ID +
              "&client_secret=" + $scope.CLIENT_SECRET +
              "&v=20130815" +
              "&ll=" +ll
      }).
      success(function(data, status, headers, config) {
          console.log(data);
          $scope.fourSqData = data;
//          $scope.yelpData = data;
      }).
      error(function(data, status, headers, config) {
          console.log("AJAX Error.");
      });
        
    }
    
    
    
    
    //let take this as a secondary
    $.get("http://ipinfo.io", function(response) { // get the current city
//        $scope.getFourSquarePlaces(response.loc);
//        $scope.getGooglePlaces(response.loc);
//        console.log(response);
        var location = response.city;
//        console.log(location);
//        if(!location){
//            location = response.country;
//        }
        $scope.getYelpReview(location,response.loc);
//    console.log(response.city, response.country);
    }, "jsonp");
    
//    console.log("it works !");
});
//function getLocation() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(showPosition);
//    } else {
//       console.log("Geolocation is not supported by this browser.");
//    }
//}
//
//function showPosition(position) {
//    console.log(position);
//}
//getLocation();