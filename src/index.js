const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/background.png",
});

const shop = new Sprite({
  position: {
    x: 640,
    y: 260,
  },
  imageSrc: "./images/shop.png",
  scale: 1.7,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 190,
    y: 0,
  },

  velocity: {
    x: 0,
    y: 10,
  },

  offset: {
    x: 0,
    y: 0,
  },

  imageSrc: "./images/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },

  sprites: {
    idle: {
      imageSrc: "./images/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./images/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./images/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./images/samuraiMack/Death.png",
      framesMax: 6,
    },
  },

  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 700,
    y: 50,
  },

  velocity: {
    x: 0,
    y: 20,
  },

  color: "red",
  imageSrc: "./images/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },

  sprites: {
    idle: {
      imageSrc: "./images/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./images/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./images/kenji/Death.png",
      framesMax: 7,
    },
  },

  attackBox: {
    offset: {
      x: -180,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  direction: 1,
});

const keys = {
  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  arrowRight: {
    pressed: false,
  },

  arrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;

  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 8;
    player.flip = 0;
    player.switchSprites("run");
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -8;
    player.flip = 1;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  enemy.velocity.x = 0;
  if (keys.arrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.flip = 0;
    enemy.velocity.x = -8;
    enemy.switchSprites("run");
  } else if (keys.arrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 8;
    enemy.flip = 1;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    // player.isAttacking = false;
    // document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
    enemy.isAttacking = false;
  }

  if (enemy.isAttacking && enemy.framesCurrent == 2) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.isBottom) {
          player.velocity.y -= 18;
        }
        break;

      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.arrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.arrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.isBottom) {
          enemy.velocity.y -= 18;
        }
        break;

      case "ArrowDown":
        enemy.attack();
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;

      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
  }
});
