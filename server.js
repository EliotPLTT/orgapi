import express from 'express';
import apiRSIRouter from './routes/apiRSI.js'; // chemin relatif et syntaxe ES6
import dbROUTER from './routes/apiDB.js'; // chemin relatif et syntaxe ES6

const app = express();
app.use(express.json());

app.use("/rsi", apiRSIRouter);
app.use("/db", dbROUTER);

app.use("/", (req, res) => {
  res.send('Cette page fonctionne');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
