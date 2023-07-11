import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import ImageEditor from '@uppy/image-editor';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

// Init Uppy
const uppy = new Uppy({
  restrictions: {
    allowedFileTypes: ['image/*']
  },
  debug: true,
  autoProceed: true,
  maxNumberOfFiles: 1,
})
    .use(Dashboard, {
      autoOpenFileEditor: true,
      inline: true,
      target: '#div_id_cover_image',
    })
    .use(ImageEditor, {
      target: Dashboard,
      quality: 1,
      cropperOptions: {
        initialAspectRatio: 16 / 9,
        ratio: 16 / 9, // Specify your desired aspect ratio here
        cropBoxResizable: false,
        dragMode: 'move',
        toggleDragModeOnDblclick: false,
        showGrid: true,
        showZoomer: true,
        responsive: true,
      },
      actions: {
        granularRotate: false,
        cropSquare: false,
        cropWidescreen: false,
        cropWidescreenVertical: false,
      }
    });

  uppy.on('complete', (result) => {
    result.successful.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('id_cover_image').value = event.target.result;
      };
      reader.readAsDataURL(file.data);
    });
  });