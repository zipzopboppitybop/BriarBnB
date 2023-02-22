// backend/routes/api/spot.js
const express = require('express');
const { Op } = require("sequelize");
const { Spot, User, SpotImage } = require('../../db/models');
const { restoreUser, requireAuth } = require("../../utils/auth.js");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];
const router = express.Router();
router.use(restoreUser);
// Get All Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll();

    res.json({
        Spots: allSpots
    })
});

// Get All Spots That Belong To Current User
router.get(
    '/current',
    restoreUser,
    async (req, res) => {
        const { user } = req;
        if (user) {
            const allSpots = await Spot.findAll({
                where: {
                    ownerId: {
                        [Op.is]: user.id
                    }
                }
            });

            //res.status(200);
            return res.json({
                Spots: allSpots
            });
        } else {
            const err = new Error();
            err.message = 'Authentication required';
            err.statusCode = 401;
            res.status(401);
            return res.json(err);
        };
    }
);

router.get(
    '/:spotId',
    async (req, res) => {
        const currentSpot = await Spot.findByPk(req.params.spotId);

        if (!currentSpot) {
            const err = new Error();
            err.message = "Spot couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        let currentSpotData = currentSpot.toJSON();

        currentSpotData.avgStarRating = currentSpotData.avgRating;
        currentSpotData.SpotImages = await SpotImage.findAll({
            attributes: ["id", "url", "preview"],
            where: {
                spotId: {
                    [Op.is]: currentSpot.id
                }
            }
        })
        currentSpotData.Owner = await User.findOne({
            attributes: ["id", "firstName", "lastName"],
            where: {
                id: {
                    [Op.is]: currentSpot.ownerId
                }
            }
        })

        delete currentSpotData.avgRating;
        delete currentSpotData.previewImage;

        res.json(currentSpotData);
    }
);

module.exports = router;
