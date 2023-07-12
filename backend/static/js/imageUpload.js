import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Form from '@uppy/form';
import ImageEditor from '@uppy/image-editor';
import XHR from '@uppy/xhr-upload';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

export function initUppy(uploadTarget, formTarget, xhrEndpoint){
  console.log("INITT", uploadTarget, formTarget, xhrEndpoint);
  const uppy = new Uppy({
    restrictions: {
      allowedFileTypes: ['image/*'],
      minNumberOfFiles: 1,
      maxNumberOfFiles: 1,
    },
    debug: true,
  })
      .use(Dashboard, {
        autoOpenFileEditor: true,
        hideUploadButton: true,
        inline: true,
        target: uploadTarget,
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
      })
      .use(Form, {
          target: formTarget,
          addResultToForm: true,
          triggerUploadOnSubmit: true,
          submitOnSuccess: true
      })
      .use(XHR, {
        endpoint: xhrEndpoint,
        fieldName: 'uppy_field'
      });
}

// setup windows
window.initUppy = initUppy