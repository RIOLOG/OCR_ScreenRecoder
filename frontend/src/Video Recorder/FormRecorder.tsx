// import React, { useRef, useState } from "react";
// import axios from "axios";

// const FormRecorder = () => {
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

//   const startScreenRecording = async () => {
//     const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//     const chunks: Blob[] = [];

//     mediaRecorderRef.current = new MediaRecorder(stream);
//     mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
//     mediaRecorderRef.current.onstop = () => {
//       const completeBlob = new Blob(chunks, { type: "video/webm" });
//       setVideoBlob(completeBlob);
//     };

//     mediaRecorderRef.current.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setRecording(false);
//   };

//   const uploadVideo = async () => {
//     if (!videoBlob) return;
//     const formData = new FormData();
//     formData.append("video", videoBlob, "process.webm");
//     await axios.post("http://localhost:2701/api/upload-process-video", formData);
//     alert("Video uploaded!");
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-semibold mb-4">Record Form Flow</h1>
//       {!recording ? (
//         <button onClick={startScreenRecording} className="bg-green-600 text-white px-4 py-2 rounded">Start Screen Recording</button>
//       ) : (
//         <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded">Stop Recording</button>
//       )}
//       <br />
//       {videoBlob && (
//         <button onClick={uploadVideo} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Upload Video</button>
//       )}
//     </div>
//   );
// };

// export default FormRecorder;




import React, { useRef, useState } from "react";
import axios from "axios";

const FormRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [recordingStarted, setRecordingStarted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recordedChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const completeBlob = new Blob(recordedChunks.current, {
          type: "video/webm",
        });

        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("video", completeBlob, "form-recording.webm");

        try {
          const res = await axios.post("http://localhost:2701/api/submit-form", form);
          alert("Form + Video submitted successfully!");
        } catch (error) {
          alert("Upload failed");
          console.error(error);
        }

        setRecordingStarted(false);
        setIsSubmitting(false);
      };

      recorder.start();
      setRecordingStarted(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Screen recording permission denied or failed.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Stop recording automatically
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      {!recordingStarted ? (
        <button
          onClick={startRecording}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Recording to Fill Form
        </button>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Form & Stop Recording
          </button>
        </form>
      )}
    </div>
  );
};

export default FormRecorder;
