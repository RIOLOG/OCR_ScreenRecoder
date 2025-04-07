// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const fs = require("fs");
// const Tesseract = require("tesseract.js");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json({ limit: "10mb" }));


// const storage = multer.memoryStorage();
// const upload = multer({ storage });


// app.get('/', async(req, res) => {
//     res.status(200).send("BACKEND KI API");
// })


// // app.post("/api/nic-scan", async (req, res) => {
// //     //console.log("API pe request aaye 1", req.body);
// //     try {
// //         const { image } = req.body;
// //         const result = await Tesseract.recognize(image, "eng");
// //         //console.log("API pe request aaye 2", result);
// //         res.json({ text: result.data.text });
// //     } catch (error) {
// //         console.error("OCR Error:", error);
// //         res.status(500).json({ error: "Failed to process NIC" });
// //     }
// // });


// app.post("/api/nic-video", upload.single("video"), async (req, res) => {
//   try {
//     console.log("Screen recording received:", req.file);
//     res.status(200).json({ message: "Screen video uploaded successfully" });
//   } catch (error) {
//     console.error("Error saving screen recording:", error);
//     res.status(500).json({ error: "Failed to upload screen recording" });
//   }
// });


// app.post("/api/ocr-record", upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
//     try {
//       const imageBuffer = req.files.image[0].buffer;
//       const result = await Tesseract.recognize(imageBuffer, "eng");
  
//       // Optionally: Save video to disk
//       fs.writeFileSync(`uploads/${Date.now()}-session.webm`, req.files.video[0].buffer);
  
//       res.json({ text: result.data.text });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "OCR Failed" });
//     }
// });


// app.post("/api/upload-process-video", upload.single("video"), (req, res) => {
//     try {
//       fs.writeFileSync(`uploads/${Date.now()}-process.webm`, req.file.buffer);
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to save video" });
//     }
// });


// app.post("/api/submit-form", upload.single("video"), (req, res) => {
//   const { name, email } = req.body;
//   console.log("Form Data:", name, email);

//   if (req.file) {
//     const filePath = path.join("uploads", `video-${Date.now()}.webm`);
//     fs.writeFileSync(filePath, req.file.buffer);
//     console.log("Video saved:", filePath);
//   }

//   return res.status(200).json({ message: "Success" });
// });
  


// app.listen(2701,  () => console.log("Server running on port 2701"));



// //TASK-1:

// // const express = require("express");
// // const cors = require("cors");
// // const bodyParser = require("body-parser");
// // const Tesseract = require("tesseract.js");
// // const Jimp = require("jimp");

// // const app = express();
// // app.use(cors());
// // app.use(bodyParser.json({ limit: "10mb" }));

// // // Image preprocessing before OCR
// // async function preprocessImage(base64Image) {
// //     try {
// //         const buffer = Buffer.from(base64Image.split(",")[1], "base64");
// //         const image = await Jimp.read(buffer);

// //         image
// //             .greyscale() // Convert to grayscale
// //             .contrast(1) // Increase contrast
// //             .normalize() // Normalize the image
// //             .resize(800, Jimp.AUTO); // Resize for better accuracy

// //         return await image.getBase64Async(Jimp.MIME_PNG);
// //     } catch (err) {
// //         console.error("Image processing failed:", err);
// //         return base64Image;
// //     }
// // }

// // app.post("/api/nic-scan", async (req, res) => {
// //     try {
// //         const { image } = req.body;

// //         // Preprocess the image
// //         const processedImage = await preprocessImage(image);

// //         // Perform OCR on processed image
// //         const result = await Tesseract.recognize(processedImage, "eng", {
// //             logger: (m) => console.log(m), // Enable logging for debugging
// //         });

// //         res.json({ text: result.data.text });
// //     } catch (error) {
// //         console.error("OCR Error:", error);
// //         res.status(500).json({ error: "Failed to process NIC" });
// //     }
// // });

// // app.listen(2701, () => console.log("Server running on port 2701"));







// //TASk -2:

// // const express = require("express");
// // const cors = require("cors");
// // const bodyParser = require("body-parser");
// // const fs = require("fs");
// // const path = require("path");
// // const { DeepFace } = require("deepface");

// // const app = express();
// // app.use(cors());
// // app.use(bodyParser.json({ limit: "10mb" }));

// // // Face Matching API
// // app.post("/api/liveness-check", async (req, res) => {
// //     try {
// //         const { image } = req.body;

// //         // Convert Base64 Image to File
// //         const imagePath = path.join(__dirname, "user-face.jpg");
// //         const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
// //         fs.writeFileSync(imagePath, base64Data, "base64");

// //         // Compare with Stored Face (Example Face Stored in 'database-face.jpg')
// //         const result = await DeepFace.verify(imagePath, "database-face.jpg");

// //         if (result.verified) {
// //             res.json({ message: "Liveness Verified! You are real." });
// //         } else {
// //             res.json({ message: "Verification Failed! Try again." });
// //         }
// //     } catch (error) {
// //         console.error("Error:", error);
// //         res.status(500).json({ error: "Liveness check failed" });
// //     }
// // });

// // app.listen(2701, () => console.log("Server running on port 2701"));













const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 2701;

app.use(cors());
app.use(express.json({ limit: "10mb" })); // for image data


// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // Handle requests by serving index.html for all routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });



const saveImageToDisk = (base64Data) => {
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 image data");
  }

  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `nic-${Date.now()}.jpg`;
  const filePath = path.join(__dirname, "OCRImages", fileName);

  fs.writeFileSync(filePath, buffer);
  return fileName;
};

// ========== ROUTE: OCR Image Scan ========== //
app.post("/api/nic-scan", async (req, res) => {
  try {
    const { image } = req.body;
    const fileName = saveImageToDisk(image);
    console.log("Image saved as:", fileName)

    if (!image) return res.status(400).json({ error: "Image not provided" });

    const result = await Tesseract.recognize(image, "eng");
    res.json({ text: result.data.text });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "Failed to process NIC" });
  }
});

// ========== ROUTE: Video Upload ========== //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const filename = `nic-session-${timestamp}.webm`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post("/api/nic-video", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded" });
  }

  console.log("Video uploaded to:", req.file.path);
  res.json({ message: "Video uploaded successfully", path: req.file.path });
});

// ========== Start Server ========== //
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
