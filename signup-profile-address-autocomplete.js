let autocomplete;

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('signup-address-auto'), {types: ['address']}
    );
    autocomplete.addListener('place_changed', fillInAddress);
    google.maps.event.addDomListener(window, 'load', concatenateAddress); // Update on page load
  }

  function fillInAddress() {
    const place = autocomplete.getPlace();

    const componentForm = {
      street_number: 'signup-address-auto',
      route: 'signup-address-auto',
      locality: 'signup-city-auto',
      administrative_area_level_1: 'signup-state-auto',
      postal_code: 'signup-zipcode-auto',
      country: 'signup-country-auto'
    };

    let addressComponents = {
      'signup-address-auto': '',
      'signup-city-auto': '',
      'signup-state-auto': '',
      'signup-zipcode-auto': '',
      'signup-country-auto': ''
    };

    for (const component of place.address_components) {
      const addressType = component.types[0];
      if (componentForm[addressType]) {
        const val = component.long_name;
        if (addressType === 'street_number' || addressType === 'route') {
          addressComponents['signup-address-auto'] += ' ' + val;
        } else {
          addressComponents[componentForm[addressType]] = val;
        }
      }
    }

    for (const key in addressComponents) {
      if (addressComponents[key] && document.getElementById(key)) {
        document.getElementById(key).value = addressComponents[key].trim();
      }
    }

    concatenateAddress();
  }

  function concatenateAddress() {
    const address = document.getElementById('signup-address-auto').value;
    const unitNumber = document.getElementById('signup-unit-number').value;
    const city = document.getElementById('signup-city-auto').value;
    const state = document.getElementById('signup-state-auto').value;
    const zipcode = document.getElementById('signup-zipcode-auto').value;
    const country = document.getElementById('signup-country-auto').value;

    let fullAddressArray = [address, unitNumber, city, [state, zipcode].filter(Boolean).join(' '), country];
    let fullAddress = fullAddressArray.filter(Boolean).join(', ');

    document.getElementById('signup-full-address-auto').value = fullAddress;
    
    // Also update the address in the modal
  	document.getElementById('signup-modal-full-address').textContent = fullAddress;
  }
  
  function geocodeAddress(geocoder, map) {
    var address = document.getElementById('signup-full-address-auto').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        document.getElementById('signup-latitude-auto').value = results[0].geometry.location.lat();
        document.getElementById('signup-longitude-auto').value = results[0].geometry.location.lng();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  document.getElementById('signup-confirm-address-button').addEventListener('click', function() {
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder);
  });

  function setupRealTimeAddressUpdate() {
    const fields = ['signup-address-auto', 'signup-unit-number', 'signup-city-auto', 'signup-state-auto', 'signup-zipcode-auto', 'signup-country-auto'];

    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', concatenateAddress);
      }
    });
  }

  setupRealTimeAddressUpdate();
