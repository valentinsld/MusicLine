//     CANVAS
////////////////////////////////////////////////////////////////////////////////////////////////
const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth - 4
canvas.height = window.innerHeight - 144

let ctx = canvas.getContext('2d')
let angle

let cursor = {
  hold: false,
  holdBall: false,
}
const debug = false

//     Init Synth
////////////////////////////////////////////////////////////////////////////////////////////////
Synth instanceof AudioSynth // true
var testInstance = new AudioSynth()
testInstance instanceof AudioSynth // true
testInstance === Synth // true

const colors = {
  // { letter: "D", number: 3 },
  color1: {
    color: 'rgb(52, 31, 151)',
    note: { letter: 'F', number: 3 },
  },
  color2: {
    color: 'rgb(46, 134, 222)',
    note: { letter: 'A', number: 3 },
  },
  color3: {
    color: 'rgb(1, 163, 164)',
    note: { letter: 'C', number: 4 },
  },
  color4: {
    color: 'rgb(238, 82, 83)',
    note: { letter: 'E', number: 4 },
  },
  color5: {
    color: 'rgb(255, 159, 67)',
    note: { letter: 'G', number: 4 },
  },
  color6: {
    color: 'rgb(243, 104, 224)',
    note: { letter: 'B', number: 4 },
  },
  color7: {
    color: 'rgb(10, 189, 227)',
    note: { letter: 'D', number: 5 },
  },
  // { letter: "F", number: 5 },
  // { letter: "E", number: 5 },
  // { letter: "c", number: 4 },
  // { letter: "c", number: 4 },
  // { letter: "c", number: 4 }
}
let selectNote = 'color1'

//     Functions Helps
////////////////////////////////////////////////////////////////////////////////////////////////
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  }
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
function sinusReduce(x) {
  //              Hauteur                            longueur
  return Math.exp(-1.2 * x) * Math.cos(2 * Math.PI * (1.4 * x - 0.25))
}
function playSound(note) {
  var piano = Synth.createInstrument('piano')
  piano.play(note.letter, note.number, 2) // plays C4 for 2s using the 'piano' sound profile
} 

//     Circle
////////////////////////////////////////////////////////////////////////////////////////////////
function circle(x, y, r) {
  this.x = x
  this.y = y
  this.r = r
  this.dx = 0
  this.dy = 0
  this.color = 'rgb(200, 214, 229)'
  this.moove = false
  this.time = 180

  this.draw = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  this.update = function () {
    if (this.x + this.r > canvas.width - 4 || this.x - this.r < 4) {
      this.dx = -this.dx
      playSound({ letter: 'C', number: 2 })
    }

    if (this.y + this.r > canvas.height - 4 || this.y - this.r < 4) {
      this.dy = -this.dy
      playSound({ letter: 'E', number: 2 })
    }

    const tt = easeOutCubic(this.time / 180)

    this.x += this.dx * tt
    this.y += this.dy * tt

    this.time -= 1

    if (this.time < 0) {
      this.time = 180
      this.moove = false
      this.dx = 0
      this.dy = 0
    }

    this.draw()
  }

  this.updateTouch = function () {
    this.draw()
  }

  this.draw()
}

//     LINE
////////////////////////////////////////////////////////////////////////////////////////////////
function line(x1, y1, x2, y2) {
  this.x1 = x1
  this.y1 = y1
  this.x2 = x2
  this.y2 = y2

  this.cx1 = 0
  this.cy1 = 0
  this.cx2 = 0
  this.cy2 = 0

  this.xx1 = this.x1 + (this.x2 - this.x1)*0.1
  this.yy1 = this.y1 + (this.y2 - this.y1)*0.1
  this.xx2 = this.x2 + (this.x1 - this.x2)*0.1
  this.yy2 = this.y2 + (this.y1 - this.y2)*0.1

  this.vx1 = (-.1*(this.y2 - this.y1))
  this.vy1 = (.1*(this.x2 - this.x1))
  this.vx2 = (.1*(this.y1 - this.y2))
  this.vy2 = (-.1*(this.x1 - this.x2))

  this.ballx = 0
  this.bally = 0

  this.anim = false
  this.time = 0
  this.sound = false

  this.color = selectNote

  this.draw = function () {
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.bezierCurveTo(
      this.xx1 + this.cx1,
      this.yy1 + this.cy1,
      this.xx2 + this.cx2,
      this.yy2 + this.cy2,
      this.x2,
      this.y2,
    )
    ctx.strokeStyle = colors[this.color].color
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()

    if (debug) {
      ctx.beginPath()
      ctx.arc(this.xx1 + this.cx1, this.yy1 + this.cy1, 3, 0, Math.PI * 2, false)
      ctx.arc(this.xx2 + this.cx2, this.yy2 + this.cy2, 3, 0, Math.PI * 2, false)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(this.xx1, this.yy1, 3, 0, Math.PI * 2, false)
      ctx.arc(this.xx2, this.yy2, 3, 0, Math.PI * 2, false)
      ctx.fillStyle = 'green'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(this.xx1 + this.vx1, this.yy1 + this.vy1, 3, 0, Math.PI * 2, false)
      ctx.arc(this.xx2 + this.vx2, this.yy2 + this.vy2, 3, 0, Math.PI * 2, false)
      ctx.fillStyle = 'yellow'
      ctx.fill()
    }
  }

  this.update = function () {
    if (
      this.isCircleSegmentColliding(
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        cc.x,
        cc.y,
        cc.r,
      )
    ) {
      if (!this.sound) {
        this.sound = true

        setTimeout(() => {
          this.sound = false
        }, 600)

        playSound(colors[this.color].note)

        this.anim = true

        this.ballx = cc.x
        this.bally = cc.y

        this.time = 0
      }
    }

    if (this.anim) {
      const tt = sinusReduce(this.time)

      this.cx1 = this.vx1 * tt
      this.cy1 = this.vy1 * tt
      this.cx2 = this.vx2 * tt
      this.cy2 = this.vy2 * tt

      // this.cx1 = 100 * tt
      // this.cx2 = 100 * tt

      this.time += 0.03

      if (this.time > 8) {
        this.time = 0
        this.anim = false
      }
    }
    this.draw()
  }

  this.isCircleSegmentColliding = function (x0, y0, x1, y1, cx, cy, cr) {
    // calc delta distance: source point to line start
    var dx = cx - x0
    var dy = cy - y0

    // calc delta distance: line start to end
    var dxx = x1 - x0
    var dyy = y1 - y0

    // Calc position on line normalized between 0.00 & 1.00
    // == dot product divided by delta line distances squared
    var t = (dx * dxx + dy * dyy) / (dxx * dxx + dyy * dyy)

    // calc nearest pt on line
    var x = x0 + dxx * t
    var y = y0 + dyy * t

    // clamp results to being on the segment
    if (t < 0) {
      x = x0
      y = y0
    }
    if (t > 1) {
      x = x1
      y = y1
    }

    return (cx - x) * (cx - x) + (cy - y) * (cy - y) < (cr+10) * (cr+10)
  }
}

//     LOOP
////////////////////////////////////////////////////////////////////////////////////////////////
const logo = document.querySelector('#logo')
function gameLoop() {
  ctx.fillStyle = 'rgba(34, 47, 62,0.8)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(logo, 24, 18, 286, 40)

  ll.forEach((e) => {
    e.update()
  })
  cc.update()

  if (cursor.holdBall && cursor.hold) {
    ctx.beginPath()
    ctx.moveTo(cc.x, cc.y)
    ctx.lineTo(cursor.pos.x, cursor.pos.y)
    ctx.setLineDash([1, 15])
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgb(200, 214, 229)'
    ctx.stroke()

    ctx.setLineDash([])
  } else if (cursor.hold) {
    ctx.beginPath()
    ctx.moveTo(cursor.click.x, cursor.click.y)
    ctx.lineTo(cursor.pos.x, cursor.pos.y)
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgb(200, 214, 229)'
    ctx.stroke()
  }

  window.requestAnimationFrame(gameLoop)
}
const cc = new circle(600, 450, 20)
let ll = [] // new line(800, 200, 1000, 600)

gameLoop()

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth - 4
  canvas.height = window.innerHeight - 144
})

//     EVENTS CURSOR
////////////////////////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousedown', function click(evt) {
  cursor.hold = true
  cursor.click = getMousePos(canvas, evt)
  // console.log("hold", cursor.click);

  cursor.holdBall = ctx.isPointInPath(evt.clientX, evt.clientY)
})
canvas.addEventListener('mouseup', clickHold)
canvas.addEventListener('mouseleave', clickHold)

function clickHold(evt) {
  if (cursor.hold && cursor.holdBall) {
    setTimeout(() => {
      cursor.hold = false
    }, 50)
    // console.log("nope");
    // console.log(cursor);
    cc.dx = (cc.x - cursor.pos.x) / 20
    cc.dy = (cc.y - cursor.pos.y) / 20

    // sound
    Synth.setVolume(0.05);
    playSound({ letter: 'C', number: 2 })
    setTimeout(() => {
      Synth.setVolume(1);
    }, 10);
  } else if (cursor.hold) {
    setTimeout(() => {
      cursor.hold = false
    }, 50)

    const lg = Math.sqrt(
      Math.pow(cursor.pos.x - cursor.click.x, 2) +
        Math.pow(cursor.pos.y - cursor.click.y, 2),
    )

    if (!(lg < 20 && lg > -20)) {
      ll.push(
        new line(cursor.click.x, cursor.click.y, cursor.pos.x, cursor.pos.y),
      )
    }
  }
}

canvas.addEventListener('mousemove', function (evt) {
  cursor.pos = getMousePos(canvas, evt)
})

//     EVENTS sound
////////////////////////////////////////////////////////////////////////////////////////////////

const colorsDom = document.querySelectorAll('.color')

colorsDom.forEach((c) => {
  c.addEventListener('click', function () {
    playSound(colors[this.id].note)
    selectNote = this.id

    const note = this.querySelector('svg')
    note.classList.add('anim-note')
    setTimeout(() => {
      note.classList.remove('anim-note')
    }, 600);
  })
})

//     Take screen
////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('#take-screen').addEventListener('click', function () {
  ;(() => {
    const canvas = document.querySelector('canvas')
    canvas.toBlob(
      (blob) => {
        const today = new Date()
        var title = `Img_${today.getDate()}-${
          today.getMonth() + 1
        }-${today.getFullYear()}_${today.getHours()}:${today.getMinutes()}`

        const formData = new FormData()
        formData.append('title', title)
        formData.append('experiment', blob, 'truc.jpg')

        fetch('/experiment', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json)

            window.open(`http://localhost:3001/experiment/${json.id}`, '_blank')
          })
      },
      'image/jpeg',
      0.95,
    )
  })()
})

//     Demo
////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('.btn').addEventListener('click', function () {
  const demo = document.querySelector('.demo')
  demo.classList.add('by')

  setTimeout(() => {
    demo.style.display = 'none'
  }, 800)

  //playsound
  playSound(colors.color2.note)
  setTimeout(() => {
    playSound(colors.color3.note)
  }, 300);
  setTimeout(() => {
    playSound(colors.color4.note)
  }, 600);
  setTimeout(() => {
    playSound(colors.color6.note)
  }, 1000);

})
