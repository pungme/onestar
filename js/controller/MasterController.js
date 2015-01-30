
oneStarApp.controller("MasterController",[ '$scope','$http', 'locationService',function($scope,$http,locationService){

   $scope.injectDisqusComment = function(){
        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
        var disqus_shortname = 'onestar'; // required: replace example with your forum shortname

        /* * * DON'T EDIT BELOW THIS LINE * * */
        (function () {
        var s = document.createElement('script'); s.async = true;
        s.type = 'text/javascript';
        s.src = '//' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
        }());
   }
   
   $scope.shrinkLogo = function(){
        $('#circle-logo ').css('width', '50px').css('height','50px');
        $('#star-logo').css('width', '40px').css('margin-top','4px');
   }
   
   $scope.enlargeLogo = function(){
        $('#circle-logo ').css('width', '100px').css('height','100px');
        $('#star-logo').css('width', '80px').css('margin-top','9px');
   }
    
    
//   $scope.hoverInCard = function(){
//       $scope.injectDisqusComment();
//   }
}]);