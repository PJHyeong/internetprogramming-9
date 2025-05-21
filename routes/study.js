

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const StudyPost = db.StudyPost;

// 모집글 생성 (POST /api/study)
router.post('/', async (req, res) => {
    try {
        const { title, content, field, location, dayOfWeek, time, maxMembers, creatorId } = req.body;
        const studyPost = await StudyPost.create({ title, content, field, location, dayOfWeek, time, maxMembers, creatorId });
        res.status(201).json(studyPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating study post' });
    }
});

// 모집글 수정 (PUT /api/study/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await StudyPost.update(req.body, { where: { id } });
        if (updated) {
            const updatedPost = await StudyPost.findByPk(id);
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: 'Study post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating study post' });
    }
});

// 모집글 삭제 (DELETE /api/study/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await StudyPost.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Study post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting study post' });
    }
});

// 모집글 목록 조회 (GET /api/study)
router.get('/', async (req, res) => {
    try {
        const studyPosts = await StudyPost.findAll();
        res.status(200).json(studyPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching study posts' });
    }
});

// 모집글 상세 조회 (GET /api/study/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const studyPost = await StudyPost.findByPk(id);
        if (studyPost) {
            res.status(200).json(studyPost);
        } else {
            res.status(404).json({ message: 'Study post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching study post' });
    }
});

module.exports = router;