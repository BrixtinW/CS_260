const { group } = require('console');
const { randomUUID } = require('crypto');
const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
// import { insertUser, findUser } from './database.mjs';
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);



apiRouter.get('/gameroom', (req, res) => {
    gameRoomCode = createGameRoom();
    res.send(gameRoomCode);
  });

  apiRouter.post('/addPlayer', (req, res) => {
    addPlayer(req.body);
  });

  apiRouter.post('/players', (req, res) => {
    res.send(games.get(req.body.code).players);
  });

  apiRouter.post('/login',  async (req, res) => {
    const user = await getUser(req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        setAuthCookie(res, user.token);
        res.send({ id: user._id });
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
  });
//   (_req, res) => {
//     var userExists = getUser(_req.body)
//     res.send(userExists);
//   });

// app.get('/route', (req, res) => {
//     // Access the cookie named 'auth' from the request object
//     const authToken = req.cookies.auth;
//     if (authToken){
//         const user = await getAuthenticatedUser(authToken);
//     }
//     // Use the authToken as needed
// });

app.get('/logout', (req, res) => {

    res.clearCookie('token');

    res.send('Authentication token deleted successfully.');
});


    app.get('/user', async (req, res) => {
        authToken = req.cookies['token'];
        console.log(authToken);
        const user = await collection.findOne({ token: authToken });
        if (user) {
        console.log(user);
        res.send({ username: user.username });
        return;
        }
        res.status(401).send({ msg: 'Unauthorized' });
    });

  apiRouter.post('/register', async (req, res) => {
    if (await getUser(req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await createUser(req.body.username, req.body.password);

      // Set the cookie
      setAuthCookie(res, user.token);

      res.send({
        id: user._id,
      });
    }
  });

  apiRouter.get('/votes', (_req, res) => {
    res.send(votes);
  });

  apiRouter.post('/secretWord', (req, res) => {
    secretWord = getSecretWord(req.body);
    console.log(secretWord);
    res.send(secretWord);
  });

apiRouter.post('/vote', (req, res) => {
  const winners = updateVotes(req.body);
  console.log(winners);
  console.log(games.get(req.body.code).gameOver);
  jsonObj = JSON.stringify({"winners": winners, "gameOver": games.get(req.body.code).gameOver})
  console.log(jsonObj)
  res.send(jsonObj)
});

apiRouter.post('/generateOddOneOut', (req, res) => {
    generateOddOneOut(req.body);
  });


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

class GameRoom {

    constructor(code, groupWord, oddWord){
        this.players = []
        this.oddOneOutIndex = 0;
        this.groupWord = groupWord;
        this.oddWord = oddWord;
        this.code = code;
        this.votes = new Map();
        this.readyToStartGame = false;
        this.gameOver = false;
    }

    toString(){
        if(this.readyToStartGame){
            return `\tPlayers = ${this.players}\n\toddOneOut = ${players[this.oddOneOutIndex]}\n\tGame Room Code = ${this.code}\n\tVotes = ${this.votes}\n\tgroupWord = ${this.groupWord}\n\toddWord = ${this.oddWord}\n\tready to start: ${this.readyToStartGame}`;
        } else {
            return `\tPlayers = ${this.players}\n\toddOneOut = Not Yet Determined!\n\tGame Room Code = ${this.code}\n\tVotes = ${this.votes}\n\tgroupWord = ${this.groupWord}\n\toddWord = ${this.oddWord}\n\tready to start: ${this.readyToStartGame}`;
        }
    }

    generateOddOneOutIndex(){
        const randomNum = Math.floor(Math.random() * this.players.length); 
        this.oddOneOutIndex = randomNum;
    }

}

    const games = new Map();

let secretWordPairs = [
    ["Squid", "Octopus"],
    ["Queen", "Princess"],
    ["Trophy", "Medal"]]


function getSecretWord(reqBody){
    console.log(reqBody)
    const code = reqBody.code;
    const name = reqBody.name;
    console.log(games.get(code).oddOneOutIndex);
        if( games.get(code).readyToStartGame == true){
            console.log(games.get(code).players[games.get(code).oddOneOutIndex])
            if (games.get(code).players[games.get(code).oddOneOutIndex] == name){
                console.log(games.get(code).oddWord)
                return games.get(code).oddWord;
            } else {
                console.log(games.get(code).groupWord)
                return games.get(code).groupWord;
            }
        }
}

function generateOddOneOut(reqBody){
    console.log(reqBody)
    const code = reqBody.code;
    games.get(code).generateOddOneOutIndex();
    games.get(code).readyToStartGame = true;
}

function createGameRoom() {
    const code = generateGameRoomCode()
    const[groupWord, oddWord] = organizeSecretWords();
    console.log(groupWord);
    console.log(oddWord)
    console.log(code)
    games.set(code, new GameRoom(code, groupWord, oddWord));
    console.log(games.get(code).toString());
    return JSON.stringify(code);
}

function generateGameRoomCode() {
    const uuid = randomUUID();
    const code = uuid.replace(/-/g, '').substring(0, 6);
    return code;
  }

 function addPlayer(reqBody, votes){
    console.log(reqBody)
    const code = reqBody.code;
    const name = reqBody.name;

    games.get(code).players.push(name);
    console.log(games.get(code).toString());
 }

 async function getUser(username) {
    return collection.findOne({ username: username });
 }

 async function createUser(username, password) {

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        password: passwordHash,
        token: uuid.v4()
      };
      return collection.insertOne(user);
 }


 function organizeSecretWords(){
    const randomNum = Math.floor(Math.random() * secretWordPairs.length); 
    return [secretWordPairs[randomNum][0], secretWordPairs[randomNum][1]];
 }

 function updateVotes(requestBody){
    let winners = null;
    const voter = requestBody.voter;
    const vote = requestBody.vote;
    const code = requestBody.code;
    games.get(code).votes.set(voter, vote);
    console.log(games.get(code).votes);
    if (games.get(code).players.length >= Map.size){
        winners = readTheVotes(code);
        for (const winner of winners) {
            if (games.get(code).players[games.get(code).oddOneOutIndex] == winner) { 
                games.get(code).gameOver = true; 
            } else {
            const oddOneOut = games.get(code).players[games.get(code).oddOneOutIndex]
            games.get(code).players = games.get(code).filter(value => value !== winner);
            games.get(code).vote.clear();
            for (let i = 0; i < games.get(code).players.size; i++){
                if (games.get(code).players[i] == oddOneOut){
                    games.get(code).oddOneOutIndex = i;
                }
            }
            }
        }
    }
    return winners;
}


function readTheVotes(code){
    const voteCounts = new Map();
    

    for (const [player, votedFor] of games.get(code).votes) {
        for (const votedPlayer of votedFor.values()) {
            const count = voteCounts.get(votedPlayer);
            voteCounts.set(votedPlayer, count + 1);
        }
    }
    

    const maxVotes = Math.max(...voteCounts.values());
    const winners = [];
    for (const [player, votes] of voteCounts) {
        if (votes === maxVotes) {
            winners.push(player);
        }
    }
    
    // Return the winner(s)
    return winners.length === 1 ? winners[0] : winners;
}

// ///////////////////////////////////////// DATABASE CODE /////////////////////////////////////////////////



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

// async function insertUser(username, password) {
//   const user = {
//     username: username,
//     password: password
//   }

//   await collection.insertOne(user);
// }


//   const cursor = collection.find(query, options);
//   const rentals = await cursor.toArray();
//   rentals.forEach((i) => console.log(i));

// }

function setAuthCookie(res, authToken) {
    res.cookie('token', authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

//   async function getAuthenticatedUser(authToken){
//     return collection.findOne({ token: authToken });
//   }