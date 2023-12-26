const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

app.listen(8080, function () {
  console.log('listening on 8080')
});

app.use(express.json());
var cors = require('cors');
app.use(cors());


app.use(express.static(path.join(__dirname, 'workEnv/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/workEnv/build/index.html'));
});

app.get('/api/msdscheck', function (req, res) {
  axios.get(`http://msds.kosha.or.kr/openapi/service/msdschem/chemlist?searchCnd=1&searchWrd=7440-02-0 &ServiceKey=55ZJREry%2F8ZdOgvqUoqSXswHErF9CHyH73gBMzQUTPJi4g88rctbqWRZLCcY%2FoJ32QdEuLiY6tpdRKc6vllvEQ%3D%3D`)
    .then(response => {
      // Handle the response data as needed
      console.log(response.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
});


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/workEnv/build/index.html'));
});