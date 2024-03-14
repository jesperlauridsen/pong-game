document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("mainstage")
  let context = canvas.getContext("2d")
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight

  /*
   *  TODO
   *  - Fix so slidezone bars width and placement follow the canvas sizes.
   *  - Fix initial ballspeed to be relative to canvas-size
   *  - Fix ball-size when calculating hit on bounce-bar
   *  - Fix so that middle is not interactable on the canvas-touch. Maybe - 50px each side.
   */

  //variables

  let ballSize = 50
  let ballArray = []
  let controllers = []
  let rocketArray = []
  let timeControler = new Date()
  let gamemode = "beginner"
  let level = 1
  let ballCount = 5
  let winnerCount = 10
  let pause = false
  let score = {
    leftSide: 0,
    rightSide: 0,
  }
  let blockSize = 15
  let blockNumber = 7
  let faceImages = []

  faces.forEach((face, index) => {
    let faceImage = new Image()
    faceImage.src = "ballImages/" + face + ".png"
    faceImage.face = face
    faceImages.push(faceImage)
  })
  function creatController(id, side) {
    let controller = {
      id: id,
      blocks: [],
      side: side,
    }
    for (let i = 0; i < blockNumber; i++) {
      if (i === 0) {
        angleMisdirect = side === "left" ? -45 : 45
      } else if (i === 1) {
        angleMisdirect = side === "left" ? -30 : 30
      } else if (i === 2) {
        angleMisdirect = side === "left" ? -15 : 15
      } else if (i === 3) {
        angleMisdirect = 0
      } else if (i === 4) {
        angleMisdirect = side === "left" ? 15 : -15
      } else if (i === 5) {
        angleMisdirect = side === "left" ? 30 : -30
      } else if (i === 6) {
        angleMisdirect = side === "left" ? 45 : -45
        0
      }
      let block = {
        number: i,
        direct: angleMisdirect,
        lastHit: "unknown",
        hit: false,
        blockSize: blockSize,
        x: side === "left" ? 75 : canvas.width - 80,
        y: canvas.height / 2 - (blockNumber * blockSize) / 2 + i * blockSize,
      }
      controller.blocks.push(block)
    }
    controllers.push(controller)
  }

  function createBall(size, direction, x, y) {
    let ball = {
      size: size,
      x: x,
      y: y,
      direction: direction === null ? (Math.random() > 0.5 ? Math.random() * 30 - 15 + 90 : Math.random() * 30 - 15 + 270) : direction,
      speed: 0,
      maxSpeed: 15,
      hitcount: 0,
      releaseCount: 0,
      lastHit: null,
      sizeX: 0,
      sizeY: 0,
      face: faces[Math.floor(Math.random() * (faces.length - 1))],
    }
    ballArray.push(ball)
  }

  creatController(1, "left")
  creatController(2, "right")
  createBall(ballSize, null, canvas.width / 2, canvas.height / 2)

  let TO_RADIANS = Math.PI / 180
  let main = function () {
    update()
    render()
    requestAnimationFrame(main)
  }
  function update() {
    if (pause === false) {
      timeControler = new Date()
      ballArray.forEach((ball, index) => {
        checkBallPosition(ball, index)
        checkBallCollision(ball)
        ball.x -= ball.speed * Math.sin(ball.direction * TO_RADIANS)
        ball.y += ball.speed * Math.cos(ball.direction * TO_RADIANS)
      })
    }
  }
  function render() {
    if (pause === false) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (u = 0; u < rocketArray.length; u++) {
        if (rocketArray[u].done === "no") {
          rocketFlightPath(rocketArray[u], timeControler, rocketArray)
        } else {
          rocketArray.splice(u, 1)
        }
      }
      context.globalCompositeOperation = "lighter"
      for (let i = 0; i < controllers.length; i++) {
        drawController(controllers[i])
      }
      for (let x = 0; x < ballArray.length; x++) {
        drawBall(ballArray[x])
      }
    }
  }

  function checkBallCollision(ball) {
    controllers.forEach((controller) => {
      controller.blocks.forEach((block) => {
        if (controller.side === "left") {
          //console.log(controller.side,Math.sqrt( Math.pow((ball.x-block.x), 2) + Math.pow((ball.y-block.y), 2) ))
        }
        if (Math.sqrt(Math.pow(ball.x - block.x, 2) + Math.pow(ball.y - block.y, 2)) < ball.size / 2 && ball.lastHit !== controller.side) {
          //console.log(block.number, block.direct);
          ball.lastHit = controller.side
          ball.direction = controller.side === "right" ? 90 + block.direct : 270 + block.direct
          ball.hitcount++
          ball.releaseCount++
          if (ball.releaseCount > ballCount) {
            let angle = controller.side === "right" ? 270 : 90
            createBall(ballSize, Math.random() * 30 - 15 + angle, canvas.width / 2, canvas.height / 2)
            ball.releaseCount = 0
          }
          ball.speed = ball.speed + 1
          //ball.direction = controller.side === 'right' ? 90 + block.direct : 270 + block.direct;
        }
      })
    })
  }

  function checkBallPosition(ball, index) {
    if (ball.sizeX < ball.size) {
      ball.sizeX += 5
      ball.sizeY += 5
    }
    if (ball.speed < ball.maxSpeed) {
      ball.speed += 0.1
    }
    if (ball.y > canvas.height - ball.size / 2) {
      if (ball.direction > 180) {
        let difference = 90 - (180 - ball.direction) * -1
        ball.direction = 270 + difference
      } else if (ball.direction < 180) {
        let difference = (90 - ball.direction) * -1
        ball.direction = 90 - difference
      }
    } else if (ball.y < 0 + ball.size / 2) {
      if (ball.direction > 180) {
        let difference = 90 - (180 - ball.direction) * -1
        ball.direction = 270 + difference
      } else if (ball.direction < 180) {
        let difference = (90 - ball.direction) * -1
        ball.direction = 90 - difference
      }
    } else if (ball.x < 0 + ball.size / 2) {
      score.rightSide += 1
      if (score.rightSide >= winnerCount) {
        setWinner()
        ballArray = []
      }
      document.getElementById("rightSideScore").innerHTML = score.rightSide
      ballArray.splice(index, 1)
      document.getElementById("scoreb").className = "scoreboard highlight"
      setTimeout(function () {
        document.getElementById("scoreb").className = "scoreboard"
      }, 3000)
      setTimeout(function () {
        ballArray.length < level && score.leftSide < winnerCount && score.rightSide < winnerCount
          ? createBall(ballSize, Math.random() * 30 - 15 + 270, canvas.width / 2, canvas.height / 2)
          : null
      }, 3500)
      for (let k = 0; k < 5; k++) {
        setTimeout(function () {
          //launchRandomRocket(rocketArray, timeControler, canvas.height / 2, (canvas.width / 4) * 3)
        }, Math.random() * 1000)
      }
    } else if (ball.x > canvas.width - ball.size / 2) {
      score.leftSide += 1
      if (score.leftSide >= winnerCount) {
        setWinner()
        ballArray = []
      }
      document.getElementById("leftSideScore").innerHTML = score.leftSide
      ballArray.splice(index, 1)
      document.getElementById("scoreb").className = "scoreboard highlight"
      setTimeout(function () {
        document.getElementById("scoreb").className = "scoreboard"
      }, 3000)
      setTimeout(function () {
        ballArray.length < level && score.leftSide < winnerCount && score.rightSide < winnerCount
          ? createBall(ballSize, Math.random() * 30 - 15 + 90, canvas.width / 2, canvas.height / 2)
          : null
      }, 1000)
      for (let k = 0; k < 5; k++) {
        setTimeout(function () {
          //launchRandomRocket(rocketArray, timeControler, canvas.height / 2, canvas.width / 4)
        }, Math.random() * 2500)
      }
    }
  }

  function drawController(controller) {
    context.beginPath()
    for (let i = 0; i < controller.blocks.length; i++) {
      if (controller.blocks[i].hit === false) {
        context.rect(controller.blocks[i].x, controller.blocks[i].y, 5, controller.blocks[i].blockSize)
        context.fillStyle = "black"
        context.strokeStyle = "black"
        context.shadowColor = "black"
        context.shadowBlur = 5
        context.shadowOffsetX = 0
        context.shadowOffsetY = 0
      }
    }
    context.stroke()
    context.fill()
  }

  function drawBall(ball) {
    //console.log(ball.face)
    context.drawImage(
      faceImages.find(function (element) {
        return element.face === ball.face
      }),
      ball.x - ball.sizeX / 2,
      ball.y - ball.sizeY / 2,
      ball.sizeX,
      ball.sizeY
    )
    //context.beginPath();
    //context.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
    //context.stroke();
  }

  function barMoves(e) {
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].clientX < canvas.width / 2) {
        controllers.forEach((item, index) => {
          item.side === "left"
            ? item.blocks.forEach((block, number) => {
                block.y = e.touches[i].clientY - (item.blocks.length * block.blockSize) / 2 + number * block.blockSize
              })
            : null
        })
      } else {
        controllers.forEach((item, index) => {
          item.side === "right"
            ? item.blocks.forEach((block, number) => {
                block.y = e.touches[i].clientY - (item.blocks.length * block.blockSize) / 2 + number * block.blockSize
              })
            : null
        })
      }
    }
  }

  function barMovesMouse(e) {
    if (e.clientX < canvas.width / 2) {
      controllers.forEach((item, index) => {
        item.side === "left"
          ? item.blocks.forEach((block, number) => {
              block.y = e.clientY - (item.blocks.length * block.blockSize) / 2 + number * block.blockSize
            })
          : null
      })
    } else {
      controllers.forEach((item, index) => {
        item.side === "right"
          ? item.blocks.forEach((block, number) => {
              block.y = e.clientY - (item.blocks.length * block.blockSize) / 2 + number * block.blockSize
            })
          : null
      })
    }
  }

  function setGamemode(skill) {
    if (skill === "beginner") {
      gamemode = "beginner"
      level = 1
      ballCount = 5
    } else if (skill === "advanced") {
      gamemode = "advanced"
      level = 5
      ballCount = 3
    } else if (skill === "hardcore") {
      gamemode = "hardcore"
      level = 10
      ballCount = 1
    }
    resetGame()
  }

  function resetGame() {
    if (score.leftSide !== 0 || score.rightSide !== 0 || ballArray.length !== 0 || rocketArray !== 0) {
      ballArray = []
      rocketArray = []
      score.leftSide = 0
      score.rightSide = 0
      document.getElementById("leftSideScore").innerHTML = score.leftSide
      document.getElementById("rightSideScore").innerHTML = score.rightSide
      setTimeout(function () {
        createBall(ballSize, Math.random() * 30 - 15 + 90, canvas.width / 2, canvas.height / 2)
      }, 1000)
      document.getElementById("menu").className = ""
      pause = false
      document.getElementById("goleft").className = "gameover"
      document.getElementById("goright").className = "gameover"
      document.getElementById("newGame").className = ""
    }
  }

  function setWinner() {
    if (score.leftSide > score.rightSide) {
      document.getElementById("goleft").innerHTML = score.leftSide + "<br><span class='emoji'>🥳</span><br>WINNER"
      document.getElementById("goright").innerHTML = score.rightSide + "<br><span class='emoji'>🥵</span><br>LOSER"
      for (let k = 0; k < 15; k++) {
        setTimeout(function () {
          //launchRandomRocket(rocketArray, timeControler, canvas.height / 2, canvas.width / 4)
        }, Math.random() * 500)
      }
    } else if (score.rightSide > score.leftSide) {
      document.getElementById("goleft").innerHTML = score.leftSide + "<br><span class='emoji'>🥵</span><br>LOSER"
      document.getElementById("goright").innerHTML = score.rightSide + "<br><span class='emoji'>🥳</span><br>WINNER"
      for (let k = 0; k < 15; k++) {
        setTimeout(function () {
          //launchRandomRocket(rocketArray, timeControler, canvas.height / 2, (canvas.width / 4) * 3)
        }, Math.random() * 500)
      }
    } else {
      document.getElementById("goleft").innerHTML = score.leftSide + "<br><span class='emoji'>🥴</span><br>DRAW"
      document.getElementById("goright").innerHTML = score.rightSide + "<br><span class='emoji'>🥴</span><br>DRAW"
      for (let k = 0; k < 15; k++) {
        setTimeout(function () {
          //launchRandomRocket(rocketArray, timeControler, canvas.height / 2, (canvas.width / 4) * 2)
        }, Math.random() * 500)
      }
    }
    document.getElementById("goleft").className = "gameover active"
    document.getElementById("goright").className = "gameover active"
    document.getElementById("newGame").className = "active"
  }

  function resizeBrowser() {
    let canvas = document.getElementById("mainstage")
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
  }

  let then = Date.now()
  main()

  // EventListeners
  // touch events
  window.addEventListener(
    "touchmove",
    function (e) {
      barMoves(e)
      e.preventDefault()
    },
    { passive: false }
  )

  window.addEventListener(
    "touchstart",
    function (e) {
      barMoves(e)
      e.preventDefault()
    },
    { passive: false }
  )

  document.getElementById("menu").addEventListener(
    "touchstart",
    function (e) {
      if (document.getElementById("menu").className === "highlight") {
        document.getElementById("menu").className = ""
        pause = false
      } else {
        document.getElementById("menu").className = "highlight"
        pause = true
      }
      //e.stopPropagation();
    },
    { passive: false }
  )

  document.getElementById("reset").addEventListener(
    "touchstart",
    function (e) {
      resetGame()
      e.stopPropagation()
    },
    { passive: false }
  )

  document.getElementById("gBeginner").addEventListener(
    "touchstart",
    function (e) {
      setGamemode("beginner")
      e.stopPropagation()
    },
    { passive: false }
  )
  document.getElementById("gAdvanced").addEventListener(
    "touchstart",
    function (e) {
      setGamemode("advanced")
      e.stopPropagation()
    },
    { passive: false }
  )
  document.getElementById("gHardcore").addEventListener(
    "touchstart",
    function (e) {
      setGamemode("hardcore")
      e.stopPropagation()
    },
    { passive: false }
  )

  document.getElementById("reset").addEventListener(
    "touchstart",
    function (e) {
      resetGame()
      e.stopPropagation()
    },
    { passive: false }
  )

  document.getElementById("newGame").addEventListener(
    "touchstart",
    function (e) {
      resetGame()
      e.stopPropagation()
    },
    { passive: false }
  )

  // Mouse events

  window.addEventListener(
    "mousemove",
    function (e) {
      barMovesMouse(e)
      e.preventDefault()
    },
    { passive: false }
  )
  window.addEventListener(
    "click",
    function (e) {
      if (pause == true) {
        document.getElementById("menu").className = ""
        pause = false
      }
      //launchRandomRocket(rocketArray, timeControler, e.clientY, e.clientX)
    },
    { passive: false }
  )

  document.getElementById("menu").addEventListener(
    "click",
    function (e) {
      if (document.getElementById("menu").className === "highlight") {
        document.getElementById("menu").className = ""
        pause = false
      } else {
        document.getElementById("menu").className = "highlight"
        pause = true
      }
      e.stopPropagation()
    },
    { passive: false }
  )

  document.getElementById("gBeginner").addEventListener(
    "click",
    function (e) {
      setGamemode("beginner")
      e.stopPropagation()
    },
    { passive: false }
  )
  document.getElementById("gAdvanced").addEventListener(
    "click",
    function (e) {
      setGamemode("advanced")
      e.stopPropagation()
    },
    { passive: false }
  )
  document.getElementById("gHardcore").addEventListener(
    "click",
    function (e) {
      setGamemode("hardcore")
      e.stopPropagation()
    },
    { passive: false }
  )

  document.getElementById("newGame").addEventListener(
    "click",
    function (e) {
      resetGame()
      e.stopPropagation()
    },
    { passive: false }
  )

  // Extra

  window.addEventListener("resize", resizeBrowser(), true)

  window.onmousemove = function (e) {
    document.getElementById("debug").innerHTML = "x: " + e.clientX + ", y: " + e.clientY
    //moveBars(e);
  }
})
