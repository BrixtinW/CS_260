const { group } = require('console');
const { randomUUID } = require('crypto');
const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

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

  apiRouter.get('/players', (_req, res) => {
    res.send(players);
  });

//   NOT DONE
  apiRouter.post('/login', (_req, res) => {
    var userExists = getUser(_req.body)
    res.send(userExists);
  });

  apiRouter.get('/votes', (_req, res) => {
    res.send(votes);
  });

  apiRouter.get('/secretWord', (req, res) => {
    secretWord = getSecretWord(req.body);
    res.send(secretWord);
  });

apiRouter.post('/vote', (req, res) => {
  votes = updateVotes(req.body, votes);
  res.send(scores);
});

apiRouter.post('/generateOddOneOut', (req, res) => {
    generateOddOneOut(req.body);
  });

//   NOT DONE
  apiRouter.post('/register', (req, res) => {
    createUser(req.body);
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

    const users = new Map([
        ['user1', 'pass1'],
        ['user2', 'pass2']
    ]);
    const games = new Map();

let secretWordPairs = [
    ["Squid", "Octopus"],
    ["Queen", "Princess"],
    ["Trophy", "Medal"]]


async function getSecretWord(reqBody){
    console.log(reqBody)
    const code = reqBody.code;
    const name = reqBody.name;
    console.log(games.get(code).oddOneOutIndex);
        if( games.get(code).readyToStartGame == true){
            if (games.get(code).players[oddOneOutIndex] == name){
                return games.get(code).oddWord;
            } else {
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
    games.get(code).votes.set(name, 0);
    console.log(games.get(code));
 }

 function getUser(reqBody) {
    console.log(reqBody)
    const username = reqBody.username;
    const password = reqBody.password;
    return users.get(username) == password;
 }

 function createUser(reqBody) {
     console.log(reqBody)
    const username = reqBody.username;
    const password = reqBody.password;
    users.set(username, password);
    console.log(users)
 }


 function organizeSecretWords(){
    const randomNum = Math.floor(Math.random() * secretWordPairs.length); 
    return [secretWordPairs[randomNum][0], secretWordPairs[randomNum][1]];
 }