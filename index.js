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

apiRouter.get('/verdict', (_req, res) => {
  res.send(votes);
});

apiRouter.post('/vote', (req, res) => {
  votes = updateVotes(req.body, votes);
  res.send(scores);
});




// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


votes = {}

function createGameRoom() {
    const code = generateGameRoomCode()
    votes[code] = {};
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
    const name = json.name

    votes[code][name] = 0;
 }