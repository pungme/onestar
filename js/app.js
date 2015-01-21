Parse.initialize("IqCqoOaKylK6hSZbgN4PS35UIcoHbc32vt5cLXjW", "PABcZoVcVUt5aPQyC3Z2re6fOd9sakjJWSozoB7G"); // initial parse
var oneStarApp = angular.module("oneStarApp",['ngRoute','ngMap']);

//oneStarApp.config(function($httpProvider){
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
//});

//oneStarApp.config(function($locationProvider) {
//    $locationProvider.html5Mode(true);
//});

oneStarApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/main.html',
    controller : 'MainController' //this is the main controller
  })
  .when('/place', {
    templateUrl: 'partials/place.html',
    controller : 'PlaceController'  
  })
});
