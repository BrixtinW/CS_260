

const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('OddOneOut');
const collection = db.collection('Users');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// THE PREVIOUS CODE PINGS THE DATABASE TO TEST AND SEE IF THERE IS A CONNECTION. "If that fails then either the connection string is incorrect, the credentials are invalid, or the network is not working. "

export async function insertUser(username, password) {
  const user = {
    username: username,
    password: password
  }

  await collection.insertOne(user);
}

export async function findUser(username, password) {

  const query = { username: 'Condo', password: { $lt: 2 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };

  const cursor = collection.find(query, options);
  const rentals = await cursor.toArray();
  rentals.forEach((i) => console.log(i));

}