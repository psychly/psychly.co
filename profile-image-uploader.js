function setupUploadWidget(buttonId, memberStackField, imageId) {
  document.getElementById(buttonId).addEventListener("click", function(event) {
    cloudinary.openUploadWidget({
      cloudName: 'dfj3b96gg',
      uploadPreset: 'psychly-profiles',
      sources: ['local', 'camera'],
      googleApiKey: 'YourGoogleAPIKey', // Optional, for image search
      showAdvancedOptions: false, // Optional
      cropping: true, // Optional
      croppingAspectRatio: 1,
      croppingValidateDimensions: true,
      showSkipCropButton: false,
      minImageHeight: 160,
      multiple: false, // Optional
      maxImageFileSize: 10000000,
      defaultSource: 'local', // Optional
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#443FDE',
          tabIcon: '#0078FF',
          menuIcons: '#443FDE',
          textDark: '#000000',
          textLight: '#FFFFFF',
          link: '#0078FF',
          action: '#FF620C',
          inactiveTabIcon: '#0E2F5A',
          error: '#F44235',
          inProgress: '#0078FF',
          complete: '#20B832',
          sourceBg: '#E4EBF1'
        },
        fonts: {
          default: {
            active: true,
            url: 'https://fonts.googleapis.com/css?family=Inter'
          }
        },
        frame: {
          margin: '5%'
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log('Uploaded Image URL:', result.info.secure_url);
        var imageURL = result.info.secure_url;
        document.getElementById(memberStackField).value = imageURL;
        updateImage(imageId, imageURL);
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
