// ***** --- Defined Global Variable Area--- *****
var qualityLive_map;
var userLoc;
var googleMarkers;
var infowindow;
var directionsService;
var directionsDisplay;
// ***** --- Defined Global Variable Area--- *****

/*
    When browser load html or user resize screen,
    it will be triggered by qualityLive.js
    (It's written in qualityLive.js)
*/
function detectScreen(){
    // ***** Detect Screen *****
    var screenWidth = $(window).width()
    var screenHeight = $(window).height()

    // ***** Default Screen Size *****
    $('.mapArea').css({
        'width' : screenWidth,
        'height' : screenHeight
    })
}

function markersDisplay(markers, map){

    /* --- Removing markers when user switch facility --- */
    if(googleMarkers !== undefined){
        googleMarkers.map(function(marker) {
            marker.setMap(null);
        })
    }

    /* --- Marker defined here... --- */
    googleMarkers = markers.map(function(marker){
        var markerElm = new google.maps.Marker({
            position: {lat: marker.latitude, lng: marker.longitude},
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            icon : {
                url : '/qualityLife/images/customMarker.jpeg',
                scaledSize: new google.maps.Size(90, 90)
            }
        })

        /* ---  Marker pop out window --- */
        var contentString =
            '<div id="content">'+
                '<h1 id="firstHeading" class="firstHeading">Hello Map</h1>'+
            '</div>'
        infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
        })

        /*
        --- Marker Click Event Listening ---
            * When users clicked marker ...
            1. it will open info window.
            2. it will trigger directionService.
        */
        markerElm.addListener('click', function() {
            calculateRoute(userLoc, this.position, directionsService, directionsDisplay)
            infowindow.open(map, markerElm);
        })
        return markerElm
    })
}

// function markersRemove() {
//     markers.map(function(marker) {
//         marker.setMap(null);
//     })
// }

function calculateRoute(origin, destination, directionsService, directionsDisplay){

    var requests = {
        origin : origin,
        destination : destination,
        travelMode : 'WALKING'
    }
    directionsService.route(requests, function(result, status){
        if(status === "OK"){
            directionsDisplay.setDirections(result)
        }
    })
}

function initMap(){
    navigator.geolocation.getCurrentPosition(function(position) {

        userLoc = { lat : position.coords.latitude, lng : position.coords.longitude} // {lat: 25.046, lng: 121.540}
        qualityLive_map = new google.maps.Map(document.getElementById('qualityLive_map'),{
                clickableIcons : false,   // icon and building click avalible.
                disableDefaultUI : false,   // Default zoom in/out UI -> default:false
                center: userLoc, // Map View Center -> required
                zoom: 19,  // zoom size -> required
                fullscreenControl : false, // -> default:true
                mapTypeControl : false,  // MapStyle
                // mapTypeId : 'roadmap'  // Display type of map
            }
        )

        /* --- GeoMarker plugin will get users location and set special marker --- */
        var GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({
            visible : false
        });
        GeoMarker.setMap(qualityLive_map);

        // *** addListenerOnce | addListener ***
        // *** Listen GeoMarker Position. When User changed position, View will be reset center ***
        // google.maps.event.addListener(GeoMarker, 'position_changed', function() {
            // qualityLive_map.setCenter(this.getPosition());
            // qualityLive_map.fitBounds(this.getBounds());
        // });

        // navigator.geolocation.watchPosition(function(position) {
        //     var latitude = position.coords.latitude;
        //     var longitude = position.coords.longitude;
        //     var geolocpoint = new google.maps.LatLng(latitude, longitude);
        //     qualityLive_map.setCenter(geolocpoint);
        // });

        // ***** When listening center_changed, it will panTo marker position after 3 secs*****
        // qualityLive_map.addListener('center_changed', function() {
        //     window.setTimeout(function() {
        //         map.panTo(marker.getPosition());
        //     }, 3000);
        // });

        $('#setView').on('click', function () {
            qualityLive_map.panTo(GeoMarker.getPosition());
        })

        /* --- When User switch explore selection, it will trigger explore function --- */
        $('input[type="radio"]').on('click', function(){

            /* ---------- Create Direction Service ---------- */
            if(directionsService !== undefined){
                directionsDisplay.setMap(null)
            }
            directionsService = new google.maps.DirectionsService
            directionsDisplay = new google.maps.DirectionsRenderer
            directionsDisplay.setMap(qualityLive_map)
            directionsDisplay.setOptions( { suppressMarkers: true } )

            /* ---------- Query explore marker Ajax promise ---------- */
            var url = '/qualityLife/dataAPI/v1/explore'
            var payload = {category : $(this).val()}
            var type = 'POST'
            var timeout = 15000

            var promise = ajax_dict.explore(url, payload, type, timeout)
            promise
            .done(function(data){
                markersDisplay(data, qualityLive_map)
            })
            .fail(ajax_dict.errorRsp);
        })

        /*
        --- Map Click Event Listening ---
            This function will close infowindow of markers,
            when you click on map.
        */
        google.maps.event.addListener(qualityLive_map, "click", function(event) {
            infowindow.close()
        });
    });
}
