/**
 * Created by Harshit on 12/2/2016.
 */

var MapPoints = "";
var geocoder;
var directionsService;
var directionsDisplay;
var map;

function initialize() {
    initMap();
    initAutocomplete();
}

function clearBox()
{
    document.getElementById('distance').innerHTML = "";
    document.getElementById('duration').innerHTML = "";
    for(var i = 0; i < 10; i++)
    {
        var elementExists = document.getElementById("button" + i);
        if(elementExists) {
            elementExists.parentNode.removeChild(elementExists);
        }
    }
    initMap();
}
function initMap() {
   // document.getElementById("duration").clearAttributes();
    document.getElementById("origin-input").value = "";
    document.getElementById("destination-input").value = "";
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.782, lng: -122.445},
        zoom: 15
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function initAutocomplete() {
        var origin_place_id = null;
        var destination_place_id = null;
        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');
        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        var destination_autocomplete =
            new google.maps.places.Autocomplete(destination_input);

        origin_autocomplete.addListener('place_changed', fillInAddress);
        destination_autocomplete.addListener('place_changed', fillInAddress);
    }

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
}

function getRoute(){
    if (document.getElementById("origin-input").value.length <= 0 || document.getElementById("destination-input").value.length <= 0) {
        window.alert("Source/Destination is Empty")
    }
    else {

        for(var i = 0; i < 10; i++)
        {
            var elementExists = document.getElementById("button" + i);
            if(elementExists) {
                elementExists.parentNode.removeChild(elementExists);
            }
        }

        var lat1 = null;
        var long1 = null;
        var lat2 = null;
        var long2 = null;

        var allAddresses = [document.getElementById("origin-input").value, document.getElementById("destination-input").value];

        getLatLng(allAddresses, function (results) {
            console.log("received all addresses:", results);
            lat1 = results[0][0];
            long1 = results[0][1];
            lat2 = results[1][0];
            long2 = results[1][1];

            var src = document.getElementById("origin-input").value;
            var des = document.getElementById("destination-input").value;
            var inp = document.getElementById("futureDate").value;

            if ($('#cbox1').prop('checked') && inp.length <= 0) {
                window.alert("Date is Empty")
            }

            else {
                if (document.getElementById("futureDate").value != "") {
                    var date = document.getElementById("futureDate").value;
                    console.log(date);
                    var modeType = document.getElementById('mode').value;
                    // $.get("http://fogmapsapi.us-west-1.elasticbeanstalk.com/best_route?origin=" + lat1 + "," + long1 + "&destination=" + lat2 + "," + long2 + "&mode=" + modeType + "&date=" + date, function (data) {
                    $.get("https://maps.googleapis.com/maps/api/directions/json?origin=Santa+Clara&destination=San+Jose&alternatives=true&key=AIzaSyDngvpXqERGAGvOAbyani3tgOoirZgBxSY", function (data) {
                        MapPoints = data;
                        initNewRoute(MapPoints);
                    });
                }

// do something
                else {
                    // $.get("http://fogmapsapi.us-west-1.elasticbeanstalk.com/best_route?origin=" + lat1 + "," + long1 + "&destination=" + lat2 + "," + long2 + "&mode=" + modeType, function (data) {
                    $.get("https://maps.googleapis.com/maps/api/directions/json?origin=Santa+Clara&destination=San+Jose&alternatives=true&key=AIzaSyDngvpXqERGAGvOAbyani3tgOoirZgBxSY", function (data) {
                        MapPoints = data;
                        initNewRoute(MapPoints);

                    });
                }
            }
        });
    }
}

function getLatLng(addresses, callback) {
    var coords = [];
    addresses.forEach(function(address) {

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                coords.push([lat, lng]);

                // all addresses have been processed
                if (coords.length === addresses.length)
                    callback(coords);
            }
        });
    });
}
var locations1;
function initNewRoute(MapPoints) {

   /* if (document.getElementById("origin-input").value.length <= 0 || document.getElementById("destination-input").value.length <= 0) {
        window.alert("From/To is Empty")
    }
    else {*/
        directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
           /* polylineOptions: {
                strokeColor: "green"
            }*/
        });
        if (jQuery('#map').length > 0) {

            var locations = JSON.stringify(MapPoints);
            locations1 = JSON.parse(locations);
            console.log(locations1.routes.length);
            var pages = locations1.routes.length;
            var pageButtons = $('#pageButtons');
            for (var i = 0; i < pages; i++) {
                pageButtons.append('<input type="button" class = "btn btn-primary" id="button' + i + '" value="Route' + " " + i + '" style = "margin: 10px" onClick = "showRoute('+i+')"/>');
                // pageButtons.append('<div class="divider" style = "width: 5px"/>')
            }
            showRoute(0);
        }}
function showRoute(i) {
console.log(i);
    var flightPlanCoordinates = [];
            var start = locations1.routes[i].legs[0].start_location;
            var end = locations1.routes[i].legs[0].end_location;
            var distance = locations1.routes[i].legs[0].distance.text;
            var duration =  locations1.routes[i].legs[0].duration.text;
            var coordinates = [start,end];

                    var route = locations1.routes[i];
                    var leg = route.legs[0];
                        // Leg atribuutit
                        for (k = 0; k < leg.steps.length-1; k++) {
                            var step = leg.steps[k];
                            flightPlanCoordinates.push(step.end_location);
                        }

            map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            });
            directionsDisplay.setMap(map);

           // var infowindow = new google.maps.InfoWindow();

            var bounds = new google.maps.LatLngBounds();

            for (i = 0; i < coordinates.length; i++) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(coordinates[i],coordinates[i]),
                    map: map
                });
               /* google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[i]['title']);
                        infowindow.open(map, marker);
                    }
                })(marker, i));*/
            }

            bounds.extend(locations1.routes[i].bounds.northeast);
            bounds.extend(locations1.routes[i].bounds.southwest);
            map.fitBounds(bounds);

            // directions service configuration
            var waypts = [];
            for (var i = 0; i < flightPlanCoordinates.length; i++) {
                waypts.push({
                    location: flightPlanCoordinates[i],
                    stopover: true
                });
            }
            calcRoute(start, end, waypts);
            document.getElementById("distance").innerHTML = "Total Distance: " + distance;
            document.getElementById("duration").innerHTML = "Estimated Duration: " + duration;
        //}
   // }
}

function calcRoute(start, end, waypts) {
    directionsService = new google.maps.DirectionsService();
    var selectedMode = document.getElementById('mode').value;
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[selectedMode]
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        }
        else
        {
            alert('No Route Found',status);
        }
    });
}

$(function () {
    $("#cbox1").click(function () {
        if ($(this).is(":checked")) {
            $("#datetimepicker1").show();
        } else {
            $("#datetimepicker1").hide();
           // document.getElementById('futureDate').value = "";
            $('#futureDate').val("");
        }
    });
});

