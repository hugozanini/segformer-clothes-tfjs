import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import { Webcam } from "./utils/webcam";
import { renderBoxes } from "./utils/renderBox";

import "./style/App.css";

const generateClassColors = (numClasses) => {
  const colors = [];
  const hueStep = 360 / numClasses;

  for (let i = 0; i < numClasses; i++) {
    const hue = i * hueStep;
    const color = `hsl(${hue}, 100%, 50%)`;
    colors.push(color);
  }
  colors[0] = `hsl(0%, 0%, 0%)`; //setting the background as None

  return colors;
};

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcam = new Webcam();
  // configs
  const modelName = "clothes_model";

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

  const detectFrame = async (model) => {
    const model_dim = [512, 512];
    tf.engine().startScope();
    const input = tf.tidy(() => {
      const img = tf.image
        .resizeBilinear(tf.browser.fromPixels(videoRef.current), model_dim)
        .div(255.0)
        .expandDims(0);
      return img;
    });

    await model.executeAsync(input).then((res) => {
      res = res.arraySync()[0];

      const rawImage = videoRef.current;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      renderBoxes(canvasRef, res, rawImage);
      tf.dispose(res);
    });

    requestAnimationFrame(() => detectFrame(model));
    tf.engine().endScope();
  };

  useEffect(() => {
    tf.loadGraphModel(`${window.location.origin}/${modelName}_web_model/model.json`, {
      onProgress: (fractions) => {
        setLoading({ loading: true, progress: fractions });
      },
    }).then(async (segformer) => {
      const dummyInput = tf.ones(segformer.inputs[0].shape);
      await segformer.executeAsync(dummyInput).then((warmupResult) => {
        tf.dispose(warmupResult);
        tf.dispose(dummyInput);

        setLoading({ loading: false, progress: 1 });
        webcam.open(videoRef, () => detectFrame(segformer));
      });
    });
  }, []);
  console.warn = () => {};

  return (
    <div className="App">
      <h2 className="title">Segformer for Clothes Segmentation with TensorFlow.js</h2>
      <div className="content">
        <video autoPlay playsInline muted ref={videoRef} id="frame" />
        <canvas width={640} height={640} ref={canvasRef} />
      </div>
      <div className="legend">
        {labels.map((label, index) => (
          <div
            key={label}
            className="legend-item"
            style={{ backgroundColor: colors[index]}}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
