// Simple mock API server for frontend development
const http = require('http');

const PORT = 8000;

const services = [
  { id: '1', name: 'Манікюр класичний', duration_min: 60, price: 350 },
  { id: '2', name: 'Манікюр з покриттям', duration_min: 90, price: 450 },
  { id: '3', name: 'Педикюр', duration_min: 75, price: 500 },
  { id: '4', name: 'Зачіска вечірня', duration_min: 90, price: 600 },
  { id: '5', name: 'Укладка', duration_min: 45, price: 300 },
  { id: '6', name: 'Фарбування волосся', duration_min: 120, price: 800 },
];

const masters = [
  { id: '1', name: 'Олена', specialization: 'Манікюр' },
  { id: '2', name: 'Марія', specialization: 'Зачіски' },
  { id: '3', name: 'Анна', specialization: 'Косметолог' },
  { id: '4', name: 'Софія', specialization: 'Візажист' },
];

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  console.log(`${req.method} ${url.pathname}`);

  if (url.pathname === '/api/services' || url.pathname === '/api/services/') {
    res.writeHead(200);
    res.end(JSON.stringify(services));
  } else if (url.pathname === '/api/masters' || url.pathname === '/api/masters/') {
    res.writeHead(200);
    res.end(JSON.stringify(masters));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET http://localhost:${PORT}/api/services`);
  console.log(`  GET http://localhost:${PORT}/api/masters`);
});
