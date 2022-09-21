import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {
    const previewRef = useRef(null);
    const { onScan, onError } = props;

    useEffect(() => {
        if (!previewRef.current)   {
        return
    }
        const config = createConfig(props);
        const verbose = props.verbose === true;
  
        const html5Qrcode = new Html5Qrcode(previewRef.current.id);
        const didStart = html5Qrcode.start({ facingMode: "environment" }, config, onScan, onError).then(()=>true);

        return () => {
            didStart.then(()=>html5Qrcode.stop())
            .catch(error => {
                console.error("Scanner stopped", error);
            });
        };
    }, []);

    return (
        <div ref={previewRef} id={'preview'} style={{ overflow: 'visible', position: 'relative' }} />
    );
};

export default Html5QrcodePlugin;


