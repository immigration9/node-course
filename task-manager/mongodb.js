const { MongoClient } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // localhost로 입력하면 mongodb 버그가 있다
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      console.log('Unable to connect to database!');
      return;
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({ name: 'MinGu' }, (error, user) => {
    //   if (error) return console.log('Unable to retrieve data');
    //   console.log(user);
    // });

    // db.collection('users')
    //   .find({ age: 30 })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection('users')
    //   .find({ age: 30 })
    //   .count((error, count) => {
    //     console.log(count);
    //   });

    const updatePromise = db.collection('users').updateOne(
      {
        name: 'Anthony',
      },
      {
        $set: {
          name: 'Mike',
        },
      }
    );

    updatePromise
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
