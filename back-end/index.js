const bodyParser = require("body-parser");
const { ethers, verifyMessage } = require("ethers");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

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
    try {
        const { address } = jwt.verify(auth, secret);
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });        
    }

    console.log({address});
});
    

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
