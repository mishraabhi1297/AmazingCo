const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/public')));

const products = [
    {id: 0, name: 'Kids Party', cost: 220, qty: 0, price: 0},
    {id: 1, name: 'Wine Tour', cost: 440, qty: 0, price: 0},
    {id: 2, name: 'Team Building', cost:800, qty: 0, price: 0},
    {id: 3, name: 'Picnic', cost:110, qty: 0, price: 0}
];

app.get('/app', function (req, res) {
    console.log(req);
    res.send(products);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
  });
  
  const port = process.env.PORT || 5000;
  //app.listen(port);
  
  app.listen(port, () => {
      console.log('Go to http://localhost:5000');
  });