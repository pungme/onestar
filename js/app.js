Parse.initialize("IqCqoOaKylK6hSZbgN4PS35UIcoHbc32vt5cLXjW", "PABcZoVcVUt5aPQyC3Z2re6fOd9sakjJWSozoB7G"); // initial parse
var oneStarApp = angular.module("oneStarApp",['ngRoute']);

oneStarApp.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

oneStarApp.controller("MainController",function($scope,$http){
    
    $scope.CLIENT_ID = "PHKKTXSG2M0I5CXJFKZKXQ4ALX3G3CO13YASIUEX3OPTEKWV";
    $scope.CLIENT_SECRET = "RQF2NDLN3ARNLQ3LDSAL2RK5WYTL20E4QW2QFNXBHLLY5IQT";
    $scope.GOOGLE_API_KEY = "AIzaSyAJxIsvGYFXhFHOusqY2r2_jMlyK0TzAnc";
    $scope.reviewData = {};
    
    $scope.onCardClick = function(){
        $(this).closest('.card').css('color', 'red');
    }
    
    $.get("http://ipinfo.io", function(response) { // get the current city
        console.log(response);
//        $scope.getFourSquarePlaces(response.loc);
//        $scope.getGooglePlaces(response.loc);
//        console.log(response);
//        var location = response.city;
//        console.log(location);
//        if(!location){
//            location = response.country;
//        }
//        $scope.getYelpReview(location,response.loc);
    }, "jsonp");
    
    $scope.loadReviewFromParse = function(userPosition){
        var Reviews = Parse.Object.extend("Reviews");
//        var Places = Parse.Object.extend("Places");
        var point = new Parse.GeoPoint({latitude: userPosition.coords.latitude, longitude: userPosition.coords.longitude});
//        var innerQuery = new Parse.Query("Places");
//        innerQuery.near("location",point);
        var query = new Parse.Query(Reviews);
//        query.matchesQuery("place",innerQuery);
        query.include("place");
        query.near("location", point);
        query.limit(20);
//      TODO : query and get the closet one first.
        
        query.find({
          success: function(results) {
              $scope.reviewData = results;
              $scope.calculateDistance(userPosition);
              $scope.$apply();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }
    
//    $scope.loadReviewFromParse();
    
    $scope.getLocation = function(callback){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                callback.success(position);
            },function(){
                callback.fail();
                console.log("User Denied.");
            });
        } else {
           callback.fail();
           console.log("Geolocation is not supported by this browser.");
        }
    }
      $scope.getLocation({
            success:function(userPosition){
    //                      $scope.calculateDistance(userPosition);
    //                        var point = new Parse.GeoPoint({latitude: userPosition.coords.latitude, longitude: userPosition.coords.longitude});
              $scope.loadReviewFromParse(userPosition);
            },
            fail:function(){
                //TODO: get from ipinfo.io
            }
      });
//    $scope.getLocation(function(position){
//        console.log(position);
//    });
    
    $scope.calculateDistance = function(userPosition){
//        console.log(userPosition);
        for(var i = 0; i < $scope.reviewData.length ; i++){
            var data = $scope.reviewData[i];
            var location = data.get("place").get("location");
            var distance = getDistance(userPosition.coords.latitude, userPosition.coords.longitude, location.latitude, location.longitude, "K");
            $scope.reviewData[i].distance = Math.round(distance * 10) / 10;
        }
        console.log($scope.reviewData);
//        $scope.$apply();
//       var distance = getDistance(userPosition.coords.latitude, userPosition.coords.longitude, lat2, lon2, "K");
    }
    
    
    
    
    
////////////////////////// get data from third party tryout, nothing work sofar. /////////////////////
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
//    $.get("http://ipinfo.io", function(response) { // get the current city
//        console.log(response);
////        $scope.getFourSquarePlaces(response.loc);
////        $scope.getGooglePlaces(response.loc);
////        console.log(response);
////        var location = response.city;
////        console.log(location);
////        if(!location){
////            location = response.country;
////        }
////        $scope.getYelpReview(location,response.loc);
//    }, "jsonp");
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