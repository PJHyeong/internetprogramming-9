
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Tag = db.Tag;

// 태그 등록 (POST /api/tags)
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await Tag.create({ name });
        res.status(201).json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating tag' });
    }
});

// 태그 검색 (GET /api/tags)
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tags' });
    }
});
