Parse.initialize("IqCqoOaKylK6hSZbgN4PS35UIcoHbc32vt5cLXjW", "PABcZoVcVUt5aPQyC3Z2re6fOd9sakjJWSozoB7G"); // initial parse
var oneStarApp = angular.module("oneStarApp",['ngRoute']);

oneStarApp.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

//oneStarApp.directive('scrollTo', function() {
//    return {
//        restrict: 'A',
//        link: function(scope, element, attrs) {
//             scope.$watch('selectedIndex', function(newVal, oldVal) {
//                 if (newVal && newVal !== oldVal) {
////                     $('main').scrollTop(element.find('.card').eq(newVal).position().top)                     
//                 }                 
//            });
//        }
//    };
//});


oneStarApp.controller("MainController",function($scope,$http){
    
    $scope.CLIENT_ID = "PHKKTXSG2M0I5CXJFKZKXQ4ALX3G3CO13YASIUEX3OPTEKWV";
    $scope.CLIENT_SECRET = "RQF2NDLN3ARNLQ3LDSAL2RK5WYTL20E4QW2QFNXBHLLY5IQT";
    $scope.GOOGLE_API_KEY = "AIzaSyAJxIsvGYFXhFHOusqY2r2_jMlyK0TzAnc";
    $scope.reviewData = {};
    $scope.isLoaded = false;
    $scope.selectedIndex = -1;
    
    /////////// TODO: move this to core-graphic.js ///////////
//    $scope.cardClick = function($index){
//        $scope.selectedIndex = $index;
////        console.log("here");
////        $(this).closest('.card').css('height', '600px');
//    }
    $scope.getNearbyPlacesFromFacebook = function(){
          $http({
            method: 'POST', 
            url: 'php/facebook.php'
          }).
          success(function(data, status, headers, config) {
              console.log(data);
          }).
          error(function(data, status, headers, config) {
              console.log("AJAX Error.");
          });
    }
    $scope.getNearbyPlacesFromFacebook();
    
    $scope.facebookLogin = function(){
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
              console.log(user);
            if (!user.existed()) {
              console.log("User signed up and logged in through Facebook!");
            } else {
              console.log("User logged in through Facebook!");
//                $scope.getNearbyPlacesFromFacebook();
                //https://graph.facebook.com/search?type=place&center=48.1776759,11.5982435&distance=1000 
            }
          },
          error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
          }
        });
    }
    
    $scope.searchFocus = function(){
        $('#circle-logo ').css('width', '50px').css('height','50px');
        $('#star-logo').css('width', '40px').css('margin-top','4px');
    }
    
    $scope.searchBlur = function(){
        $('#circle-logo ').css('width', '100px').css('height','100px');
        $('#star-logo').css('width', '80px').css('margin-top','9px');
    }
    /////////// TODO: move this to core-graphic.js ///////////
    
    $scope.cardClick = function($index){
        $scope.selectedIndex = $index;
        setTimeout(scrollToCards, 200);
        function scrollToCards(){
            $('body').animate({
                scrollTop: $(".card-selected").offset().top - 40
            }, 800);
        }
    }
        
    $scope.loadReviewFromParse = function(lat,lon){
        var Reviews = Parse.Object.extend("Reviews");
        var point = new Parse.GeoPoint({latitude: lat, longitude: lon});
        var query = new Parse.Query(Reviews);
        query.include("place");
        query.near("location", point);
        query.limit(20);
//      TODO : query and get the closet one first.
        query.find({
          success: function(results) {
              $scope.reviewData = results;
              $scope.calculateDistance(lat,lon);
              $scope.isLoaded = true;
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
            });
        } else {
           callback.fail();
           console.log("Geolocation is not supported by this browser.");
        }
    }
    
    $scope.getLocation({
            success:function(userPosition){
              $scope.loadReviewFromParse(userPosition.coords.latitude,userPosition.coords.longitude);
            },
            fail:function(){
                console.log("User Denied.");
                $.get("http://ipinfo.io", function(response) { // get the current city
                     $scope.loadReviewFromParse(parseFloat(response.loc.split(",")[0]),parseFloat(response.loc.split(",")[1]))
                }, "jsonp");
                //TODO: get from ipinfo.io
            }
    });
    
    $scope.calculateDistance = function(lat,lon){
//        console.log(userPosition);
        for(var i = 0; i < $scope.reviewData.length ; i++){
            var data = $scope.reviewData[i];
            var location = data.get("place").get("location");
            var distance = getDistance(lat,lon, location.latitude, location.longitude, "K");
            $scope.reviewData[i].distance = Math.round(distance * 10) / 10;
        }
//        console.log($scope.reviewData);

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
    
//    $scope.getYelpReview();
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
});
//FB.init();


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