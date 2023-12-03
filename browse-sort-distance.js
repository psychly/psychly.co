document.addEventListener('DOMContentLoaded', function() {
  const sortButton = document.getElementById('browse-sort-distance'); // Sort button
  const cl = document.getElementById("collection-list"); // Collection list
  let userLocation = null;

  // Function to calculate distance
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Function to sort items by distance
  function sortByDistance() {
    if (!userLocation) {
      alert("Please provide a location first.");
      return;
    }

    let items = Array.from(cl.children);
    items.sort((a, b) => {
      const aLat = parseFloat(a.querySelector('.lat').textContent);
      const aLng = parseFloat(a.querySelector('.long').textContent);
      const bLat = parseFloat(b.querySelector('.lat').textContent);
      const bLng = parseFloat(b.querySelector('.long').textContent);

      const distanceA = calculateDistance(userLocation.lat, userLocation.lng, aLat, aLng);
      const distanceB = calculateDistance(userLocation.lat, userLocation.lng, bLat, bLng);

      return distanceA - distanceB;
    });

    // Clear and append sorted items
    cl.innerHTML = '';
    items.forEach(item => cl.appendChild(item));
  }

  // Function to get user location from ZIP code using Google Maps Geocoder
  function getUserLocationFromZip(zipCode, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': zipCode }, function(results, status) {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        callback({ lat: location.lat(), lng: location.lng() });
      } else {
        alert("Geocoding failed: " + status);
      }
    });
  }

  // Event listener for the sort button
  sortButton.addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const zipCode = urlParams.get('searchLocation');
    if (zipCode) {
      getUserLocationFromZip(zipCode, function(location) {
        userLocation = location;
        sortByDistance();
      });
    } else {
      alert("ZIP code not provided in URL.");
    }
  });
});
