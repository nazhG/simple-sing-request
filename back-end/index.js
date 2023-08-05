const bodyParser = require("body-parser");
const { ethers, verifyMessage } = require("ethers");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { exec } = require('node:child_process');
const fs = require('node:fs');

const PORT = process.env.PORT ?? 3001;

const secret = "secret";

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  express.json();
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { signature, address } = req.body;
  const message = "Hello world";
    console.log(signature, address, message);
    console.log(verifyMessage);
    
    
  const recoveredAddress = verifyMessage(message, signature);

  if (recoveredAddress !== address) {
    return res.status(401).json({ error: "Signature verification failed" });
  }

  const token = jwt.sign({ address }, secret, { expiresIn: "1h" });

  res.json({ token });
});

app.post("/deploy", (req, res) => {
    const auth = req.headers.authorization.split(" ")[1];
    let address;
    // Verify token and get address
    try {
        const { address: _address } = jwt.verify(auth, secret);
        address = _address;
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });        
    }

    const filePath = "../smart-contracts/deployments.txt";
    /// TODO: implent DB
    // Add new address to deployments.txt
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: error.message });
        return;
      }
    
      const updatedContent = data + '\n' + `{ "name": "${ address }" , "address": ""}`;
    
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          res.status(500).json({ error: error.message });
          return;
        }
      });
    });
    
    // Push changes to git
    exec('git add . && git commit -m "new deploy" && git push origin HEAD:main --force ', (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error al ejecutar el comando git pull: ${error.message}`);
        return;
      }
      res.status(200).json({ message: "Repositorio actualizado con éxito."  });
      console.log('Repositorio actualizado con éxito.');
    });
});

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
