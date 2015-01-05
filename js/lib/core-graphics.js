var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
//    if (st > lastScrollTop && st > navbarHeight){
    if (st > 60){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        if(st <= 10){
             $('header').removeClass('nav-up').addClass('nav-down');
        }
//        console.log(st);
        // Scroll Up
//        if(st + $(window).height() < $(document).height()) {
//            $('header').removeClass('nav-up').addClass('nav-down');
//        }
    }
    
    lastScrollTop = st;
}
setTimeout(doSomething, 1000);

function doSomething() {
    $("#star-logo").realshadow({style:'flat',type:'drop',color: '84,131,218',length: 5});
    $("#circle-logo").realshadow({style:'flat',type:'drop',color: '84,131,218',length: 5});
   //do whatever you want here
}
//var $flat = document.getElementById('star-logo');
//        realshadow($flat.getElementsByTagName('span'), {type: 'text', style: 'flat', length: 40, color: '255,160,0'});
//        realshadow($flat.getElementsByTagName('i'), {type: 'text', style: 'flat', length: 40, color: '100,100,255'});
//        realshadow($flat.getElementsByTagName('b'), {type: 'text', style: 'flat', length: 40, color: '100,200,0'});
//        realshadow($flat.getElementsByTagName('u'), {type: 'text', style: 'flat', length: 40, color: '255,100,100'});

//$("#star-logo").realshadow({
//
//    followMouse: true,   // default: true
//
//    pageX: 0,             // x coordinate of the light source
//    pageY: 0,              // y coordinate of the light source
//
//    color: '0,127,255',    // shadow color, rgb 0..255, default: '0,0,0'
//
//    type: 'flat' // shadow type
//
//});