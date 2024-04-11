function setupUploadWidget(buttonId, memberStackField, imageId) {
  document.getElementById(buttonId).addEventListener("click", function(event) {
    cloudinary.openUploadWidget({
      cloudName: 'dfj3b96gg',
      uploadPreset: 'psychly-profiles',
      sources: ['local', 'camera'],
      googleApiKey: 'YourGoogleAPIKey', // Optional, for image search
      showAdvancedOptions: false, // Optional
      cropping: true, // Optional
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
        document.querySelector('[data-ms-member="' + memberStackField + '"]').value = imageURL;
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

// Set up each upload widget
setupUploadWidget("upload_main_image", "main-headshot-image", "image-main-id");
setupUploadWidget("upload_setting_image", "main-setting-image", "image-setting-id");
setupUploadWidget("upload_other_image_1", "other-image-1", "image-other-1-id");
setupUploadWidget("upload_other_image_2", "other-image-2", "image-other-2-id");
setupUploadWidget("upload_other_image_3", "other-image-3", "image-other-3-id");
setupUploadWidget("upload_other_image_4", "other-image-4", "image-other-4-id");
setupUploadWidget("upload_other_image_5", "other-image-5", "image-other-5-id");
