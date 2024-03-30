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
            console.log(games)
            console.log(games.get(connection.code).connections)
            const connections = games.get(msg.code).connections;
            connections[msg.name] = connection;
            console.log(connections);

            Object.values(connections).forEach( connection => {
                const message = { type: 'addedPlayer', name: msg.name };
                connection.ws.send(JSON.stringify(message));
            })
            
            // Handle room joining logic, if needed
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
