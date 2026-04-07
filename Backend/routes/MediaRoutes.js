import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  // Album controllers
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  // Artist controllers
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  // Playlist controllers
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist
} from '../controllers/MediaController.js';

const router = express.Router();

// ==================== ALBUM ROUTES ====================
// POST /api/media/albums - Create a new album (admin only)
router.post('/albums', verifyToken, isAdmin, createAlbum);

// GET /api/media/albums - Get all albums (public)
router.get('/albums', getAllAlbums);

// GET /api/media/albums/:id - Get album by ID (public)
router.get('/albums/:id', getAlbumById);

// PUT /api/media/albums/:id - Update album (admin only)
router.put('/albums/:id', verifyToken, isAdmin, updateAlbum);

// DELETE /api/media/albums/:id - Delete album (admin only)
router.delete('/albums/:id', verifyToken, isAdmin, deleteAlbum);

// ==================== ARTIST ROUTES ====================
// POST /api/media/artists - Create a new artist (admin only)
router.post('/artists', verifyToken, isAdmin, createArtist);

// GET /api/media/artists - Get all artists (public)
router.get('/artists', getAllArtists);

// GET /api/media/artists/:id - Get artist by ID (public)
router.get('/artists/:id', getArtistById);

// PUT /api/media/artists/:id - Update artist (admin only)
router.put('/artists/:id', verifyToken, isAdmin, updateArtist);

// DELETE /api/media/artists/:id - Delete artist (admin only)
router.delete('/artists/:id', verifyToken, isAdmin, deleteArtist);

// ==================== PLAYLIST ROUTES ====================
// POST /api/media/playlists - Create a new playlist (authenticated users)
router.post('/playlists', verifyToken, createPlaylist);

// GET /api/media/playlists - Get all playlists (public)
router.get('/playlists', getAllPlaylists);

// GET /api/media/playlists/:id - Get playlist by ID (public)
router.get('/playlists/:id', getPlaylistById);

// PUT /api/media/playlists/:id - Update playlist (creator or admin only)
router.put('/playlists/:id', verifyToken, updatePlaylist);

// DELETE /api/media/playlists/:id - Delete playlist (creator or admin only)
router.delete('/playlists/:id', verifyToken, deletePlaylist);

// POST /api/media/playlists/:id/songs - Add song to playlist
router.post('/playlists/:id/songs', verifyToken, addToPlaylist);

// DELETE /api/media/playlists/:id/songs/:songId - Remove song from playlist
router.delete('/playlists/:id/songs/:songId', verifyToken, removeFromPlaylist);

export default router;