const fs = require('fs')
const express = require('express')
const EventEmitter = require('events')
const path = require('path');

const chatEmitter = new EventEmitter()
const port = process.env.PORT || 1337

const app = express()


app.get('/', redirect)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)
app.get('/chat', respondChat)
app.get('/sse', respondSSE)
app.get('*', redirect)

app.listen(port, () => console.log(`Server Listening on port ${port}`))

function redirect (req,res) {
    const fileName = `${__dirname}/public/chat.html`;
    fs.readFile(fileName, 'utf8', (err, content) => {
        if (err) {
          return respondNotFound(req, res);
        }    
    })
}

function respondText (req,res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hi');
}

function respondJson(req,res){
    res.json({ text: 'hi', numbers: [1, 2, 3] })
    } 

function respondEcho(req,res){
        const { input = '' } = req.query
        res.json({
            normal: input,
            shouty: input.toUpperCase(),
            characterCount: input.length,
            backwards: input
            .split('')
            .reverse()
            .join('')
        }); 
    }

    function respondStatic(req, res) {
        const fileName = `${__dirname}/public/${req.params[0]}`;
        const extension = path.extname(fileName).toLowerCase();
      
        let contentType = 'text/plain';
        if (extension === '.html') {
          contentType = 'text/html';
        } else if (extension === '.css') {
          contentType = 'text/css';
        } else if (extension === '.js') {
          contentType = 'application/javascript'; // Update the MIME type for JavaScript files
        } else if (extension === '.json') {
          contentType = 'application/json';
        }
      
        fs.readFile(fileName, 'utf8', (err, content) => {
          if (err) {
            return respondNotFound(req, res);
          }
      
          res.setHeader('Content-Type', contentType);
          res.writeHead(200);
          res.end(content);
        });
      }
      
      
      

function respondChat (req, res) {
    const {message,userName} = req.query;
    chatEmitter.emit('message', message,userName);
    res.end();
}

function respondSSE (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection' : 'keep-alive'
    });
    

    const onMessage = (msg,userName) => res.write(`data: ${msg},userName:${userName}\n\n`);
    chatEmitter.on('message', (msg,userName) => {
      console.log(msg,userName);
      const data = {};
      data.msg = msg;
      data.userName = userName;

      res.write(`data: ${data.msg}, userName: ${userName}\n\n`);
  });

    res.on('close', function() {
        chatEmitter.off('message', onMessage);
    })
    }

function respondNotFound (req,res) {
    res.writeHead(404, { 'Content-Type' : 'text/plain'});
    res.end('Not Found');
}