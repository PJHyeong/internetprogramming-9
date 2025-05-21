
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Badge = db.Badge;

// 뱃지 등록 (POST /api/badges)
router.post('/', async (req, res) => {
    try {
        const { status, location } = req.body;
        const badge = await Badge.create({ status, location });
        res.status(201).json(badge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating badge' });
    }
});

// 뱃지 목록 조회 (GET /api/badges)
router.get('/', async (req, res) => {
    try {
        const badges = await Badge.findAll();
        res.status(200).json(badges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching badges' });
    }
});

module.exports = router;