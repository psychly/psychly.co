function setupUploadWidget(buttonId, memberStackField, imageId) {
  // Store the initial value of the input field
  var initialValue = document.getElementById(memberStackField).value;
  
  document.getElementById(buttonId).addEventListener("click", function(event) {
    cloudinary.openUploadWidget({
      cloudName: 'dfj3b96gg',
      uploadPreset: 'psychly-profiles',
      sources: ['local', 'camera'],
      googleApiKey: 'YourGoogleAPIKey', // Optional, for image search
      showAdvancedOptions: false,
      cropping: true,
      croppingAspectRatio: 1,
      croppingValidateDimensions: true,
      croppingShowDimensions: true,
      showSkipCropButton: true,
      minImageHeight: 160,
      multiple: false,
      maxImageFileSize: 10000000,
      defaultSource: 'local', // Optional
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#8D89ED',
          tabIcon: '#443FDE',
          menuIcons: '#443FDE',
          textDark: '#000000',
          textLight: '#FFFFFF',
          link: '#443FDE',
          action: '#443FDE',
          inactiveTabIcon: '#8D89ED',
          error: '#FFFFFF',
          inProgress: '#FFFFFF',
          complete: '#FFFFFF',
          sourceBg: '#FFFFFF'
        },
        fonts: {
          default: {
            active: true,
            url: 'https://fonts.googleapis.com/css?family=Inter'
          }
        },
        frame: {
          margin: '5%',
          padding: '10%'
        }
      }
    }, function(error, result) {
      if (error) {
        console.log("Upload Widget error:", error);
      } else {
        console.log("Upload Widget result:", result);
        if (result.event === "success") {
          console.log("Uploaded image's URL:", result.info.secure_url);
          console.log("Additional Info:", result.info);
          // Check if cropping data is available and construct the cropped URL
          if (result.info.coordinates && result.info.coordinates.custom && result.info.coordinates.custom.length > 0) {
            var coords = result.info.coordinates.custom[0];
            var croppedURL = `${result.info.secure_url.replace('/upload/', `/upload/c_crop,g_custom,x_${coords[0]},y_${coords[1]},w_${coords[2]},h_${coords[3]}/`)}`;
            document.getElementById(memberStackField).value = croppedURL;
            updateImage(imageId, croppedURL);
          } else {
            document.getElementById(memberStackField).value = result.info.secure_url;
            updateImage(imageId, result.info.secure_url);
          }
          // Check if the input field value has changed
          if (document.getElementById(memberStackField).value !== initialValue) {
            // Trigger the click event on the save button only if the value has changed
            document.getElementById("save-profile-info-button").click();
          }
        }
      }
    });
  });
}

function updateImage(imageId, imageURL) {
  var dynamicImageDiv = document.getElementById(imageId);
  dynamicImageDiv.style.backgroundImage = "url('" + imageURL + "')";
  dynamicImageDiv.style.backgroundSize = "contain";
  dynamicImageDiv.style.backgroundPosition = "center";
  dynamicImageDiv.style.backgroundRepeat = "no-repeat";
  dynamicImageDiv.style.height = "160px";
  dynamicImageDiv.style.width = "100%";
  dynamicImageDiv.style.maxWidth = "100%";
}

function loadImages() {
  setTimeout(function() {
    var inputFields = [
      "images-input-main",
      "images-input-setting",
      "images-input-1",
      "images-input-2",
      "images-input-3",
      "images-input-4",
      "images-input-5"
    ];
    
    var imageIds = [
      "image-main-id",
      "image-setting-id",
      "image-other-1-id",
      "image-other-2-id",
      "image-other-3-id",
      "image-other-4-id",
      "image-other-5-id"
    ];
    
    for (var i = 0; i < inputFields.length; i++) {
      var imageURL = document.getElementById(inputFields[i]).value;
      if (imageURL) {
        updateImage(imageIds[i], imageURL);
      }
    }
  }, 500);
}

// Set up each upload widget
setupUploadWidget("upload_main_image", "images-input-main", "image-main-id");
setupUploadWidget("upload_setting_image", "images-input-setting", "image-setting-id");
setupUploadWidget("upload_other_image_1", "images-input-1", "image-other-1-id");
setupUploadWidget("upload_other_image_2", "images-input-2", "image-other-2-id");
setupUploadWidget("upload_other_image_3", "images-input-3", "image-other-3-id");
setupUploadWidget("upload_other_image_4", "images-input-4", "image-other-4-id");
setupUploadWidget("upload_other_image_5", "images-input-5", "image-other-5-id");

// Load images after a delay of 0.5 seconds
document.addEventListener("DOMContentLoaded", loadImages);
