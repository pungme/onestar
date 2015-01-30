
oneStarApp.controller("MainController",[ '$scope','$http', 'locationService',function($scope,$http,locationService){
    console.log("Main Controller loaded");
//    $scope.CLIENT_ID = "PHKKTXSG2M0I5CXJFKZKXQ4ALX3G3CO13YASIUEX3OPTEKWV";
//    $scope.CLIENT_SECRET = "RQF2NDLN3ARNLQ3LDSAL2RK5WYTL20E4QW2QFNXBHLLY5IQT";
//    $scope.GOOGLE_API_KEY = "AIzaSyAJxIsvGYFXhFHOusqY2r2_jMlyK0TzAnc";
    $scope.reviewData = {};
    $scope.isLoaded = false;
    $scope.selectedIndex = -1;
    $scope.searchSelectIndex = -1;
    $scope.searchText = "";
    $scope.searchResults = [];
    $scope.locationService = locationService;  
    $scope.showSearchLoading = false;
    $scope.showNoResults = false;
    $scope.userLocation;
    
    $scope.searchPlaces = function(keyEvent) {
      if (keyEvent.which === 13){
          $scope.showNoResults = false;
          $scope.showSearchLoading = true;
          $scope.searchNearbyPlacesFromFacebook($scope.searchText);
      } 
    }
    
    $scope.createNewPlace = function(data){
          
          $http({
            method: 'POST', 
            url: 'php/facebook_place.php',
            data:{
                place_id:data.id,
                parameter:'/picture?type=large&redirect=false&'
            }
          }).
          success(function(response, status, headers, config) {
              var pictureUrl = response.data.url;

                  $http({
                    method: 'POST', 
                    url: 'php/facebook_place.php',
                    data:{
                        place_id:data.id,
                        parameter:'?'
                    }
                  }).
                  success(function(response, status, headers, config) {
                        var placeData = response;
                        console.log(placeData);
                        var Places = Parse.Object.extend("Places");
                        var place = new Places();

                        place.set("name", placeData.name);
                        var point = new Parse.GeoPoint({latitude: placeData.location.latitude, longitude: placeData.location.longitude});
                        place.set("location", point);
                        place.set("place_id", placeData.id);
                        place.set("image_url", pictureUrl);
                        place.set("city", placeData.location.city);
                        place.set("country", placeData.location.country);
//                        place.set("state", placeData.location.state);
                        place.set("street", placeData.location.street);
                        place.set("zip", placeData.location.zip);
                        place.set("category", placeData.location.category);
                        place.set("description", placeData.description);
                      
                        place.save(null, {
                          success: function(object) {
                              console.log('new object saved');
                              console.log(object);
                              window.location = '#place?objectId=' + object.id;

                          },
                          error: function(object, error) {
                            console.log(error);
                          }
                        });
                  }).
                  error(function(data, status, headers, config) {
                      console.log("AJAX Error.");
                  });
//              console.log(response);
            
          }).
          error(function(data, status, headers, config) {
              console.log("AJAX Error.");
          });
    }
    
    $scope.onSearchResultPlaceNameClick = function(data,$index){
        console.log(data);
        console.log($index);
        if($scope.searchSelectIndex != $index){ // check if click the same
            $scope.searchSelectIndex = $index;
        }
        // look up in parse, if exist go to url
        // if not add new, and go to the url with that objectid
    
        var Places = Parse.Object.extend("Places");
        var query = new Parse.Query(Places);
        query.equalTo("place_id", data.id);

        query.first({
          success: function(object) {
              if(object){
                    window.location = '#place?objectId=' + object.id;
              }else{
                  //visualize loading .... 
                    $scope.createNewPlace(data);
              }
//              $scope.place = object;
//
////              $scope.getPlaceDescription(object.get("place_id"));
//              
//              if($scope.userLocation){
//                $scope.calculateDistance($scope.userLocation.lat,$scope.userLocation.lon);
//              }
//              
//              $scope.loadReviewsOfPlace($scope.place);
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
        
       
    }
    
//    $scope.mouseDown = function(){
//        $scope.showFlipBack = true;
//    }
//    
//    $scope.mouseUp = function(){
//        $scope.showFlipBack = false;
//    }
//    
    
    $scope.askForFacebookLogin = function(){
        //TODO:
    }
    $scope.onPlaceNameClick =function(object_id){
        window.location = '#place?objectId=' + object_id;
    }
    
    $scope.searchNearbyPlacesFromFacebook = function(searchtext){
        
        var userLocation = $scope.locationService.getLocation();
          $http({
            method: 'POST', 
            url: 'php/facebook_search.php',
            data:{
                location:userLocation.lat +','+ userLocation.lon,
                searchtext:searchtext
            }
          }).
          success(function(response, status, headers, config) {
              var data = response.data;
              console.log(data);
              $scope.searchResults = data;
//              $scope.showNoResults = false;
              
              if(data == undefined || data.length == 0){
                $scope.searchResults = [];
                $scope.showNoResults = true;
              }
              
              //distance for search results.
                for(var i = 0; i < $scope.searchResults.length ; i++){
                    var data = $scope.searchResults[i];
                    var location = data.location;
                    var distance = getDistance(userLocation.lat,userLocation.lon, location.latitude, location.longitude, "K");
                    $scope.searchResults[i].distance = Math.round(distance * 100) / 100;
                }
              $scope.showSearchLoading = false;

          }).
          error(function(data, status, headers, config) {
              console.log("AJAX Error.");
          });
    }
    
    /////////// STILL Struggling /////////// 
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
    
    $scope.onSearchType = function(searchText){
        console.log(searchText);   
        if(searchText.length <= 0){
            $('#circle-logo ').css('width', '100px').css('height','100px');
            $('#star-logo').css('width', '80px').css('margin-top','9px');
        }else{
            $('#circle-logo ').css('width', '50px').css('height','50px');
            $('#star-logo').css('width', '40px').css('margin-top','4px');
        }
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
    /////////// TODO: move this to core-graphic.js ///////////
    
    
    $scope.loadReviewFromParse = function(lat,lon){
        
        var Reviews = Parse.Object.extend("Reviews");
        var point = new Parse.GeoPoint({latitude: lat, longitude: lon});
        var query = new Parse.Query(Reviews);
        query.include("place");
        query.include("reviewer");
        query.near("location", point);
        query.limit(20);
        
//      TODO : query and get the closet one first.
        query.find({
          success: function(results) {
              $scope.reviewData = results;
              $scope.calculateDistance(lat,lon);
              $scope.isLoaded = true;
              $scope.$apply();
              
//              setTimeout(function() {
//                    $scope.injectDisqusComment();
//              }, 4000);
//              $scope.injectDisqusComment();
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
              $scope.locationService.setLocation(userPosition.coords.latitude,userPosition.coords.longitude);
              $scope.loadReviewFromParse(userPosition.coords.latitude,userPosition.coords.longitude);
            },
            fail:function(){
                console.log("User Denied.");
                $.get("http://ipinfo.io", function(response) { // get the current city
                     $scope.locationService.setLocation(parseFloat(response.loc.split(",")[0]),parseFloat(response.loc.split(",")[1]));
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
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////  
////////////////////////// get data from third party tryout, nothing work sofar. /////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
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
          $scope.fourSqData = data;
//          $scope.yelpData = data;
      }).
      error(function(data, status, headers, config) {
          console.log("AJAX Error.");
      });
        
    }
}]);