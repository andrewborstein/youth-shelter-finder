// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

/*
jQuery(function($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIez1GM_iyBa6nvMkd93F3bi-nYTzssO4&sensor=false&callback=initialize";
    document.body.appendChild(script);
});
*/

ready = function() {
  var script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBIez1GM_iyBa6nvMkd93F3bi-nYTzssO4&sensor=false&callback=restaurants';
    document.body.appendChild(script);
};

// console.log(restaurants);
// console.log(locationsJSON)

function restaurants() {
  $.ajax({
      type: "GET",
      accept: 'application/json',
      url: 'http://localhost:3000/restaurants.json',
  })
    .done(function( xhr, textStatus, response ) {
      locationsJSON = xhr;
      initialize();
  })
  .fail( function( xhr, textStatus, errorThrown ) {
    alert(xhr.responseText);
    alert(textStatus);
  });
};

var viewMap = null;
var map;

function initialize() {

  var locationsArray = locationsJSON; 

  var geocoder;
  
  var markersArray = [];
  var bounds;
  var infowindow =  new google.maps.InfoWindow({
      content: ''
  });

    geocoder = new google.maps.Geocoder();
    bounds = new google.maps.LatLngBounds ();

    var myOptions = {
      zoom: 2, 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
      }
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); // Attach gmap to #map_canvas

    console.log('map') 
    console.log(map) 
    plotMarkers();

    function plotMarkers(){      
      for( i in locationsArray ){ // For each restaurant in the restaurants array...
          codeAddresses(locationsArray[i]); // Create function to retrieve its info
      }
    }

    function codeAddresses(restaurant){
      geocoder.geocode( { 'address': restaurant.address}, function(results, status) { 

        if (status == google.maps.GeocoderStatus.OK) {
          marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
          });

          var name = '#'+restaurant.name.toLowerCase().replace('\'', '').replace(/\s+/g, '')+' .view-on-map';
          // console.log(name);
          // console.log(marker.map);
          console.log('marker');
          var lat = marker.position.k;
          var lng = marker.position.D;
          var viewMap = 'zoomMarker()';
          $(name).attr('onclick', viewMap);

          console.log(marker.getPosition());
          console.log(marker.position.k);
          console.log(marker.position.D);

          google.maps.event.addListener(marker, 'click', function() {
            var name = restaurant.name,
                desc = restaurant.description,
                addr = restaurant.address,
                phone = restaurant.phone,
                allInfo = '<h4 style="margin: 0 0 5px;">'+name+'</h4>'+
                          '<em>'+desc+'</em>'+
                          '<p>'+addr+'<br>'+
                          phone+'</p>'
            infowindow.setContent(allInfo);
            infowindow.open(map, this);
          });

          bounds.extend(results[0].geometry.location);

          markersArray.push(marker); 
        }
        else{
          alert("Geocode was not successful for the following reason: " + status);
        }

        map.fitBounds(bounds);
      });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
    
}

function zoomMarker() {
  //google.maps.event.trigger(gMarker, 'click', {
  //     latLng: center
  //});
  map.setZoom(8);
  map.setCenter(marker.getPosition());
  console.log(viewMap)
}