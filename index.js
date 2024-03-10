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



apiRouter.post('/gameroom', (req, res) => {
    gameRoomCode = createGameRoom();
    res.send(gameRoomCode);
  });

  apiRouter.post('/addPlayer', (req, res) => {
    addPlayer(req.body, votes);
    res.send(addedPlayer);
  });

  apiRouter.get('/players', (_req, res) => {
    res.send(players);
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
        this.votes = {}
        this.readyToStartGame = false;
    }

    toString(){
        if(this.readyToStartGame){
            return `\tPlayers = ${this.players}\n\toddOneOut = ${players[this.oddOneOutIndex]}\n\tGame Room Code = ${this.code}\n\tVotes = ${this.votes}`;
        } else {
            return `\tPlayers = ${this.players}\n\toddOneOut = Not Yet Determined!\n\tGame Room Code = ${this.code}\n\tVotes = ${this.votes}`;
        }
    }

    generateOddOneOutIndex(){
        const randomNum = Math.floor(Math.random() * this.players.length); 
        this.oddOneOutIndex = randomNum;
    }

}


    games = {}

let secretWordPairs = [
    ["Squid", "Octopus"],
    ["Queen", "Princess"],
    ["Trophy", "Medal"]]


async function getSecretWord(reqBody){
    console.log(reqBody)
    var json = JSON.parse(reqBody);
    const code = json.code;
    const name = json.name;
    await games[code].readyToStartGame == true;
    if (games[code].players[oddOneOutIndex] == name){
        return games[code].oddWord;
    } else {
        return games[code].groupWord;
    }
}

function generateOddOneOut(reqBody){
    console.log(reqBody)
    var json = JSON.parse(reqBody);
    const code = json.code;
    games[code].generateOddOneOutIndex();
    games[code].readyToStartGame = true;
}

function createGameRoom() {
    const code = generateGameRoomCode()
    const[groupWord, oddWord] = organizeSecretWords();
    games[code] = new GameRoom(code, groupWord, oddWord);
    return code;
}

function generateGameRoomCode() {
    const uuid = randomUUID();
    const code = uuid.replace(/-/g, '').substring(0, 6);
    return code;
  }

 function addPlayer(reqBody, votes){
    console.log(reqBody)
    var json = JSON.parse(reqBody);
    const code = json.code;
    const name = json.name;

    games[code].players.push(name);
    games[code].votes.set(name, 0);
 }



 function organizeSecretWords(){

    const randomNum = Math.floor(Math.random() * secretWordPairs.length); 
    return [secretWordPairs[randomNum][0], secretWordPairs[randomNum][1]];





 }