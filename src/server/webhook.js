const http = require('http');
const { exec } = require('child_process');

const PORT = 3001; // Use a different port from the game server

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    console.log('Received GitHub webhook');

    // Pull latest changes and restart the game server
    exec('cd /var/www/io-game && git pull && npm install && pm2 restart all', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error updating: ${stderr}`);
        res.writeHead(500);
        res.end('Update failed');
        return;
      }
      console.log('STDOUT:', stdout);
      console.error('STDERR:', stderr);
      res.writeHead(200);
      res.end('Update successful');
    });

  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

server.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
