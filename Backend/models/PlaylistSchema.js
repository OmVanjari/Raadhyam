import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true, trim: true },
  genre: { type: String, required: true, trim: true },
  visibility: { 
    type: String, 
    enum: ['Public', 'Private', 'Unlisted'], 
    default: 'Public' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  description: { type: String, trim: true },
  coverImageUrl: { type: String },
  coverImageFileName: { type: String },
  coverImageMetadata: { type: Object },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  followers: { type: Number, default: 0 },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

// Indexes for efficient querying
playlistSchema.index({ name: "text", description: "text" });
playlistSchema.index({ genre: 1 });
playlistSchema.index({ visibility: 1 });
playlistSchema.index({ status: 1 });
playlistSchema.index({ creator: 1 });

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;