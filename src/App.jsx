import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import { Webcam } from "./utils/webcam";
import { renderBoxes } from "./utils/renderBox";

import "./style/App.css";

/**
 * Function to detect image.
 * @param {HTMLCanvasElement} canvasRef canvas reference
 */

const generateClassColors = (numClasses) => {
  const colors = [];
  const hueStep = 360 / numClasses;

  for (let i = 0; i < numClasses; i++) {
    const hue = i * hueStep;
    const color = `hsl(${hue}, 100%, 50%)`;
    colors.push(color);
  }

  return colors;
};


const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcam = new Webcam();
  // configs
  const modelName = "clothes_model";
  const threshold = 0.80;

    // Define labels and colors
    const labels = [
      "Background",
      "Hat",
      "Hair",
      "Sunglasses",
      "Upper-clothes",
      "Skirt",
      "Pants",
      "Dress",
      "Belt",
      "Left-shoe",
      "Right-shoe",
      "Face",
      "Left-leg",
      "Right-leg",
      "Left-arm",
      "Right-arm",
      "Bag",
      "Scarf",
    ];
  
    const colors = generateClassColors(labels.length);

  /**
   * Function to detect every frame loaded from webcam in video tag.
   * @param {tf.GraphModel} model loaded YOLOv7 tensorflow.js model
   */

  const detectFrame = async (model) => {
    const model_dim = [512, 512];
    tf.engine().startScope();
    const input = tf.tidy(() => {
      const img = tf.image
                  .resizeBilinear(tf.browser.fromPixels(videoRef.current), model_dim)
                  .div(255.0)
                  .expandDims(0);
      return img
    });

    await model.executeAsync(input).then((res) => {

      res = res.arraySync()[0];

      // Capture the raw webcam frame
      const rawImage = videoRef.current;

      // Render the raw image on the canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Overlay the segmentation masks on top of the raw image with transparency
      renderBoxes(canvasRef, res, rawImage);
      // Draw a semi-transparent red rectangle on top of the raw image
      // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
      tf.dispose(res);
    });

    requestAnimationFrame(() => detectFrame(model)); // get another frame
    tf.engine().endScope();
  };

  useEffect(() => {
    tf.loadGraphModel(`${window.location.origin}/${modelName}_web_model/model.json`, {
      onProgress: (fractions) => {
        setLoading({ loading: true, progress: fractions });
      },
    }).then(async (yolov7) => {
      // Warmup the model before using real data.
      const dummyInput = tf.ones(yolov7.inputs[0].shape);
      await yolov7.executeAsync(dummyInput).then((warmupResult) => {
        tf.dispose(warmupResult);
        tf.dispose(dummyInput);

        setLoading({ loading: false, progress: 1 });
        webcam.open(videoRef, () => detectFrame(yolov7));
      });
    });
  }, []);
  console.warn = () => {};

  return (
    <div className="App">
      <h2>Object Detection Using YOLOv7 & Tensorflow.js</h2>
      {loading.loading ? (
        <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>
      ) : (
        <p> </p>
      )}

      <div className="content">
        <video autoPlay playsInline muted ref={videoRef} id="frame"
        />
        <canvas width={640} height={640} ref={canvasRef} />
      </div>
    </div>
  );
};

export default App;
