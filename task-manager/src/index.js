const express = require('express');
const { MongoError } = require('mongodb');
const { Error } = require('mongoose');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const { JsonWebTokenError } = require('jsonwebtoken');
const NotFoundError = require('./errors/NotFound');
const InvalidParameterError = require('./errors/InvalidParameter');
const UnauthorizedError = require('./errors/Unauthorized');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.use((err, req, res, next) => {
  if (err instanceof Error.ValidationError) {
    res.status(400).send(err);
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).send({ message: 'Invalid Token' });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).send({ message: 'Unauthorized Credential' });
  } else if (err instanceof MongoError) {
    res.status(409).send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).send(err);
  } else if (err instanceof InvalidParameterError) {
    res.status(422).send(err);
  } else {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

const Task = require('./models/task');
const User = require('./models/user');

(async () => {
  // const task = await Task.findById('602a8f462a25b8450ba849a2');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  const user = await User.findById('602a8f0f2dc57243a96c6c14');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
})();

// const jwt = require('jsonwebtoken');

// (async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'thisisasecret', {
//     expiresIn: '7 days',
//   });
//   console.log(token);

//   const payload = jwt.verify(token, 'thisisasecret');
//   console.log(payload);
// })();
