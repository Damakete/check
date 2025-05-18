const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { exportTasksReport, exportUsersReport } = require('../controllers/reportController');

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); //* Export tasks report as Excel or PDF
router.get("/export/users", protect, adminOnly, exportUsersReport); //* Export users task report

module.exports = router;