// const { group } = require('console');
const { randomUUID } = require('crypto');
const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const app = express();
const { peerProxy } = require('./websocket.js');

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


//  put breakoints on all the apis to make sure that they are actually called. if they are never called, then delete them!!
///////////////////////////////////////////////////////////////////



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
  
  
  app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
  
  const httpServer = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  
  // httpServer.on('upgrade', (request, socket, head) => {
  //     this.wss.handleUpgrade(request, socket, head, (ws) => {
  //         this.wss.emit('connection', ws, request);
  //     });
  // });

  //////////////////////////////////////////// GAME LOGIC /////////////////////////////////////////////////


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
        this.connections = {};
        // this.initializeWebSocketServer(httpServer);
      }

//       initializeWebSocketServer(httpServer) {
//         this.wss = new WebSocketServer({ noServer: true });
    
//         this.wss.on('connection', (ws) => {
//           ws.on('message', (data) => {
//               // Handle incoming messages
//               const messageData = JSON.parse(data);
//               if (messageData.name) {
//                   const name = messageData.name;
//                   this.connections[name] = { alive: true, ws: ws };
//                   console.log(`Added ${name} to connections`);

//                   // Notify other players about the new player
//                   // this.broadcastMessageExcept(name, { name: `${name}` });
//               } else {
//                   // Handle other types of messages
//               }
//           });
    
//             ws.on('close', () => {
//                 // Handle connection closing
//                 const name = Object.keys(this.connections).find(key => this.connections[key].ws === ws);
//                 if (name) {
//                     delete this.connections[name];
//                 }
//             });
    
//             ws.on('pong', () => {
//                 // Handle pong messages
//                 const name = Object.keys(this.connections).find(key => this.connections[key].ws === ws);
//                 if (name && this.connections[name]) {
//                     this.connections[name].alive = true;
//                 }
//             });
//         });

//         httpServer.on('upgrade', (request, socket, head) => {
//           this.wss.handleUpgrade(request, socket, head, (ws) => {
//               this.wss.emit('connection', ws, request);
//           });
//       });
    
//         // Keep active connections alive
//         setInterval(() => {
//             Object.keys(this.connections).forEach((name) => {
//                 const connection = this.connections[name];
//                 if (!connection.alive) {
//                     connection.ws.terminate();
//                     delete this.connections[name];
//                 } else {
//                     connection.alive = false;
//                     connection.ws.ping();
//                 }
//             });
//         }, 10000);
//     }
    

//     createConnection(name) {
//       const ws = new WebSocket(`ws://localhost:${port}`);
//       // const ws = new WebSocket(`ws://startup.odd-one-out.click:${port}`);

//       ws.on('open', () => {
//         // Send the player's name to the server
//         ws.send(JSON.stringify({ name: name }));
//         // Emit custom event to signal connection creation
//         this.wss.emit('addConnection', ws, name);
//     });

//       ws.on('message', (data) => {
//           // Handle incoming messages
//           console.log(data);
//       });

//       ws.on('close', () => {
//           // Handle connection closing
//           console.log('Connection closed');
//       });

//       ws.on('error', (error) => {
//           // Handle connection errors
//           console.error('Connection error:', error);
//       });

//   }

//   broadcastMessageExcept(excludedPlayer, messageObject) {
//     Object.keys(this.connections).forEach((name) => {
//         if (name !== excludedPlayer) {
//             this.connections[name].ws.send(JSON.stringify(messageObject));
//         }
//     });
// }

    
      
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
  
  // function generateOddOneOut(reqBody){
  //   console.log(reqBody)
  //   const code = reqBody.code;
  //   games.get(code).generateOddOneOutIndex();
  //   games.get(code).readyToStartGame = true;
  // }
  
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
  
  function addPlayer(reqBody) {
    console.log(reqBody);
    const code = reqBody.code;
    const name = reqBody.name;
    

    const game = games.get(code);
    game.players.push(name);

    // game.createConnection(name);

    // const message = { type: "addedPlayer", playerName: "John" }; // Example message
    // wss.send(JSON.stringify(message));


    console.log(game.toString());
    console.log(game.connections);
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

//////////////////////////////////////////// DATABASE CODE /////////////////////////////////////////////////



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


function setAuthCookie(res, authToken) {
    res.cookie('token', authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

//////////////////////////////////////////// WEBSOCKET CODE /////////////////////////////////////////////////
// function createWebSocket(httpServer, code, name) {

//   const game = games.get(code);
  

//   const wss = new WebSocket.Server({ noServer: true });


//   httpServer.on('upgrade', (request, socket, head) => {
//       wss.handleUpgrade(request, socket, head, function done(ws) {
//           wss.emit('connection', ws, request);
//       });
//   });


//   wss.on('connection', (ws) => {

//       game.connections[name] = ws;


//       ws.on('message', function message(data) {
//           Object.entries(game.connections).forEach(([playerName, c]) => {
//               if (playerName !== name) {
//                   c.send(data);
//               }
//           });
//       });


//       ws.on('close', () => {
//           delete game.connections[name];
//       });


//       ws.on('pong', () => {
//           game.connections[connectionId].alive = true;
//       });
//   });

//   setInterval(() => {
//       Object.values(game.connections).forEach((c) => {
//           if (!c.alive) {
//               c.terminate();
//           } else {
//               c.alive = false;
//               c.ping();
//           }
//       });
//   }, 10000);


//   return wss;
// }
const wss = peerProxy(httpServer, games);