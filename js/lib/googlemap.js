//function initialize() {
//  var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
//  var mapOptions = {
//    zoom: 4,
//    center: myLatlng
//  }
//  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
//  var marker = new google.maps.Marker({
//      position: myLatlng,
//      map: map,
//      title: 'Hello World!'
//  });
//}

//google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            myOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);