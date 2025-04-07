// import React, { useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const NICScanner: React.FC = () => {
//   const webcamRef = useRef<Webcam>(null);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
  

//   // Capture the image from webcam
//   const capture = () => {
//     if (webcamRef.current) {
//       const image = webcamRef.current.getScreenshot();
//       setImageSrc(image);
//     }
//   };


//   // Send image to backend for OCR processing
//   const processNICScan = async () => {
//     if (!imageSrc) return;

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:2701/api/nic-scan", {
//         image: imageSrc,
//       });

//       setScanResult(response.data.text);
//     } catch (error) {
//       console.error("Error processing NIC scan:", error);
//       setScanResult("Error processing scan. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h2 className="text-lg font-semibold mb-4">Real-time NIC Scanning</h2>
      
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         className="rounded-lg shadow-lg"
//       />

//       <button
//         onClick={capture}
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
//       >
//         Capture Image
//       </button>

//       {imageSrc && (
//         <>
//           <img src={imageSrc} alt="Captured NIC" className="mt-4 rounded-lg" />
//           <button
//             onClick={processNICScan}
//             className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg"
//           >
//             Process NIC Scan
//           </button>
//         </>
//       )}

//       {loading && <p className="mt-4 text-gray-500">Processing...</p>}
//       {scanResult && <p className="mt-4 font-bold">{scanResult}</p>}
//     </div>
//   );
// };

// export default NICScanner;






// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const CAPTURE_INTERVAL_MS = 5000; // Capture every 5 seconds

// const NICScanner: React.FC = () => {
//   const webcamRef = useRef<Webcam>(null);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [autoScanActive, setAutoScanActive] = useState<boolean>(true);

//   // Automatically capture image every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (webcamRef.current && autoScanActive && !loading) {
//         const image = webcamRef.current.getScreenshot();
//         if (image) {
//           setImageSrc(image);
//         }
//       }
//     }, CAPTURE_INTERVAL_MS);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [autoScanActive, loading]);

//   // When imageSrc updates, automatically send to backend
//   useEffect(() => {
//     const processImage = async () => {
//       if (!imageSrc) return;

//       setLoading(true);
//       try {
//         const response = await axios.post("http://localhost:2701/api/nic-scan", {
//           image: imageSrc,
//         });

//         setScanResult(response.data.text);
//         setAutoScanActive(false); // Stop further scans
//       } catch (error) {
//         console.error("Error processing NIC scan:", error);
//         setScanResult("Error processing scan. Please try again.");
//       }
//       setLoading(false);
//     };

//     processImage();
//   }, [imageSrc]);

//   const resetScanner = () => {
//     setScanResult(null);
//     setImageSrc(null);
//     setAutoScanActive(true);
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h2 className="text-lg font-semibold mb-4">NIC Auto Scanner</h2>

//       <div className="relative">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="rounded-lg shadow-lg w-[640px] h-[480px]"
//         />

//         {/* Rectangle overlay */}
//         <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-green-500 z-10 pointer-events-none rounded-md" />
//       </div>

//       {loading && <p className="mt-4 text-gray-500">Processing image...</p>}
//       {scanResult && (
//         <>
//           <p className="mt-4 font-bold">Scan Result:</p>
//           <p className="mt-2 bg-gray-100 p-3 rounded-lg max-w-lg text-center whitespace-pre-wrap">
//             {scanResult}
//           </p>
//           <button
//             onClick={resetScanner}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Scan Again
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default NICScanner;










import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const CAPTURE_INTERVAL_MS = 3000;

const NICScanner: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoScanActive, setAutoScanActive] = useState<boolean>(false);
  const hasInitializedRef = useRef(false);


  useEffect(() => {
    //let hasInitialized = false;
  
    const initRecording = async () => {
      // if (hasInitialized) return;
      // hasInitialized = true;

      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;
  
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
  
        mediaRecorderRef.current = new MediaRecorder(screenStream, {
          mimeType: "video/webm",
        });
  
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.current.push(event.data);
          }
        };
  
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: "video/webm" });
          setVideoBlob(blob);
        };
  
        mediaRecorderRef.current.start();
        setRecordingStarted(true);
        setAutoScanActive(true);
        console.log("Screen recording started...");
      } catch (err) {
        console.error("Screen capture permission denied:", err);
        alert("Screen capture permission is required to proceed.");
      }
    };
  
    initRecording();
  }, []);

  // 2. Auto-capture image every few seconds and process it
  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && autoScanActive && !loading) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          processImage(imageSrc);
        }
      }
    }, CAPTURE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [autoScanActive, loading]);


  // 3. Process image via backend API
  const processImage = async (imageSrc: string) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:2701/api/nic-scan", {
        image: imageSrc,
      });

      setScanResult(response.data.text);
      setAutoScanActive(false); // pause scanning after first result
    } catch (err) {
      console.error("Error calling NIC scan API:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Stop recording and send video to backend
  const handleFinish = async () => {
    if (mediaRecorderRef.current && recordingStarted) {
      mediaRecorderRef.current.stop();
      setRecordingStarted(false);
    }

    setAutoScanActive(false);

    if (videoBlob) {
      const formData = new FormData();
      formData.append("video", videoBlob, "nic-session.webm");

      try {
        await axios.post("http://localhost:2701/api/nic-video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Video uploaded successfully.");
      } catch (err) {
        console.error("Failed to upload video:", err);
        alert("Video upload failed.");
      }
    } else {
      alert("No video recorded to upload.");
    }
  };

  // 5. Retry button logic
  const handleRetry = () => {
    setScanResult(null);
    setAutoScanActive(true);
  };


  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">NIC Scanner (with screen recording)</h2>

      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-md shadow-md w-[640px] h-[480px]"
        />
        {/* <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-green-500 pointer-events-none" /> */}
      </div>

      {loading && <p className="mt-4 text-gray-600">Processing NIC...</p>}

      {scanResult && (
        <div className="mt-4 w-full max-w-xl bg-gray-100 p-4 rounded-md text-center">
          <h3 className="font-bold mb-2">Scan Result</h3>
          <p>{scanResult}</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg"
            onClick={handleRetry}
          >
            Retry Scan
          </button>
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg"
        onClick={handleFinish}
      >
        Finish & Upload Video
      </button>
    </div>
  );
};

export default NICScanner;
