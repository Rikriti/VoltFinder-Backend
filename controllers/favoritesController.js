const db = require('../db'); // Ensure the correct path to the database connection

/**
 * Add a station to favorites
 */
const addFavorite = async (req, res) => {
    const { userId, stationId, stationName } = req.body;

    // Validate input
    if (!userId || !stationId) {
        return res.status(400).json({ message: 'User ID and Station ID are required' });
    }

    try {
        const query = 'INSERT INTO favorites (user_id, station_id, station_name) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [userId, stationId, stationName || null]);

        console.log('Insert Result:', result);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: 'Station added to favorites',
                favoriteId: result.insertId,
            });
        } else {
            return res.status(500).json({ message: 'Failed to add station to favorites' });
        }
    } catch (error) {
        console.error('Error adding favorite:', error.message);
        return res.status(500).json({
            message: 'An error occurred while adding the station to favorites',
            error: error.message,
        });
    }
};

/**
 * Get all favorite stations for a user
 */
const getFavorites = async (req, res) => {
    try {
        const userId = req.query.userId?.trim(); // Sanitize input

        // Validate input
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ message: 'A valid User ID is required' });
        }

        const query = 'SELECT * FROM favorites WHERE user_id = ?';
        const [rows] = await db.execute(query, [userId]);

        console.log('Fetched Favorites for User ID:', userId, rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No favorites found for this user' });
        }

        return res.status(200).json({ favorites: rows });
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
        return res.status(500).json({
            message: 'An error occurred while fetching favorites',
            error: error.message,
        });
    }
};

/**
 * Remove a station from favorites
 */
const removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Received ID to delete:', id); // Debug log

        if (!id) {
            return res.status(400).json({ message: 'Favorite ID is required' });
        }

        const query = 'DELETE FROM favorites WHERE id = ?';
        const [result] = await db.execute(query, [id]);

        console.log('Delete Result:', result); // Debug log

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Favorite removed successfully' });
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (error) {
        console.error('Error deleting favorite:', error.message); // Debug log
        res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
    }
};




module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite,
};
