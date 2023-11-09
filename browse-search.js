//search bar input searches collection. user must click search or press enter. searches browse page
<script>
const clw = document.getElementById("collection-list-wrapper"),
      cl = document.getElementById("collection-list"),
      sb = document.getElementById("BrowseSearchGeneral"),
      cb = document.getElementById("clear-search"),
      gi = document.getElementById("BrowseSearchLocation"),
      gr = document.getElementById("geocode-response"),
      searchButton = document.getElementById('browse-search-button'); // Search button
let oi = Array.from(cl.children);

// Calculate distance between two points using latitude and longitude
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

// Function to handle the search
function handleSearch() {
  let fi = oi;
  const st = sb.value.toLowerCase();

  // If a location is provided, use it to filter the results
  if (gi.value) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': gi.value }, function(results, status) {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        gr.value = `${location.lat()}, ${location.lng()}`;
        // Filter by distance first, then by the general search term if provided
        fi = filterByDistance(fi, location.lat(), location.lng());
        if (st) {
          fi = filterBySearchTerm(fi, st);
        }
        displayResults(fi);
      } else {
        gr.value = "Geocoding failed: " + status;
      }
    });
  } else if (st) {
    // If only a general search term is provided, filter by it
    fi = filterBySearchTerm(fi, st);
    displayResults(fi);
  }
}

// Filter the list by distance from the given latitude and longitude
function filterByDistance(list, lat, lng) {
  return list.filter(item => {
    const itemLat = parseFloat(item.querySelector('.lat').textContent);
    const itemLng = parseFloat(item.querySelector('.long').textContent);
    return calculateDistance(lat, lng, itemLat, itemLng) <= 50;
  });
}

// Filter the list by the search term
function filterBySearchTerm(list, searchTerm) {
  return list.filter(item => {
    const name = item.querySelector('#practice-name').textContent.toLowerCase();
    const type = item.querySelector('#practice-type').textContent.toLowerCase();
    return name.includes(searchTerm) || type.includes(searchTerm);
  });
}

// Display the filtered results
function displayResults(filteredItems) {
  cl.innerHTML = ''; // Clear current list
  filteredItems.forEach(item => cl.appendChild(item));
  updateURL(sb.value, gi.value);

  // Update the map with new markers
  if (window.updateMarkers) {
    window.updateMarkers();
  }
}

// Update the URL with the search parameters
function updateURL(searchGeneral, searchLocation) {
  const currentUrl = new URL(window.location);
  const searchParams = new URLSearchParams(currentUrl.search);
  searchParams.set('searchGeneral', searchGeneral);
  searchParams.set('searchLocation', searchLocation);
  history.pushState(null, '', `${currentUrl.pathname}?${searchParams}`);
}

searchButton.addEventListener('click', handleSearch);
sb.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearch(); });
gi.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearch(); });
cb.addEventListener("click", function() {
  sb.value = "";
  gi.value = "";
  gr.value = "";
  cl.innerHTML = ''; // Clear current list
  oi.forEach(item => cl.appendChild(item));
  history.pushState(null, '', window.location.pathname);
});

window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  sb.value = urlParams.get('searchGeneral') || '';
  gi.value = urlParams.get('searchLocation') || '';
  if (sb.value || gi.value) {
    handleSearch();
  }
};
</script>
