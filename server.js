const app = require('express')();
const bodyParser = require('body-parser');

// const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
var serverList = [{
  accessCode: null,
  messages: [],
  userList: []
}];

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('addUser', (user, accessCode) => {
    console.log('add user', user, accessCode);

    setInterval(() => {
      const tempUserList = serverList.filter(entry => {
        return entry.accessCode === accessCode
      });
      if (tempUserList.length > 0) {
        tempUserList[0].userList.push(user);
        console.log(tempUserList);
        client.emit('updateUserList', tempUserList[0].userList);
      }
    }, 3000);
  });

  client.on('getServerList', (accessCode) => {
  console.log('client is updating the server list with interval ');

    setInterval(() => {
      const tempServer = serverList.filter(entry => {
        return entry.accessCode === accessCode
      });
      console.log(tempServer);
      if (tempServer.length > 0) {
        client.emit('getListEmit', tempServer[0]);
      }
    }, 1000);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/public/index.html');
});


app.get('/getList', (req, res) => {
  const accessCode = parseInt(req.query.code);
  const found = serverList.filter(entry => {
    return entry.accessCode === accessCode
  });
  if (found !== null && found.length > 0) {
    res.send(found);
  } else {
    res.send(serverList);
  }
});

app.post('/updateList', (req, res) => {
  const reqAccessCode = parseInt(req.body.accessCode);
  const reqMessages = req.body.messages;
  const reqUserList = req.body.userList || [];
  const found = serverList.filter(entry => entry.accessCode === reqAccessCode);
  // console.log(found);
  if (found !== null && found.length > 0) {
    found[0].messages = reqMessages;
  } else {
    const temp = {
      accessCode: reqAccessCode,
      messages: reqMessages,
      userList: reqUserList
    };
    serverList.push(temp);
  }
  res.send(serverList.find(entry => entry.accessCode === reqAccessCode));
});

http.listen(port, () => console.log(`Listening on port ${port}`));
