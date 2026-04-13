import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  genre: { type: String, required: true, trim: true },
  country: { type: String, trim: true },
  debutYear: { type: Number, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  monthlyListeners: { type: Number, default: 0 },
  bio: { type: String, trim: true },
  profilePhotoUrl: { type: String },
  profilePhotoFileName: { type: String },
  profilePhotoMetadata: { type: Object },
  socialLinks: {
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    spotify: { type: String, trim: true }
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Indexes for efficient querying
artistSchema.index({ name: "text", bio: "text" });
artistSchema.index({ genre: 1 });
artistSchema.index({ country: 1 });
artistSchema.index({ status: 1 });

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;