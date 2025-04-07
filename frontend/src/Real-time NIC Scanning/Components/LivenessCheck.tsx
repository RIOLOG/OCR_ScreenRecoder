import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";


// Define the types for the state and references
interface LivenessCheckProps {}

const LivenessCheck: React.FC<LivenessCheckProps> = () => {
  const webcamRef = useRef<Webcam | null>(null); // Ref for the webcam component
  const [message, setMessage] = useState<string>("Follow the instructions...");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Capture Image from Webcam
  const captureImage = async () => {
    const imageSrc = webcamRef.current?.getScreenshot(); // Ensure webcamRef is not null
    if (imageSrc) {
      setCapturedImage(imageSrc);
      analyzeFace(imageSrc);
    }
  };

  // Analyze Face for Liveness (Blink detection, head movement)
  const analyzeFace = async (imageSrc: string) => {
    setMessage("Analyzing face...");

    const model = await blazeface.load();
    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const predictions = await model.estimateFaces(img, false);
      console.log(predictions);

      if (predictions.length > 0) {
        setMessage("Face detected! Sending for verification...");
        sendToBackend(imageSrc);
      } else {
        setMessage("No face detected! Try again.");
      }
    };
  };

  // Send Image to Backend for Face Matching
  const sendToBackend = async (image: string) => {
    const response = await fetch("http://localhost:2701/api/liveness-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">{message}</h2>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border"
      />
      <button
        onClick={captureImage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Capture & Verify
      </button>
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="mt-4 border rounded-lg"
        />
      )}
    </div>
  );
};

export default LivenessCheck;
