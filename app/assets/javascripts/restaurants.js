/*
 * GOOGLE MAPS API SCRIPT 
 *
 * This script will:
 * - Load the gmaps API
 * - Get all restaurants info from the database
 * - Create a map with markers for each restaurant
 * - Allow its creator to bask in eternal glory
 *
 */

$(document).ready(ready);           //calls for the function we defined above (first loading)

function ready() {
  var script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBIez1GM_iyBa6nvMkd93F3bi-nYTzssO4&sensor=false&callback=restaurants';
    document.body.appendChild(script);
};

// Retrieve JSON restuarant information asynchronously from Rails DB
function restaurants() {
  $.ajax({
      type: "GET",
      accept: 'application/json',
      url: 'restaurants.json',
  })
    .done(function( xhr, textStatus, response ) {
      restaurants = xhr; // Create 'restaurants' array from JSON response
      initialize(); // Start the 'initialize' function for google maps
  })
  .fail( function( response, textStatus, errorThrown ) {
    console.log(response);
    console.log(textStatus);
    console.log(errorThrown);
  });
};

// Set global variable array for use in showMarker() function
var gmarkers  = [];
var map       = null;
var latArray  = [];
var lngArray  = [];

function initialize() {
  
  // Set global Google Maps variables
  var mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP }
  var geocoder = new google.maps.Geocoder();
  var bounds = new google.maps.LatLngBounds ();
  var infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  // Loop through locations...
  for (i = 0; i < restaurants.length; i++) {
    
    // Create 'View on Map' links
    var nameId = '#'+restaurants[i].name            // Get restaurant name and prepended '#'...
      .toLowerCase()                                // ... make lowercase,
      .replace('\'', '')                            // ... remove apostrophes,
      .replace(/\s+/g, '')                          // ... remove spaces,
      +' .view-on-map';                             // ... add 'view-on-map' class.
    $(nameId).attr('onclick', "showMarker("+i+")"); // Find div with that ID, add 'onclick' attribute for corresponding marker

    // Geocode function
    function codeAddress() {

      // Create variables to populate infoWindow
      var name    = restaurants[i].name,
          desc    = restaurants[i].description,
          addr    = restaurants[i].address,
          phone   = restaurants[i].phone,
          allInfo = '<h4 style="margin: 0 0 5px;">'+name+'</h4>'+
                    '<em>'+desc+'</em>'+
                    '<p>'+addr+'<br>'+
                    phone+'</p>'

      // Geocode using location address
      geocoder.geocode( { 'address': addr }, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

          var marker = new google.maps.Marker({
              map:        map,
              position:   results[0].geometry.location,
              animation:  google.maps.Animation.DROP,
          });

          gmarkers.push(marker); // Add markers to array, to use for showMarker() function

          // Create latitude and longitude arrays, for panning map inside showMarker() function
          var lat = marker.position.k;
          var lng = marker.position.D;
          latArray.push(lat)
          lngArray.push(lng)

          google.maps.event.addListener (marker, 'click', (function (marker, i) { // Create infoWindow
            return function() {
              infowindow.setContent(allInfo); 
              infowindow.open(map, this);   
            }
          })(marker, i));
          
          bounds.extend(results[0].geometry.location); // Set bounds of map to fit all markers

          map.fitBounds(bounds); // Load map with these bounds

        } else {

          console.log('Geocode was not successful for the following reason: ' + status);

        }

      });

    }

    // Code the addresses!
    codeAddress();

  }

  // Load the map after window loads
  google.maps.event.addDomListener(window, 'load', initialize);

  }

// Show a marker using 'onclick attribute'
function showMarker(id) {
  google.maps.event.trigger(gmarkers[id],'click'); // Show infoWindow
  var latLng = new google.maps.LatLng(latArray[id], lngArray[id]); // Get lat/lng of marker
  map.panTo(latLng); // Pan to marker on map
  if (map.getZoom() < 15) { // Set zoom level, if not already zoomed in
    map.setZoom(15);
  }
}