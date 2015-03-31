/*
 * GOOGLE MAPS API SCRIPT
 *
 * This script will:
 * - Load the gmaps API
 * - Get all shelters info from the database
 * - Create a map with markers for each shelter
 * - Allow its creator to bask in eternal glory
 *
 */

$(document).ready(ready);  //calls the 'ready' function

function ready() {
  var script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBIez1GM_iyBa6nvMkd93F3bi-nYTzssO4&sensor=false&libraries=geometry&callback=shelters';
    document.body.appendChild(script);
};


// Retrieve JSON restuarant information asynchronously from Rails DB
function shelters() {
  $.ajax({
      type: "GET",
      accept: 'application/json',
      url: 'shelters.json',
  })
    .done(function( xhr, textStatus, response ) {
      shelters = xhr; // Create 'shelters' array from JSON response
      initialize(); // Start the 'initialize' function for google maps
  })
  .fail( function( response, textStatus, errorThrown ) {
    console.log(response);
    console.log(textStatus);
    console.log(errorThrown);
  });
};


// Set global variable array for use in showMarker() function
var gmarkers        = [];
var map             = null;
var GeoMarker       = null;
var latArray        = [];
var lngArray        = [];
var userLocation    = null;
var nameIdDistances = [];
var distArray       = [];
var myMarker        = 0;
var bounds          = null;


function initialize() {

  // cache the userAgent
  useragent = navigator.userAgent;

  if (navigator.geolocation) {

    displayLocation();
    
    function displayLocation() {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        // build entire marker first time thru
        if ( !myMarker ) {
          // define our custom marker image
          var image = new google.maps.MarkerImage(
            'http://i.imgur.com/BdtrxIt.png',
            null, // size
            null, // origin
            new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
            new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
          );

          // then create the new marker
          myMarker = new google.maps.Marker({
            flat: true,
            icon: image,
            map: map,
            optimized: false,
            position: pos,
            title: 'user_location',
            visible: true
          });
        
        // just change marker position on subsequent passes
        } else {
          myMarker.setPosition( pos );
        }

        userLocation = pos; // Assign current position to variable

        // map.setCenter(userLocation); // Center the map around the current position

        console.log('Found you!'); // Notify the user they have been located (in the console)

        // Print the distances to table
        for (i = 0; i < shelters.length; i++) {
          $(nameIdDistances[i]).text(getDistance(i).toString()+' mi'); // Find corresponding div and print each distance
        }

        // Activate the 'Find Closest' button
        Array.prototype.max = function() {                              // Find max value in an array
          return Math.max.apply(null, this);
        };
        Array.prototype.min = function() {                              // Find min vaue in an array
          return Math.min.apply(null, this);      
        };
        var minVal = parseFloat(distArray.min()).toFixed(2);            // Get minimum value in distance array
        var minValIndex = distArray.indexOf(minVal)                     // Get index of that value
        $('#closest_shelter')
          .attr('onclick', "showMarker("+minValIndex+")")               // Append attribute to button with id '#closest'
          .text('Find Closest');                                        // Change button text
        $('#user_location')
          .attr('onclick', "showMe()")                                  // Append attribute to button with id '#user_location'
          .text('My Location');                                         // Change button text
        $('#all_shelters')
          .attr('onclick', "showAll()")                                 // Append attribute to button with id '#user_location'
          .text('View All');                                            // Change button text

      }, function() {
        handleNoGeolocation(true);
      });
    
    }

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }


  // Set global Google Maps variables
  var mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP }
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow({
    disableAutoPan: true
  });
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  bounds = new google.maps.LatLngBounds ();


  // Loop through locations...
  for (i = 0; i < shelters.length; i++) {

    // Create 'View on Map' links
    nameId = '#'+shelters[i].name                    // Get shelters name and prepended '#'...
      .toLowerCase()                                    // ... make lowercase,
      .replace('\'', '')                                // ... remove apostrophes,
      .replace(/\s+/g, '')                              // ... remove spaces,
    nameIdMap = nameId+' .view-on-map';                 // ... add 'view-on-map' class.
    nameIdDist = nameId+' .distance';                   // ... add 'distance' class.
    $(nameIdMap).attr('onclick', "showMarker("+i+")");  // Find div with that ID, add 'onclick' attribute for corresponding marker
    nameIdDistances.push(nameIdDist);

    // Geocode function
    function codeAddress() {

      // Create variables to populate infoWindow
      var name    = shelters[i].name,
          desc    = shelters[i].description,
          addr    = shelters[i].address,
          phone   = shelters[i].phone,
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
  if (map.getZoom() < 15) { // Set zoom level, if not already zoomed in
    map.setZoom(15);
  }
  var latLng = new google.maps.LatLng(latArray[id], lngArray[id]); // Get lat/lng of marker
  map.panTo(latLng); // Pan to marker on map
  getDistance(id);
}

// Show a marker using 'onclick attribute'
function getDistance(id) {
  var latLng = new google.maps.LatLng(latArray[id], lngArray[id]); // Get lat/lng of marker
  var dist = google.maps.geometry.spherical.computeDistanceBetween (userLocation, latLng);
  function getMiles(i) {
    var conversion = i*0.000621371192
    var twoDecimal = parseFloat(conversion).toFixed(2);
    return twoDecimal;
  }
  var distMiles = getMiles(dist);
  distArray.push(distMiles);
  return distMiles
}

// Center the map around the current user's position
function showMe() {
  map.setCenter(userLocation);
}

// Center the map around the current user's position
function showAll() {
  map.fitBounds(bounds);
}
