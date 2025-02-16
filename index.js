const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = new Set();

console.log('WebSocket Chat Server is running...');

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected!');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    broadcast(message, ws);
  });


  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

function broadcast(message, sender) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
