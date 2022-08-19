const canvas = document.querySelector(".canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.8;
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  4: {
    pressed: false,
  },
  6: {
    pressed: false,
  },
  8: {
    pressed: false,
  },
};

const player = new Fighter({
  position: {
    x: 250,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 156,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 130,
      y: 30,
    },
    width: 170,
    height: 70,
  },
});

const enemy = new Fighter({
  position: {
    x: 700,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -165,
      y: 50,
    },
    width: 170,
    height: 70,
  },
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 160,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.5,
  framesMax: 6,
});
c.fillRect(0, 0, canvas.width, canvas.height);

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.18)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player 1 movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -6;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 6;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //enemy movement
  if (keys[6].pressed && enemy.lastKey === "6") {
    enemy.velocity.x = 6;
    enemy.switchSprites("run");
  } else if (keys[4].pressed && enemy.lastKey === "4") {
    enemy.velocity.x = -6;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  //collision detect (player) && enemy gets hit
  if (
    rectCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking &&
    (player.framesCurrent === 3 || player.framesCurrent === 4)
  ) {
    enemy.takeHit(25);
    player.isAttacking = false;
    gsap.to(".enemy-health-left", {
      width: enemy.health + "%",
    });
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //collision detect (enemy)
  if (
    rectCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking &&
    (enemy.framesCurrent === 2 || enemy.framesCurrent === 3)
  ) {
    player.takeHit(20);
    enemy.isAttacking = false;
    gsap.to(".player-health-left", {
      width: player.health + "%",
    });
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 3) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (ev) => {
  if (!player.dead && !enemy.dead) {
    if (!player.dead) {
      switch (ev.key) {
        case "d":
          keys.d.pressed = true;
          player.lastKey = "d";
          break;
        case "a":
          keys.a.pressed = true;
          player.lastKey = "a";
          break;
        case "w":
          if (player.velocity.y == 0) {
            player.velocity.y = -20;
          }
          break;

        case "s":
          player.attack();
          break;
      }
    }
    if (!enemy.dead) {
      switch (ev.key) {
        case "6":
          keys[6].pressed = true;
          enemy.lastKey = "6";
          break;
        case "4":
          keys[4].pressed = true;
          enemy.lastKey = "4";
          break;
        case "8":
          if (enemy.velocity.y == 0) {
            enemy.velocity.y = -20;
          }
          break;
        case "5":
          enemy.attack();
          break;
      }
    }
  }
});
window.addEventListener("keyup", (ev) => {
  switch (ev.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    case "4":
      keys[4].pressed = false;
      break;
    case "6":
      keys[6].pressed = false;
      break;
    case "8":
      keys[8].pressed = false;
      break;
  }
});
let timer = 60;
let timerId;
function decreaseTimer(player, enemy) {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector(".timer").textContent = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
decreaseTimer();
