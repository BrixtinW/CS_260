const { WebSocketServer } = require('ws');
const uuid = require('uuid');



function peerProxy(httpServer, games) {
    // Create a websocket object
    const wss = new WebSocketServer({ noServer: true });
  
    // Handle the protocol upgrade from HTTP to WebSocket
    httpServer.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });
  
    // Keep track of all the connections so we can forward messages
    let connections = [];
  
    wss.on('connection', (ws) => {
      const connection = { id: uuid.v4(), alive: true, ws: ws };
      connections.push(connection);
  
      // Forward messages to everyone except the sender
    //   ws.on('message', function message(data) {
    //     connections.forEach((c) => {
    //       if (c.id !== connection.id) {
    //         c.ws.send(data);
    //       }
    //     });
    //   });

      ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'joinRoom') {
            connection.code = msg.code;
            connection.name = msg.name;
            // Store code and name in the connection object
            console.log(`User ${connection.name} wants to join room with code: ${connection.code}`);
            const connections = games.get(msg.code).connections;
            connections[msg.name] = connection;

            Object.values(connections).forEach( connection => {
                const message = { type: 'updatePlayers', players: games.get(msg.code).players };
                connection.ws.send(JSON.stringify(message));
            })
            
            // Handle room joining logic, if needed
        } else if (msg.type == 'leaveRoom'){
            delete games.get(msg.code).connections[msg.name];
            if (!msg.startGame){
              games.get(msg.code).players =games.get(msg.code).players.filter(player => player != msg.name);
            } 
            const connections = games.get(msg.code).connections;
            // console.log(games.get(msg.code).connections);
            // console.log(games.get(msg.code).players);

            Object.values(connections).forEach( connection => {
                const message = { type: 'updatePlayers', players: games.get(msg.code).players };
                connection.ws.send(JSON.stringify(message));
            })
        } else if (msg.type == 'loadRoom'){

          const code = msg.code;
          games.get(code).generateOddOneOutIndex();
          games.get(code).readyToStartGame = true;

            const connections = games.get(msg.code).connections;

            Object.values(connections).forEach( connection => {
                const message = { type: 'Game Started' };
                // const message2 = { type: 'updatePlayers', players: games.get(msg.code).players };
                connection.ws.send(JSON.stringify(message));
                // connection.ws.send(JSON.stringify(message2));

            })
        } else if (msg.type == "Get Secret Word"){
          const code = msg.code;
          const name = msg.name;
          // console.log(games.get(code).oddOneOutIndex);
          if( games.get(code).readyToStartGame == true){
            // console.log(games.get(code).players[games.get(code).oddOneOutIndex])
            if (games.get(code).players[games.get(code).oddOneOutIndex] == name){
              // console.log(games.get(code).oddWord);
              
              const message = { type: 'Recieve Secret Word', secretWord: games.get(code).oddWord };
              connection.ws.send(JSON.stringify(message));
            } else {
              // console.log(games.get(code).groupWord)

              const message = { type: 'Recieve Secret Word', secretWord: games.get(code).groupWord };
              connection.ws.send(JSON.stringify(message));
            }
          }
        } else if(msg.type == "Submit Vote"){
          const winners = updateVotes(msg, games);
          // console.log(winners);
          // console.log(games.get(msg.code).gameOver);

          if (winners != null){
          jsonObj = {type: "Verdict", winners: winners, gameOver: games.get(msg.code).gameOver}
          // console.log(jsonObj)


          const connections = games.get(msg.code).connections;

          Object.values(connections).forEach( connection => {
              // const message2 = { type: 'updatePlayers', players: games.get(msg.code).players };
              connection.ws.send(JSON.stringify(jsonObj));
              // connection.ws.send(JSON.stringify(message2));
          })
        }
        }

    });
  
      // Remove the closed connection so we don't try to forward anymore
      ws.on('close', () => {
        const pos = connections.findIndex((o, i) => o.id === connection.id);
  
        if (pos >= 0) {
          connections.splice(pos, 1);
        }
      });
  
      // Respond to pong messages by marking the connection alive
      ws.on('pong', () => {
        connection.alive = true;
      });
    });
  
    // Keep active connections alive
    setInterval(() => {
      connections.forEach((c) => {
        // Kill any connection that didn't respond to the ping last time
        if (!c.alive) {
          c.ws.terminate();
        } else {
          c.alive = false;
          c.ws.ping();
        }
      });
    }, 10000);
    return connections;

  }






  function updateVotes(msg, games){
    let winners = null;
    const voter = msg.voter;
    const vote = msg.vote;
    const code = msg.code;
    games.get(code).votes.set(voter, vote);
    // console.log(games.get(code).votes);
    if (games.get(code).players.length == games.get(code).votes.size){
      winners = readTheVotes(code, games);
      for (const winner of winners) {
        if (games.get(code).players[games.get(code).oddOneOutIndex] == winner) { 
          games.get(code).gameOver = true; 
        } else {
          const oddOneOut = games.get(code).players[games.get(code).oddOneOutIndex]
          games.get(code).players = games.get(code).players.filter(value => value !== winner);
          games.get(code).votes = new Map();
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


  function readTheVotes(code, games) {
    // Create an object to store the count of each voted player
    const voteCounts = {};

    // Iterate through the values of the map and count the votes for each player
    for (const votedPlayer of games.get(code).votes.values()) {
        if (voteCounts[votedPlayer]) {
            voteCounts[votedPlayer]++;
        } else {
            voteCounts[votedPlayer] = 1;
        }
    }

    // Find the maximum count
    const maxCount = Math.max(...Object.values(voteCounts));

    // Find all players with the maximum count
    const highestVotedPlayers = [];
    for (const [player, count] of Object.entries(voteCounts)) {
        if (count === maxCount) {
            highestVotedPlayers.push(player);
        }
    }

    return highestVotedPlayers;
}



  
  module.exports = { peerProxy };
  




// function peerProxy(httpServer, games) {
//   // Create a websocket object
//   const wss = new WebSocketServer({ noServer: true });

//   // Handle the protocol upgrade from HTTP to WebSocket
//   httpServer.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, function done(ws) {
//       wss.emit('connection', ws, request);
//     });
//   });

//   // Keep track of all the connections so we can forward messages
// //   let connections = [];

//   wss.on('connection', (ws) => {
//     const connection = { id: uuid.v4(), alive: true, ws: ws};
//     // connections.push(connection);

//     // Forward messages to everyone except the sender
//     ws.on('message', function message(data) {
//       games.get(connection.code).sessions.forEach((c) => {
//         if (c.id !== connection.id) {
//           c.ws.send(data);
//         }
//       });
//     });

//     // Handle 'joinRoom' event
//     ws.on('message', (data) => {
//         const msg = JSON.parse(data);
//         if (msg.type === 'joinRoom') {
//             const { code, name } = msg;
//             // Store code and name in the connection object
//             connection.code = code;
//             connection.name = name;
//             console.log(`User ${name} wants to join room with code: ${code}`);
//             // Handle room joining logic, if needed
//         }
//     });

//     // socket.on('joinRoom', (code, name) => {
//     //     games.get(code).connection[name] = connection;
//     //     // Handle the 'joinRoom' event here
//     //     console.log(`User wants to join room with code: ${code}`);
//     // });

//     // Remove the closed connection so we don't try to forward anymore
//     ws.on('close', () => {
//       const pos = games.get(connection.code).connections.findIndex((o, i) => o.id === connection.id);

//       if (pos >= 0) {
//         games.get(connection.coede).connections.splice(pos, 1);
//       }
//     });

//     // Respond to pong messages by marking the connection alive
//     ws.on('pong', () => {
//       connection.alive = true;
//     });
//   });

//   // Keep active connections alive
//   setInterval(() => {
//     // Iterate through each object in the Map
//     games.forEach((game, code) => {
//         console.log(`Game Room Code: ${code}`);

//         // Iterate through each connection in the 'connections' variable of the current object
//         Object.keys(game.connections).forEach((name) => {
//             const connection = game.connections[name];
//             // Kill any connection that didn't respond to the ping last time
//             if (!connection.alive) {
//                 connection.ws.terminate();
//             } else {
//                 connection.alive = false;
//                 connection.ws.ping();
//             }
//         });
//     });
// }, 10000);
//     return { wss, connections };
// }

// module.exports = { peerProxy };
