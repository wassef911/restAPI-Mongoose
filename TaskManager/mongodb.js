const { MongoClient, ObjectID } = require("mongodb");
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log("Unable to connect to DB .");
  console.log("connected!");
  const db = client.db(databaseName);
  db.collection("user").updateOne({
    _id,
  });
});
// CRUD
/*
    CREATE 

  const TASKS = [
    { name: "task1", completed: true },
    { name: "task2", completed: false },
    { name: "task3", completed: true },
  ];
  db.collection("Tasks").insertMany(TASKS, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
  });
*/

/*
    READ
  db.collection("Tasks").findOne(
    { _id: ObjectID("5f1f952d2e8d5416e3bf00ea") },
    (err, user) => {
      if (err) return console.log(err);
      console.log(user);
    }
  );
  console.log("__________________________________");
  db.collection("Tasks")
    .find({ completed: true })
    .toArray((err, docs) => {
      if (err) return console.log(err);
      console.log(docs);
    });
});

*/
