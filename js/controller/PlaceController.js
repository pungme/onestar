//oneStarApp.config(function($locationProvider) {
//    $locationProvider.html5Mode(true);
//});
oneStarApp.controller("PlaceController",[ '$scope','$http','$location', 'locationService',
                                  function($scope,$http,$location,locationService){
    
    $('#circle-logo ').css('width', '100px').css('height','100px');
    $('#star-logo').css('width', '80px').css('margin-top','9px');                                  
                                      
    $scope.place = {};
    $scope.reviews = {};
    $scope.selectedIndex = -1;   
    $scope.isLoaded = false;
    $scope.objectId = $location.search().objectId;
    $scope.locationService = locationService;
    $scope.userLocation = $scope.locationService.getLocation();
    $scope.userReviewText = "";

    $scope.submitReview = function(){
        console.log("submit review");
    }
    
    ////////////// Move this to core animation ////////////                                  
    $scope.reviewFocus = function(){
        $('.comment-area').css('height','150px');
    }
    
    $scope.reviewBlur = function(){
        if($scope.userReviewText.length > 0){
            $('.comment-area').css('height','150px');
        }else {
            $('.comment-area').css('height','35px');
        }
    }
    ////////////// Move this to core animation //////////// 
    
    $scope.cardClick = function($index){
        if($scope.selectedIndex != $index){ // check if click the same
            $scope.selectedIndex = $index;
            setTimeout(scrollToCards, 200);
            function scrollToCards(){
                $('body').animate({
                    scrollTop: $(".card-selected").offset().top - 40
                }, 800);
            }
        }
//        $scope.injectDisqusComment();
    }
    
    $scope.loadReviewsOfPlace = function(place){
        var Reviews = Parse.Object.extend("Reviews");
        var query = new Parse.Query(Reviews);
        query.equalTo("place", place);
        query.include("reviewer");
        query.find({
          success: function(objects) {
              $scope.reviews = objects;
              $scope.$apply();
            // comments now contains the comments for myPost
          }
        });
        
    }
    
    $scope.loadPlaceFromParse = function(){
        
        var Places = Parse.Object.extend("Places");
        var query = new Parse.Query(Places);
        query.equalTo("objectId", $scope.objectId);

        query.first({
          success: function(object) {
              $scope.place = object;

//              $scope.getPlaceDescription(object.get("place_id"));
              
              if($scope.userLocation){
                $scope.calculateDistance($scope.userLocation.lat,$scope.userLocation.lon);
              }
              
              $scope.loadReviewsOfPlace($scope.place);
              $scope.isLoaded = true;
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    }
    $scope.loadPlaceFromParse();

    $scope.getPlaceDescription = function(place_id){
        //giving up on facebook 
        //This from facebook login.
//        var userAuth = Parse.User.current().get('authData')['facebook'];
//        FB.api(
//            "/"+place_id,
//            function (response) {
//              if (response && !response.error) {
//                  console.log(response);
//                  if(response.about){
//                    $scope.place.about = response.about;
//                  }else {
//                    $scope.place.about = response.description;
//                  }
//                  $scope.$apply();
//                /* handle the result */
//              }
//            },{access_token : userAuth.access_token});
//          $http({
//            method: 'POST', 
//            url: 'https://graph.facebook.com/' + place_id
//          }).
//          success(function(data, status, headers, config) {
//              console.log(data);
//          }).
//          error(function(data, status, headers, config) {
//              console.log("AJAX Error.");
//          });
    }
    
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
                $scope.calculateDistance(userPosition.coords.latitude,userPosition.coords.longitude);
            },
            fail:function(){
                $.get("http://ipinfo.io", function(response) { // get the current city
                    $scope.calculateDistance(parseFloat(response.loc.split(",")[0]),parseFloat(response.loc.split(",")[1]));    

                }, "jsonp");
                //TODO: get from ipinfo.io
            }
    });
                                      
    //pass the current location
    $scope.calculateDistance = function(lat,lon){
        if($scope.place != undefined){
            var location = $scope.place.get("location");
            var distance = getDistance(lat,lon, location.latitude, location.longitude, "K");
            $scope.place.distance = Math.round(distance * 10) / 10;
        }
//        $scope.$apply();
    }
}]);