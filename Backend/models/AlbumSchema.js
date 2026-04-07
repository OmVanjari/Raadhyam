import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  genre: { type: String, required: true, trim: true },
  releaseYear: { type: Number, trim: true },
  totalTracks: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Draft'], 
    default: 'Active' 
  },
  label: { type: String, trim: true },
  upcCode: { type: String, trim: true, unique: true, sparse: true },
  coverUrl: { type: String },
  coverFileName: { type: String },
  coverMetadata: { type: Object },
  description: { type: String, trim: true },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Indexes for efficient querying
albumSchema.index({ title: "text", artist: "text" });
albumSchema.index({ genre: 1 });
albumSchema.index({ status: 1 });
albumSchema.index({ releaseYear: 1 });

const Album = mongoose.model("Album", albumSchema);
export default Album;