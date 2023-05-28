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
    x: 0,
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

  imageSrc: "./images/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },

  sprites: {
    idle: {
      imageSrc: "./images/samuraiMack/idle.png",
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
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },

  velocity: {
    x: 0,
    y: 20,
  },

  offset: {
    x: -50,
    y: 0,
  },

  color: "red",
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
  player.update();

  // enemy.update();

  player.velocity.x = 0;

  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 8;
    player.switchSprites("run");
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -8;
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
    enemy.velocity.x = -8;
  } else if (keys.arrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 8;
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    console.log("go");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = `${player.health}%`;
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
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
