//var apiKey='AIzaSyA4RKDWn0lwizH9Tm2BFWUGa-pMn_xZ8bM';
var map;
// var service;
var infowindow;

var lng, lat;
var markers = [];

function initialize() {
    var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });
    var input = document.getElementById('auto-complete');
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        } else {
            console.log('place!!!!!', place);
        }

        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();

        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
        console.log(place.geometry.location);
        findCoupons(lng, lat, $('#search-coupon-input').val());

    });


}
initialize();

function getUserLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(response) {
            //console.log(response);
            var position = {
                lng: response.coords.longitude,
                lat: response.coords.latitude,
            }
            lng = position.lng;
            lat = position.lat;
            map.setCenter(position);
            map.setZoom(20);
            var geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({ 'latLng': map.getCenter() }, function(result, status) {
                $('#auto-complete').val(result[0].formatted_address);
                findCoupons(position.lng, position.lat);

            })
        });

    } else {
        console.log("location not identified");
    }


}


getUserLocation();

function findCoupons(lng, lat, query) {
    var url = 'https://api.sqoot.com/v2/deals';
    var api_key = "h7-Xq3wp2EUVjb4W-u80";
    var location = lat + "," + lng;
    var radius = 5;

    map.setZoom(15);
    $.ajax({
        url,
        dataType: 'JSON',
        data: {
            api_key,
            location,
            radius,
            per_page: 100,
            query

        }

    }).then(function(response) {
        console.log("=========================",response);
        $('#coupons-data').empty();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        // response = ''
        if (response.query.total > 0){
            for (var i = 0; i < response.deals.length; i++) {
                var deal = response.deals[i].deal;
                var div = $('<div>').addClass('deal');
                div.append(`<h2><a href="${deal.untracked_url}" target="_blank">${deal.title}</a></h2>`);
                div.append(`<img src="${deal.image_url}">`);
                div.append(`
              	<ul style="float:left">
              		<li>
              			<h4><strong>Price:</strong><strike> $${deal.price + deal.discount_amount} </strike>$${deal.price}</h4>
              		</li>
              		<li>
              			<h4><strong>Discount Percentage:</strong> ${deal.discount_percentage*100}</h4>
              		</li>
              		<li>
              			<h4><strong>Expiration:</strong> ${moment(deal.expires_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}</h4>
              		</li>
        		</ul>`)

                div.append('<h6></h6>');
                div.append('<div style="float:none;clear:both;">');
                $('#coupons-data').append(div);

                var marker = createMarker(deal);
                markers.push(marker);
                var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                bounds.extend(loc);
            }
            map.fitBounds(bounds)
        }else {
            /*console.log("in else")
            var daModal = `<div id="myModal" class="modal fade" tabindex="-1" role="dialog">
                              <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">Modal title</h4>
                                  </div>
                                  <div class="modal-body">
                                    <p>One fine body&hellip;</p>
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save changes</button>
                                  </div>
                                </div><!-- /.modal-content -->
                              </div><!-- /.modal-dialog -->
                            </div><!-- /.modal -->`
            $('#coupons-data').append(daModal);
            $("#myModal").modal()*/
        }

    })
}

$('#search-button').on('click', function() {
    var query = $("#search-coupon-input").val();
    findCoupons(lng, lat, query);
})


var lastWindowOpened;

function createMarker(deal) {
    console.log(deal);
    var info = "<h4>" + deal.title + " " + deal.merchant.name + "<img src='" + deal.image_url + "' width='100px'>" + "</h4>"
    var infowindow = new google.maps.InfoWindow({
        content: info
    });
    var lat = deal.merchant.latitude;
    var lng = deal.merchant.longitude;
    var latLng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });


    marker.addListener('click', function() {
        if (lastWindowOpened) {
            lastWindowOpened.close();
        }
        infowindow.open(map, marker);
        lastWindowOpened = infowindow;
    });

    console.log(marker);
    return marker
}

$(document).ready(function(){
    if (!('webkitSpeechRecognition' in window)) {
        return;
    } else {
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      setTimeout(function(){
        recognition.stop();
      },10000);

      var clickedspeechBtn = false;
      var speechButton = $('<button type="button" class="btn btn-primary">').html('Speak');
      $('#search-button').after(speechButton);

      $(speechButton).on('click', function(){
        if(clickedspeechBtn) {
            return;
        }

        final_transcript = '';
        recognition.lang = 'en';
        recognition.start();
      })

      recognition.onstart = function(){
        clickedspeechBtn = true;
        $(speechButton).hide();
      }

      recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            $('#search-coupon-input').val(event.results[i][0].transcript);
            break;
          }
        }
      }
      recognition.onerror = function(event) {
        clickedspeechBtn = false;
        $(speechButton).show();
      }
      recognition.onend = function() {
        clickedspeechBtn = false;
        $(speechButton).show();
      }
  }
});