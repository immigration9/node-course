const express = require('express');
const router = new express.Router();
const { checkPermit, updateData } = require('../utils/request');
const auth = require('../middleware/auth');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');

router.post('/users', async (req, res, next) => {
  const user = new User(req.body);

  try {
    checkPermit(req.body, ['name', 'email', 'password', 'age']);

    const token = await user.generateAuthToken();
    await user.save();

    res.status(201).send({ user, token });
  } catch (e) {
    next(e);
  }
});

router.post('/users/login', async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    await user.save();

    res.send({ user, token });
  } catch (e) {
    next(e);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (e) {
    next(e);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    next(e);
  }
});

router.get('/users/me', auth, async (req, res, next) => {
  res.send(req.user.getPublicProfile());
});

/**
 * @deprecated
 */
router.get('/users/:userId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError();
    }

    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.patch('/users/me', auth, async (req, res, next) => {
  try {
    checkPermit(req.body, ['name', 'email', 'password', 'age']);

    // const user = await User.findById(req.params.id);

    // /**
    //  * 1. Update successful
    //  * 2. Update failed
    //  * 3. No user found
    //  */
    // if (!user) {
    //   throw new NotFoundError();
    // }

    updateData(req.user, req.body);
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    next(e);
  }
});

router.delete('/users/me', auth, async (req, res, next) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);

    // if (!user) {
    //   throw new NotFoundError();
    // }
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
