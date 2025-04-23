import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import Evidence from "../models/Evidence.js";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();
export const PINATA_API_KEY = "b0eb65500b85af38afba";
export const PINATA_SECRET_KEY =
  "386b440ded4b0be870e7b0e32d3d871102ea2f7c608e557a2e5bd26bdea405bb";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload to Pinata IPFS
const uploadToPinata = async (fileBuffer, fileName) => {
  const formData = new FormData();
  formData.append("file", fileBuffer, fileName);

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return response.data.IpfsHash;
};

// Upload evidence route
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const ipfsHash = await uploadToPinata(
      req.file.buffer,
      req.file.originalname
    );

    const evidence = new Evidence({
      caseNumber: req.body.caseNumber,
      description: req.body.description,
      ipfsHash: ipfsHash,
      fileName: req.file.originalname,
      uploadedBy: req.user.userId,
      date: new Date(),
    });

    const savedEvidence = await evidence.save();

    res.status(201).json({
      message: "Evidence uploaded successfully to IPFS",
      evidence: savedEvidence,
      ipfsHash: ipfsHash,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Download evidence from Pinata
router.get("/download/:ipfsHash", auth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${req.params.ipfsHash}`,
      {
        responseType: "arraybuffer",
      }
    );

    res.send(Buffer.from(response.data));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to download evidence", error: error.message });
  }
});

// Get evidence by case number
router.get("/case/:caseNumber", auth, async (req, res) => {
  try {
    const evidences = await Evidence.find({
      caseNumber: req.params.caseNumber,
    }).sort({ date: -1 });
    res.json(evidences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch evidence", error: error.message });
  }
});

// Delete evidence
router.delete("/delete/:caseNumber", auth, async (req, res) => {
  try {
    const deletedEvidence = await Evidence.findOneAndDelete({
      caseNumber: req.params.caseNumber,
    });

    if (!deletedEvidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    res.json({
      message: "Evidence deleted successfully",
      deletedEvidence,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete evidence" });
  }
});

// Get all cases
router.get("/cases", auth, async (req, res) => {
  try {
    const allCases = await Evidence.find();
    res.status(200).json(allCases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cases" });
  }
});

// Check if case number exists
router.get("/check/:caseNumber", async (req, res) => {
  try {
    const evidence = await Evidence.findOne({
      caseNumber: req.params.caseNumber,
    });
    res.json({ exists: !!evidence });
  } catch (error) {
    res.status(500).json({ message: "Error checking case number" });
  }
});

export { router as evidenceRoutes };
