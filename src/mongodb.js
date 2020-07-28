const MongoClient = require("mongodb").MongoClient;
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log("Unable to connect to DB .");
  console.log("connected!");
  const db = client.db(databaseName);
  const TASKS = [
    { name: "task1", completed: true },
    { name: "task2", completed: false },
    { name: "task3", completed: true },
  ];
  db.collection("Tasks").insertMany(TASKS, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
  });
});

/*
const uri =
  "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/
