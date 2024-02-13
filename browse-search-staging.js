document.addEventListener('DOMContentLoaded', function() {
  const clw = document.getElementById("collection-list-wrapper"),
        cl = document.getElementById("collection-list"),
        sb = document.getElementById("BrowseSearchGeneral"),
        cb = document.getElementById("clear-search"),
        gi = document.getElementById("BrowseSearchLocation"),
        gr = document.getElementById("geocode-response"),
        searchButton = document.getElementById('browse-search-button');
  let oi = Array.from(cl.children);
  let debounceTimer;

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

  function handleSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch();
    }, 10); // Adjust the delay as needed
  }

  function performSearch() {
  let fi = oi; // Original items list
  const st = sb.value.toLowerCase(); // Search term from the general search input
  const urlParams = new URLSearchParams(window.location.search);
  const selectedLanguages = urlParams.get('language') ? urlParams.get('language').split(',') : [];
  const selectedPracticeTypes = urlParams.get('practiceType') ? urlParams.get('practiceType').split(',') : [];
  const selectedBookingTypes = urlParams.get('bookingType') ? urlParams.get('bookingType').split(',') : [];
  const selectedTherapyTypes = urlParams.get('therapyType') ? urlParams.get('therapyType').split(',') : [];

  if (gi.value) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': gi.value}, function(results, status) {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        gr.value = `${location.lat()}, ${location.lng()}`;
        fi = filterByDistance(fi, location.lat(), location.lng());

        if (st) {
          fi = filterBySearchTerm(fi, st);
        }
        fi = applyFilters(fi, selectedLanguages, '.language');
        fi = applyFilters(fi, selectedPracticeTypes, '.practice-type');
        fi = applyFilters(fi, selectedBookingTypes, '.booking-type');
        fi = applyFilters(fi, selectedTherapyTypes, '.type-of-therapy');

        displayResults(fi);
      } else {
        gr.value = "Geocoding failed: " + status;
      }
    });
  } else {
    if (st) {
      fi = filterBySearchTerm(fi, st);
    }
    fi = applyFilters(fi, selectedLanguages, '.language');
    fi = applyFilters(fi, selectedPracticeTypes, '.practice-type');
    fi = applyFilters(fi, selectedBookingTypes, '.booking-type');
    fi = applyFilters(fi, selectedTherapyTypes, '.type-of-therapy');

    displayResults(fi);
  }
}

// General function to filter items by class text content
function applyFilters(list, selectedValues, className) {
  if (selectedValues.length > 0) {
    return list.filter(item => {
      const itemTextContents = Array.from(item.querySelectorAll(className)).map(element => element.textContent.toLowerCase());
      return selectedValues.some(value => itemTextContents.includes(value.toLowerCase()));
    });
  } else {
    return list; // Return the list as is if no values are selected
  }
}

  function filterByLanguages(list, selectedLanguages) {
    return list.filter(item => {
      const itemLanguages = Array.from(item.querySelectorAll('.language')).map(element => element.textContent.toLowerCase());
      return selectedLanguages.some(lang => itemLanguages.includes(lang.toLowerCase()));
    });
  }

  function filterByDistance(list, lat, lng) {
    return list.filter(item => {
      const itemLat = parseFloat(item.querySelector('.lat').textContent);
      const itemLng = parseFloat(item.querySelector('.long').textContent);
      return calculateDistance(lat, lng, itemLat, itemLng) <= 50;
    });
  }

  function filterBySearchTerm(list, searchTerm) {
  return list.filter(item => {
    const name = item.querySelector('.practice-name') ? item.querySelector('.practice-name').textContent.toLowerCase() : '';
    const type = item.querySelector('.practice-type') ? item.querySelector('.practice-type').textContent.toLowerCase() : '';
    const language = item.querySelector('.language') ? item.querySelector('.language').textContent.toLowerCase() : '';
    const therapyType = item.querySelector('.type-of-therapy') ? item.querySelector('.type-of-therapy').textContent.toLowerCase() : '';
    const conditions = item.querySelector('.conditions') ? item.querySelector('.conditions').textContent.toLowerCase() : '';
    const about = item.querySelector('.about-your-practice') ? item.querySelector('.about-your-practice').textContent.toLowerCase() : '';

    return name.includes(searchTerm) || type.includes(searchTerm) || language.includes(searchTerm) || therapyType.includes(searchTerm) || conditions.includes(searchTerm) || about.includes(searchTerm);
  });
}

  function displayResults(filteredItems) {
    cl.innerHTML = '';
    filteredItems.forEach(item => cl.appendChild(item.cloneNode(true)));
    updateURL(sb.value, gi.value);
    if (window.updateMarkers) {
      window.updateMarkers(filteredItems);
    }
  }

    function updateURL(searchGeneral, searchLocation) {
    const currentUrl = new URL(window.location);
    const searchParams = new URLSearchParams(currentUrl.search);

    // Set parameters for general search and location
    searchParams.set('searchGeneral', searchGeneral);
    searchParams.set('searchLocation', searchLocation);

    // Retrieve and set parameters for all filters
    const urlParams = new URLSearchParams(window.location.search);
    ['language', 'practiceType', 'bookingType', 'therapyType'].forEach(param => {
        const selectedValues = urlParams.get(param);
        if (selectedValues) {
            searchParams.set(param, selectedValues);
        } else {
            searchParams.delete(param); // Ensure removal if not present
        }
    });

    history.pushState(null, '', `${currentUrl.pathname}?${searchParams}`);
}


  searchButton.addEventListener('click', handleSearch);
  sb.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearch(); });
  gi.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearch(); });
  cb.addEventListener("click", function() {
    sb.value = "";
    gi.value = "";
    gr.value = "";
    cl.innerHTML = '';
    oi.forEach(item => cl.appendChild(item.cloneNode(true)));
    history.pushState(null, '', window.location.pathname);
    if (window.updateMarkers) {
      window.updateMarkers(oi);
    }
  });

  // Initialize the search if there are URL parameters present for searchGeneral or searchLocation
  const urlParams = new URLSearchParams(window.location.search);
  sb.value = urlParams.get('searchGeneral') || '';
  gi.value = urlParams.get('searchLocation') || '';
  if (sb.value || gi.value) {
    performSearch();
  }
});

