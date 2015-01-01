var oneStarApp = angular.module("oneStarApp",['ngRoute']);

oneStarApp.controller("MainController",function($scope,$http){
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
         // console.log(data);
          //$scope.data = data;
//          $scope.strangerData = data[0];
//          $scope.strangerImgName = data[0].imgpath;
//          $scope.strangerId = data[0].id;
//          $scope.numsent = data[0].numsent; 
          //$scope.strangerEmail = data[0].email;
      }).
      error(function(data, status, headers, config) {
          console.log("AJAX Error.");
      });
    }
    
    //let take this as a secondary
    $.get("http://ipinfo.io", function(response) { // get the current city
        console.log(response);
        var location = response.city;
        
        if(!location){
            location = response.country;
        }
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