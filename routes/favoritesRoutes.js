const express = require('express');
const {
    addFavorite,
    getFavorites,
    removeFavorite,
} = require('../controllers/favoritesController');

const router = express.Router();

// Endpoint to add a favorite station
router.post('/add', addFavorite);

// Endpoint to get all favorite stations for a user
router.get('/', getFavorites);

// Endpoint to remove a favorite station by its ID
router.delete('/remove/:id', removeFavorite);

module.exports = router;
