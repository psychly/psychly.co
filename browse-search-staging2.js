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

  function handleSearchEvent() {
  const searchGeneral = sb.value;
  const searchLocation = gi.value;
  const currentUrl = new URL(window.location);

  // Set or delete 'searchGeneral' parameter based on input value
  if (searchGeneral) {
    currentUrl.searchParams.set('searchGeneral', searchGeneral);
  } else {
    currentUrl.searchParams.delete('searchGeneral');
  }

  // Set or delete 'searchLocation' parameter based on input value
  if (searchLocation) {
    currentUrl.searchParams.set('searchLocation', searchLocation);
  } else {
    currentUrl.searchParams.delete('searchLocation');
  }

  // Update the URL
  window.location.href = currentUrl.toString();
}


  function performSearch() {
    let fi = oi; // Original items list
    const urlParams = new URLSearchParams(window.location.search);
    const searchParams = {
      searchGeneral: urlParams.get('searchGeneral')?.toLowerCase() || '',
      searchLocation: urlParams.get('searchLocation')?.toLowerCase() || '',
      language: urlParams.get('language')?.split(',') || [],
      practiceType: urlParams.get('practiceType')?.split(',') || [],
      bookingType: urlParams.get('bookingType')?.split(',') || [],
      therapyType: urlParams.get('therapyType')?.split(',') || []
    };

    // If there's a search location, perform geocoding and filter by distance
    if (searchParams.searchLocation) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': searchParams.searchLocation}, function(results, status) {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                fi = filterByDistance(fi, location.lat(), location.lng());

                // After filtering by distance, continue with other filters
                fi = filterItems(fi, searchParams);
                displayResults(fi);
            } else {
                // Handle geocoding failure
                console.error("Geocoding failed: " + status);
            }
        });
    } else {
        // If no search location, directly apply other filters
        fi = filterItems(fi, searchParams);
        displayResults(fi);
    }
}

function filterItems(fi, searchParams) {
    return fi.filter(item => {
        const itemData = {
            name: item.querySelector('.practice-name')?.textContent.toLowerCase() || '',
            medicalTitle: item.querySelector('.medical-title')?.textContent.toLowerCase() || '',
            typeOfTherapy: item.querySelector('.type-of-therapy')?.textContent.toLowerCase() || '',
            language: item.querySelector('.language')?.textContent.toLowerCase() || '',
            practiceType: item.querySelector('.practice-type')?.textContent.toLowerCase() || '',
            bookingType: item.querySelector('.booking-type')?.textContent.toLowerCase() || '',
            conditions: item.querySelector('.conditions')?.textContent.toLowerCase() || '',
            aboutYourPractice: item.querySelector('.about-your-practice')?.textContent.toLowerCase() || '',
        };

        return (!searchParams.searchGeneral || Object.values(itemData).some(value => value.includes(searchParams.searchGeneral))) &&
               (!searchParams.language.length || searchParams.language.some(lang => itemData.language.includes(lang.toLowerCase()))) &&
               (!searchParams.practiceType.length || searchParams.practiceType.some(type => itemData.practiceType.includes(type.toLowerCase()))) &&
               (!searchParams.bookingType.length || searchParams.bookingType.some(type => itemData.bookingType.includes(type.toLowerCase()))) &&
               (!searchParams.therapyType.length || searchParams.therapyType.some(type => itemData.typeOfTherapy.includes(type.toLowerCase())));
    });
}

  function filterByDistance(list, lat, lng) {
    return list.filter(item => {
      const itemLat = parseFloat(item.querySelector('.lat').textContent);
      const itemLng = parseFloat(item.querySelector('.long').textContent);
      return calculateDistance(lat, lng, itemLat, itemLng) <= 50;
    });
  }

  function displayResults(filteredItems) {
    cl.innerHTML = '';
    filteredItems.forEach(item => cl.appendChild(item.cloneNode(true)));
  }

  searchButton.addEventListener('click', handleSearchEvent);
  sb.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearchEvent(); });
  gi.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSearchEvent(); });
  cb.addEventListener("click", function() {
    sb.value = "";
    gi.value = "";
    gr.value = "";
    cl.innerHTML = '';
    window.location.href = window.location.pathname; // Reset filters on clear
  });

  // Function to restore the checkbox states from the URL parameters
  function restoreCheckboxStates() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterSettings = {
    bookingType: urlParams.get('bookingType')?.split(',').map(decodeURIComponent) || [],
    practiceType: urlParams.get('practiceType')?.split(',').map(decodeURIComponent) || [],
    therapyType: urlParams.get('therapyType')?.split(',').map(decodeURIComponent) || [],
    language: urlParams.get('language')?.split(',').map(decodeURIComponent) || []
  };

  // Recheck the checkboxes based on URL parameters
  Object.keys(filterSettings).forEach(filterKey => {
    const values = filterSettings[filterKey];
    values.forEach(value => {
      // Find checkboxes that have the same value as the parameter.
      const checkboxes = document.querySelectorAll(`.checkbox-${filterKey}`);
      checkboxes.forEach(checkbox => {
        if (checkbox.value === value) {
          checkbox.checked = true;
        }
      });
    });
  });
}

// Call this function to restore the checkbox states after page load
restoreCheckboxStates();


  // Trigger search on page load based on URL parameters
  performSearch();
});
