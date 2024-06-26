let autocomplete;

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('address-auto'), {types: ['address']}
    );
    autocomplete.addListener('place_changed', fillInAddress);
    window.addEventListener('load', concatenateAddress); // Update on page load
  }

  function fillInAddress() {
    const place = autocomplete.getPlace();

    const componentForm = {
      street_number: 'address-auto',
      route: 'address-auto',
      locality: 'city-auto',
      administrative_area_level_1: 'state-auto',
      postal_code: 'zipcode-auto',
      country: 'country-auto'
    };

    let addressComponents = {
      'address-auto': '',
      'city-auto': '',
      'state-auto': '',
      'zipcode-auto': '',
      'country-auto': ''
    };

    for (const component of place.address_components) {
      const addressType = component.types[0];
      if (componentForm[addressType]) {
        const val = component.long_name;
        if (addressType === 'street_number' || addressType === 'route') {
          addressComponents['address-auto'] += ' ' + val;
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
    const address = document.getElementById('address-auto').value;
    const unitNumber = document.getElementById('unit-number').value;
    const city = document.getElementById('city-auto').value;
    const state = document.getElementById('state-auto').value;
    const zipcode = document.getElementById('zipcode-auto').value;
    const country = document.getElementById('country-auto').value;

    let fullAddressArray = [address, unitNumber, city, [state, zipcode].filter(Boolean).join(' '), country];
    let fullAddress = fullAddressArray.filter(Boolean).join(', ');

    document.getElementById('full-address-auto').value = fullAddress;
    
    // Also update the address in the modal
  	document.getElementById('modal-full-address').textContent = fullAddress;
  }
  
  function geocodeAddress(geocoder, map) {
    var address = document.getElementById('full-address-auto').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        document.getElementById('latitude-auto').value = results[0].geometry.location.lat();
        document.getElementById('longitude-auto').value = results[0].geometry.location.lng();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  document.getElementById('confirm-address-button').addEventListener('click', function() {
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder);
  });

  function setupRealTimeAddressUpdate() {
    const fields = ['address-auto', 'unit-number', 'city-auto', 'state-auto', 'zipcode-auto', 'country-auto'];

    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', concatenateAddress);
      }
    });
  }

  setupRealTimeAddressUpdate();
