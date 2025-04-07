import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const OCRRecorder = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const startRecording = () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const completeBlob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(completeBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || !videoBlob) return alert("Try again!");

    const formData = new FormData();
    formData.append("image", imageSrc);
    formData.append("video", videoBlob, "session.webm");

    const res = await axios.post("http://localhost:2701/api/ocr-record", formData);
    alert(res.data.text);
  };

  return (
    <div className="p-4 space-y-4">
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <div className="space-x-2">
        {!recording ? (
          <button onClick={startRecording} className="bg-green-500 px-4 py-2 text-white">Start Recording</button>
        ) : (
          <button onClick={stopRecording} className="bg-red-500 px-4 py-2 text-white">Stop Recording</button>
        )}
        <button onClick={capture} className="bg-blue-500 px-4 py-2 text-white">Capture & Submit</button>
      </div>
    </div>
  );
};

export default OCRRecorder;
