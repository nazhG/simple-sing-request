const bodyParser = require("body-parser");
const { ethers, verifyMessage } = require("ethers");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { exec } = require("node:child_process");
const fs = require("node:fs");

const PORT = process.env.PORT ?? 3001;

const secret = "secret";

const mockUsers = [
  {
    address: "0x71d27375B1D112c63391d72846B56513967FE93D",
    name: "user1",
  }
];

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  express.json();
  next();
});

app.use(cors());
app.use(bodyParser.json());

// app.post("/login", (req, res) => {
//   const { signature, address } = req.body;
//   const message = "Hello world";
//   console.log(signature, address, message);
//   console.log(verifyMessage);

//   const recoveredAddress = verifyMessage(message, signature);

//   if (recoveredAddress !== address) {
//     return res.status(401).json({ error: "Signature verification failed" });
//   }

//   const token = jwt.sign({ address }, secret, { expiresIn: "1h" });

//   res.json({ token });
// });

app.post("/deploy", (req, res) => {
    const { signature, address } = req.body;
    const message = "Hello world";
    console.log(signature, address, message);
    console.log(verifyMessage);
  
    const recoveredAddress = verifyMessage(message, signature);
  
    if (recoveredAddress !== address) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

  const filePath = "../smart-contracts/deployments.txt";
  
  const user = mockUsers.find((user) => user.address === address);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const newDeploy = `{ \"name\": \"${user.name}\" , \"address\": \"${user.address}\"}`;
  
  exec(
    `echo ${newDeploy} >> ${filePath} && git add ${filePath} && git commit -m "new deploy" && git push origin HEAD:deploy-V1 --force && git reset --hard origin/main`,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
    }
  );
});

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
