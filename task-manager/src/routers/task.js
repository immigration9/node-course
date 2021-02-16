const express = require('express');
const router = new express.Router();
const { checkPermit, updateData } = require('../utils/request');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const NotFoundError = require('../errors/NotFound');

/**
 * GET /tasks?completed=true / false
 * GET /tasks?limit=10&skip=0
 * GET /tasks?sortBy=createdAt:desc
 */
router.get('/tasks', auth, async (req, res, next) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const [key, value] = req.query.sortBy.split(':');
    sort[key] = value === 'asc' ? 1 : -1;
  }

  try {
    /**
     * 일반적인 방법이라면 아래와 같이 find를 owner로 걸 수 있다.
     * const tasks = await Task.find({ owner: req.user._id });
     *
     * 하지만, 이미 user model에서 virtual로 Task를 묶어놨기 때문에
     * 아래와 같이 populating만 해줘도 가져올 수 있다
     */
    // await req.user.populate('tasks').execPopulate();
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    next(e);
  }
});

router.get('/tasks/:taskId', auth, async (req, res, next) => {
  try {
    /**
     * 원래 ID는 ObjectID가 들어가야 하는데, 이정도는 mongo에서 알아서 해준다
     */
    const task = await Task.findOne({
      _id: req.params.taskId,
      owner: req.user._id,
    });

    if (!task) {
      throw new NotFoundError();
    }
    res.send(task);
  } catch (e) {
    next(e);
  }
});

router.post('/tasks', auth, async (req, res, next) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    next(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res, next) => {
  try {
    checkPermit(req.body, ['description', 'completed']);

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      throw new NotFoundError();
    }

    updateData(task, req.body);
    await task.save();

    res.send(task);
  } catch (e) {
    next(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw new NotFoundError();
    }
    res.send(task);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
