 const Task = require('../models/task.model');

// @desc    Create new task
exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  const task = await Task.create({
    title,
    description,
    status,
    user: req.user._id,
  });

  res.status(201).json(task);
};

// @desc    Get all tasks (with pagination & search)
exports.getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const status = req.query.status || '';

  const query = {
    user: req.user._id,
    title: { $regex: search, $options: 'i' },
  };

  if (status) query.status = status;

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // ⚡ Use lean for speed

  const total = await Task.countDocuments(query);

  res.json({
    tasks,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};

// @desc    Get single task
exports.getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.json(task);
};

// @desc    Update task
exports.updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, description, status, completed } = req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;

  // ✅ Add this line to make 'Mark Completed' work
  if (typeof completed === 'boolean') {
    task.completed = completed;
  }

  const updatedTask = await task.save();
  res.json(updatedTask);
};


// @desc    Delete task
exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.json({ message: 'Task deleted' });
};


//seedtask controller function
exports.seedTasks = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Corrected to _id
    const tasks = [];

    for (let i = 1; i <= 1000; i++) {
      tasks.push({
        title: `Task ${i}`,
        description: `Auto-generated task ${i}`,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await Task.insertMany(tasks);
    res.status(201).json({ message: '🚀 1000 tasks seeded successfully!' });
  } catch (err) {
    console.error('Seeding Error:', err);
    res.status(500).json({ message: 'Failed to seed tasks.' });
  }
};
