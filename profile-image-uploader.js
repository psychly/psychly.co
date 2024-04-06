function setupUploadWidget(buttonId, memberStackField) {
    document.getElementById(buttonId).addEventListener("click", function(event) {
        cloudinary.openUploadWidget({
        cloudName: 'dfj3b96gg', 
        uploadPreset: 'psychly-profiles',
        sources: ['local', 'camera'],
        googleApiKey: 'YourGoogleAPIKey', // Optional, for image search
        showAdvancedOptions: false, // Optional
        cropping: true, // Optional
        multiple: false, // Optional
        defaultSource: 'local', // Optional
        styles: {
            palette: {
                window: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                menuIcons: '#5A616A',
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
                default: null,
                "'Space Mono', monospace": {
                    url: 'https://fonts.googleapis.com/css?family=Space+Mono',
                    active: true
                }
            }
        } 
    }, 
        (error, result) => { 
            if (!error && result && result.event === "success") { 
                console.log('Uploaded Image URL:', result.info.secure_url);
                document.querySelector('[data-ms-member="' + memberStackField + '"]').value = result.info.secure_url;
            } 
        });
    });
}
// Set up each upload widget
setupUploadWidget("upload_main_image", "main-headshot-image");
setupUploadWidget("upload_setting_image", "main-setting-image");
setupUploadWidget("upload_other_image_1", "other-image-1");
setupUploadWidget("upload_other_image_2", "other-image-2");
setupUploadWidget("upload_other_image_3", "other-image-3");
setupUploadWidget("upload_other_image_4", "other-image-4");
setupUploadWidget("upload_other_image_5", "other-image-5");
