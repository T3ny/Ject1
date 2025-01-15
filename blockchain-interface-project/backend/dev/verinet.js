const express = require("express");
const app = express();
const cors = require("cors");
const uuid = require("uuid");
const Blockchain = require("./blockchain");
const Ncoin = new Blockchain();
const nodeAddress = uuid.v1().split("-").join("");
const port = process.argv[2];
console.log((a = process.argv));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// GET /blockchain
app.get("/blockchain", function (req, res) {
  res.send(Ncoin);
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

// POST /transaction
app.post("/transaction", function (req, res) {
  const blockIndex = JSON.stringify(
    Ncoin.createNewTransaction(
      req.body.amount,
      req.body.sender,
      req.body.recipient
    )
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

// GET /mine
app.get("/mine", function (req, res) {
  const lastBlock = Ncoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: Ncoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = Ncoin.proofOfWork(
    previousBlockHash,
    currentBlockData
  );
  const blockHash = Ncoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = Ncoin.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );
  Ncoin.createNewTransaction(12.5, "00", nodeAddress);
  res.json({
    note: "New block mined successfully",
    block: newBlock,
  });
});

// register a node and broadcast it to the network
app.post("/register-and-broadcast", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (Ncoin.networkNodes.indexOf(newNodeUrl) == -1) {
    Ncoin.networkNodes.push(newNodeUrl);
  }
  const regNodesPromises = [];
  Ncoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      url: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        url: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [
            Ncoin.networkNodes,
            Ncoin.currentNodeUrl,
          ],
        },
        json: true,
      };
      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "new node registered with network successfully" });
    });
});

// register a node with the network
app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent =
  Ncoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = Ncoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) {
    Ncoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: "New node registered successfully" });
});

// register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
    Ncoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = Ncoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
        Ncoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: "Bulk registration successful" });
});

// Start the server on port 3000
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
