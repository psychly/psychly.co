// dynamic google map and markers that reacts to the search and filters on the browse page
  window.addEventListener('load', function () {
    setTimeout(function() {
      var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 14,
        scrollwheel: true
      });

      // Function to update map markers
      window.updateMarkers = function() {
        // Clear out the old markers if they exist.
        if (window.markers) {
          window.markers.forEach(function(marker) {
            marker.setMap(null);
          });
        }

        var locations = [];
        var dynPlaces = document.querySelectorAll('.collection');
        dynPlaces.forEach(function(elem) {
          var place = [];
          var pName = elem.querySelector('.practice-name').innerText;
          var pLat = Number(elem.querySelector('.lat').innerText);
          var pLong = Number(elem.querySelector('.long').innerText);

          place.push(pName, pLat, pLong);
          locations.push(place);
        });

        var bounds = new google.maps.LatLngBounds();
        locations.forEach(function(location) {
          var latlng = new google.maps.LatLng(location[1], location[2]);
          bounds.extend(latlng);
        });

        // Only adjust the bounds if there are markers.
        if (locations.length > 0) {
          map.fitBounds(bounds);
        }

        var infowindow = new google.maps.InfoWindow();

        // Store markers globally to access them for removal later
        window.markers = locations.map(function(location) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location[1], location[2]),
            map: map,
            title: location[0]
          });

          marker.addListener('click', function() {
            infowindow.setContent(location[0]);
            infowindow.open(map, marker);
          });

          return marker;
        });
      };

      // Function to reset the map view
      window.resetMap = function() {
        // Call updateMarkers to reset markers on the map
        updateMarkers();
      };

      // Initial call to update markers
      updateMarkers();

    }, 500);
  }, false);
