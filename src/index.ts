import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('The server is up and running!');
});
app.listen({ port: 5000 }, () => {
  console.log(`Server is running at http://localhost:5000`);
});
