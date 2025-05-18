const { MdPending } = require('react-icons/md');
const Task = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');

//! @desc - Export tasks report as Excel or PDF
//! @route - GET /api/reports/export/tasks
//! @access - Private (admin)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name email')
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    //* Define columns
    worksheet.columns = [
      { header: 'Task ID', key: '_id', width: 25 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Due Date', key: 'dueDate', width: 20 },
      { header: 'Assigned To', key: 'assignedTo.name', width: 30 },
    ];

    //* Add rows
    tasks.forEach(task => {
      const assignedTo = task.assignedTo
        .map(user => `${user.name} (${user.email})`)
        .join(', ');
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split('T')[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    //*  Set response headers for Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=tasks_report.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
    .status(500)
    .json({ message: "Error exporting tasks", error: error.message });
  }
};

//! @desc - Export users task report
//! @route - GET /api/reports/export/users
//! @access - Private (admin)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find({}).select('name email _id').lean();
    const tasks = await Task.find({}).populate('assignedTo', 'name email _id');

    const userTaskMap = {};
    users.forEach(user => {
      userTaskMasp[user._id] = {
        name: user.name,
        email: user.email,
        taskcount: 0,
        pendingTaskCount: 0,
        inProgressTaskCount: 0,
        completedTaskCount: 0,
      };
    });

    tasks.forEach(task => {
      if (task.assignedTo) {
        task.assignedTo.forEach(assignedUser => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === 'Todo') {
              userTaskMap[assignedUser._id].pendingTaskCount += 1;
            } else if (task.status === 'In Progress') {
              userTaskMap[assignedUser._id].inProgressTaskCount += 1;
            } else if (task.status === 'Done') {
              userTaskMap[assignedUser._id].completedTaskCount += 1;
            }
          }
        });
      }
    });


    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users task report');

    //* Define columns
    worksheet.columns = [
      { header: 'User Name', key: '_id', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Tasks assigned tasks', key: 'taskCount', width: 20 },
      { header: 'Todo tasks', key: 'pendingTaskCount', width: 20 },
      { header: 'In Progress tasks', key: 'inProgressTaskCount', width: 20 },
      { header: 'Completed tasks', key: 'completedTaskCount', width: 20 },
    ];

    Object.values(userTaskMap).forEach(user => {
      worksheet.addRow(user);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=users_report.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
    .status(500)
    .json({ message: "Error exporting tasks", error: error.message });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};