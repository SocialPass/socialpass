import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import jsQR from "jsqr";

function QrReader(props) {
  const { onRead, loadingMessage, facingMode } = props;

  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
      });
  }, []);

  const tick = () => {
    const video = videoRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      setIsLoadingVideo(false);

      const canvasElement = canvasRef.current;
      const canvasContext = canvasElement.getContext("2d");

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvasContext.drawImage(
        video,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      let imageData = canvasContext.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      var code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        onRead(code);
      }
    }

    requestAnimationFrame(tick);
  };

  return (
    <>
      <video
        ref={videoRef}
        width="400"
        height="400"
        autoPlay
        style={{ display: "none" }}
      />

      <canvas ref={canvasRef} id="canvas" height="480" width="640" />

      {isLoadingVideo ? <div id="loadingMessage">{loadingMessage}</div> : null}
    </>
  );
}

export default QrReader;

QrReader.propTypes = {
  onRead: PropTypes.func,
  loadingMessage: PropTypes.string,
  facingMode: PropTypes.string,
};

QrReader.defaultProps = {
  onRead: () => {},
  loadingMessage: "⌛ Loading video...",
  facingMode: "environment",
};
