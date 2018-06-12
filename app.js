var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server,{})

app.get('/', function(req, res) {
  res.sendFile('/home/borra/g75/redirector/redirector/index.html')
})

app.use('../redirector', express.static('/home/borra/g75/redirector/redirector'))

server.listen(process.env.PORT || 2000)

var animationX = [0, 20, 40, 60, 80, 100, 120, 140, 160]

var animationY = [0, 28, 56, 84]

var spawn = [256, 1024]



var Entity = function(){
  var self = {
    x:200,
    y:100,
    spdX:0,
    spdY:0,
    id:0,
    center: 0
  }
  self.update = function(){
    self.updatePosition()
  }
  self.updatePosition = function(){
    self.x += self.spdX
    self.y += self.spdY

  }
  self.getDistance = function(pt) {
    return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2))
  }
  return self
}


var Player = function(id, player) {
  var self = Entity()
    self.id = id
    self.gameId = player.gameId
    self.x = spawn[player.number]
    self.name = player.name
    self.animationXNum = 6
    self.animationYNum = 1
    self.color = player.color
    self.pressingRight = false
    self.pressingLeft = false
    self.pressingUp = false
    self.pressingDown = false
    self.pressingAttack = false
    self.mouseAngle = 0
    self.maxSpd = 7
    self.center = {
      x:(self.x + 20) ,
      y:(self.y + 20)
    }
    self.cursor = {
      x: 0,
      y: 0
    }
    self.shooting = true
    self.sheildHp = 100
    self.hp = 100
    self.toRemove = false

    var super_update = self.update
    self.update = function(){
      self.center.x += self.spdX
      self.center.y += self.spdY
      self.updateSpd()
      self.maxSpd = 7
        self.sheildHp ++
        if (self.spdX === 0 && self.spdY === 0){
          self.animationYNum = 1
          self.animationXNum = 6
        }else if (self.spdY < 0) {
          self.animationYNum = 0
          if (self.animationXNum < 8) {
            self.animationXNum = self.animationXNum + .12
          }else {
            self.animationXNum = 0
          }
        }else if (self.spdY > 0) {
          self.animationYNum = 1
          if (self.animationXNum < 8) {
            self.animationXNum = self.animationXNum + .12
          }else {
            self.animationXNum = 0
          }
        }else if (self.spdX < 0) {
          self.animationYNum = 2
          if (self.animationXNum < 8) {
            self.animationXNum = self.animationXNum + .12
          }else {
            self.animationXNum = 0
          }
        }else if (self.spdX > 0) {
          self.animationYNum = 3
          if (self.animationXNum < 8) {
            self.animationXNum = self.animationXNum + .12
          }else {
            self.animationXNum = 0
          }
        }

        if (self.hp > 100) {
          self.hp = 100
        }
        if (self.sheildHp > 99) {
          self.sheildHp = 100
        }
        if (self.sheildHp < 0){
          self.sheildHp = 0
        }
        if(self.dashing === true && self.sheildHp > 30){
          self.maxSpd = self.maxSpd * 21
          self.dashing = false
          self.sheildHp = self.sheildHp -50
        }
        if (self.center.x < 30 && self.pressingLeft === true) {
          self.spdX = 0
        }
        if(self.center.x > 1250 && self.pressingRight === true){
          self.spdX = 0
        }
        if(self.center.y < 42 && self.pressingUp === true){
          self.spdY = 0
        }
        if(self.center.y > 608 && self.pressingDown === true){
          self.spdY = 0
        }
        for (var i in Bullet.list) {
          var b = Bullet.list[i]
          if(self.getDistance(b) < 32 && Bullet.list[i].parent !== self.id){
            if (self.shooting === false) {
              self.hp = self.hp + 5
            }else if (self.shooting === true) {
              self.hp = self.hp -10

            }
          }
        }
        if(self.hp <= 0){
          self.toRemove = true
        }
        if(self.pressingAttack === true && self.shooting === true && self.sheildHp > 30){
          self.mouseAngle = Math.atan2((self.cursor.y - self.center.y), (self.cursor.x - self.center.x)) / Math.PI * 180
          self.shootBullet(self.mouseAngle)
          self.pressingAttack = false
          self.sheildHp = self.sheildHp -30
        }
        if (self.pressingSpecial) {

          self.makeSheild()
          self.shooting = false
          self.sheildHp = self.sheildHp - 3
          self.maxSpd = 0

        }else if (self.pressingSpecial === false) {
          self.shooting = true

        }

        super_update()

    }

    self.makeSheild = function() {
      if (self.sheildHp > 10) {
        var sh = Sheild(self.id, self.sheildHp, self.color)
        sh.x = self.x
        sh.y = self.y

      }
    }

    self.shootBullet = function(angle) {
      var b = Bullet(self.id, angle, self.color)
      b.x = self.x
      b.y = self.y
    }

  self.updateSpd = function(){
    if(self.pressingRight){
      self.spdX = self.maxSpd
    }else if (self.pressingLeft) {
      self.spdX = -self.maxSpd
    }
    else
      self.spdX = 0

    if(self.pressingUp){
      self.spdY = -self.maxSpd
    }else if (self.pressingDown) {
      self.spdY = self.maxSpd
    }
    else{
      self.spdY = 0
    }
  }
  Player.list[id]=self
  return self
}

Player.list = {}

Player.onConnect = function(socket) {
  var player = Player(socket.id, socket.player)
  socket.on('keyPress', function(data) {
    if(data.inputId === 'left')
      player.pressingLeft = data.state
    else if(data.inputId === 'right')
      player.pressingRight = data.state
    else if(data.inputId === 'up')
      player.pressingUp = data.state
    else if(data.inputId === 'down')
      player.pressingDown = data.state
    else if(data.inputId === 'dash')
      player.dashing = data.state
    else if (data.inputId === "special"){
      player.pressingSpecial = data.state
      player.cursor.x = data.x
      player.cursor.y = data.y
    }
    else if (data.inputId === 'attack'){
      player.pressingAttack = data.state
      player.cursor.x = data.x
      player.cursor.y = data.y
    }
    else if (data.inputId === 'mouseAngle')
      player.mouseAngle = data.state
      player.cursor.x = data.x
      player.cursor.y = data.y
  })
}

Player.onDisconnect = function(id){
  delete Player.list[id]
}

Player.update = function () {
  var pack = []
  for (var i in Player.list){
    var player = Player.list[i]
    player.update()
      pack.push({
        gameId:player.gameId,
        name:player.name,
        x:player.x,
        y:player.y,
        color:player.color,
        center:player.center,
        sheild:player.sheildHp,
        hp:player.hp,
        winState:player.toRemove,
        aniX:animationX[Math.round(player.animationXNum)],
        aniY:animationY[player.animationYNum]
      })


  }
  return pack
}

var Bullet = function(parent, angle, color) {
  var self = Entity()
  self.id = Math.random()
  self.spdX = Math.cos(angle/180*Math.PI) * 15
  self.spdY = Math.sin(angle/180*Math.PI) * 15
  self.parent = parent
  self.timer = 0
  self.color = color
  self.toRemove = false
  var super_update = self.update
  self.update = function() {
    for (var i in Player.list) {
      var p = Player.list[i]
      if(self.getDistance(p) < 32 && self.parent !== p.id){
        self.toRemove = true
      }
    }

    if (self.timer++ > 40) {
      self.toRemove = true
    }
    super_update()
  }
  Bullet.list[self.id] = self
  return self
}

Bullet.list = {}

Bullet.update = function () {


  var pack = []
  for (var i in Bullet.list){
    var bullet = Bullet.list[i]
    bullet.update()
    if (bullet.toRemove == true) {
      delete Bullet.list[i]
    }﻿else{
      pack.push({
        x:bullet.x + 20,
        y:bullet.y + 20,
        color: bullet.color
      })
  }
  }
  return pack
}

var Sheild = function(parent, hp, color) {
  var self = Entity()
  self.id = parent
  self.toRemove = false
  self.timer = 0
  self.parent = parent
  self.hp = hp
  self.color = color
  var super_update = self.update
  self.update = function() {


    if (self.hp < 1) {
      self.toRemove = true
    }
    if (self.timer++ > 1) {
      self.toRemove = true
    }
    super_update()
  }
  Sheild.list[self.id] = self
  return self
}

Sheild.list = {}

Sheild.update = function () {


  var pack = []
  for (var i in Sheild.list){
    var sheild = Sheild.list[i]
    sheild.update()
    if (sheild.toRemove == true) {
      delete Sheild.list[i]
    }﻿else{
      pack.push({
        x:sheild.x,
        y:sheild.y,
        color:sheild.color
      })
  }
  }
  return pack
}

var SOCKET_LIST = {}
var SERVER_LIST = [[],[]]



var number = 0
io.sockets.on('connection', function(socket){
    socket.on('createPlayer', function(data) {
      socket.player = data.player
      socket.id = Math.random() * 10000000000000000
      socket.player.number = number
      SERVER_LIST[data.player.gameId].push(socket)
      // console.log(SERVER_LIST[data.player.gameId].socket);
      SOCKET_LIST[socket.id] = socket
      Player.onConnect(socket)
      if (number === 0) {
        number ++
      }else if (number >= 1) {
        number = 0
      }
    })


  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id]
    Player.onDisconnect(socket.id)
    SERVER_LIST[socket.player.gameId].splice(socket.player.number, 1)
    // console.log(SERVER_LIST);
  })
})

setInterval(function() {
  var pack = {
    player:Player.update(),
    bullet:Bullet.update(),
    sheild:Sheild.update()
  }

  for (var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i]
    socket.emit('newPostions',pack)
  }
},1000/60)
