const board = document.querySelector("#board");
const colorsPots = ["redPot", "bluePot", "greenPot", "yellowPot"];
const drop = document.querySelector("#drop");
const ladder = document.querySelector("#ladder");
const snake = document.querySelector("#snake");
const diceAudio = document.querySelector("#diceAudio");
const success = document.querySelector("#success");
const modal = document.querySelector("#modal");
const wname = document.querySelector("#wname");
const wimg = document.querySelector("#wimg");
let ladders = [
  [4, 16, 17, 25],
  [21, 39],
  [29, 32, 33, 48, 53, 67, 74],
  [43, 57, 64, 76],
  [63, 62, 79, 80],
  [71, 89],
];
let snakes = [
  [30, 12, 13, 7],
  [47, 46, 36, 35, 27, 15],
  [56, 44, 38, 23, 19],
  [73, 69, 51],
  [82, 79, 62, 59, 42],
  [92, 88, 75],
  [98, 97, 83, 84, 85, 77, 64, 76, 65, 55],
]
const diceArray = [1, 2, 3, 4, 5, 6];
const playerNumbers = [1, 2, 3, 4];
const diceIcons = [
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six",
];
const players = [
  {
    name: "Player 1",
    image: 1,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 2",
    image: 0,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 3",
    image: 3,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 4",
    image: 4,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
];
const screen1 = document.querySelector("#screen1");
const screen2 = document.querySelector("#screen2");
const screen3 = document.querySelector("#screen3");
let currentPlayer = 1;
const drawBoard = () => {
  let content = "";
  let boxCount = 101;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i % 2 === 0) boxCount--;
      content += `<div class="box" id="potBox${boxCount}"></div>`;
      if (i % 2 != 0) boxCount++;
    }
    boxCount -= 10;
  }
  board.innerHTML = content;
};
const initialState = () => {
  drawBoard();
  screen2.style.display = "none";
  screen3.style.display = "none";
};

initialState();
let playersCount = 2;
const selectBox = document.getElementsByClassName("selectBox");
const selectPlayers = (value) => {
  selectBox[playersCount - 2].className = "selectBox";
  selectBox[value - 2].className = "selectBox selected";
  playersCount = value;
};
const start = () => {
  screen1.style.display = "none";
  screen2.style.display = "block";
  hideUnwantedPlayers();
};
const back = () => {
  screen2.style.display = "none";
  screen1.style.display = "block";
  resetPlayersCount();
};
const next = () => {
  screen2.style.display = "none";
  screen3.style.display = "block";
  hideFinalPlayers();
  displayNames();
  disableDices();
};
const resetPlayersCount = () => {
  for (let i = 3; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "flex";
  }
};
const hideUnwantedPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "none";
  }
};
const hideFinalPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "playerCard" + i;
    document.getElementById(x).style.display = "none";
  }
};
const displayNames = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    const baseURL = "images/avatars/";
    let x = "displayName" + i;
    let y = "avatar" + i;
    document.getElementById(x).innerHTML = players[i - 1].name;
    document.getElementById(y).src = baseURL + players[i - 1].image + ".png";
  }
};
const updateUserProfile = (playerNo, value) => {
  const baseURL = "images/avatars/";
  if (value === 1) {
    players[playerNo - 1].image = (players[playerNo - 1].image + 1) % 8;
  } else {
    if (players[playerNo - 1].image === 0) {
      players[playerNo - 1].image = 7;
    } else {
      players[playerNo - 1].image = Math.abs(
        (players[playerNo - 1].image - 1) % 8
      );
    }
  }
  let x = "profile" + playerNo;
  document.getElementById(x).src =
    baseURL + players[playerNo - 1].image + ".png";
};
const changeName = (playerNo) => {
  let x = "name" + playerNo;
  let value = document.getElementById(x).value;
  if (value.length > 0) {
    players[playerNo - 1].name = value;
  } else {
    players[playerNo - 1].name = "Player" + playerNo;
  }
};
const resetBoard = () => {
  for (let i = 0; i < 100; i++) {
    let x = i + 1;
    document.getElementById("potBox" + x).innerHTML = "";
  }
};
const updateBoard = () => {
  resetBoard();
  for (let i = 0; i < playersCount; i++) {
    if (players[i].score != 0) {
      let x = "potBox" + players[i].score;
      document.getElementById(
        x
      ).innerHTML += `<div class="pot ${colorsPots[i]}" >`;
    }
  }
};
const movePot = (value, playerNumber) => {
  const playerValue = players[playerNumber - 1].score;
  let end = playerValue + value;
  if (end < 101) {
    if (end === 100) {
      setTimeout(() => {
        modal.className = "modal";
        success.play();
        const baseURL = "images/avatars/";
        wimg.src = baseURL + players[playerNumber - 1].image + ".png";
        wname.innerHTML = players[playerNumber - 1].name;
      }, value * 400);
    }
    var t = setInterval(() => {
      players[playerNumber - 1].score++;
      drop.currentTime = 0;
      drop.play();
      updateBoard();
      if (players[playerNumber - 1].score === end) {
        clearInterval(t);
      }
    }, 400);
    setTimeout(() => {
      checkLadder(players[playerNumber - 1].score, playerNumber);
      checkSnake(players[playerNumber - 1].score, playerNumber);
    }, 400 * value);
  }
};
const rollDice = (playerNo) => {
  if (playerNo === currentPlayer) {
    diceAudio.play();
    const diceNumber = diceArray[Math.floor(Math.random() * diceArray.length)];
    let x = "dice" + playerNo;

    document.getElementById(x).innerHTML = `<i class="diceImg fas ${
      diceIcons[diceNumber - 1]
    }"></i>`;
    
    let tempCurrentPlayer = currentPlayer;
    currentPlayer = 0;
    setTimeout(() => {
      movePot(diceNumber, tempCurrentPlayer);
    }, 1000);
    setTimeout(() => {
      currentPlayer = playerNumbers[tempCurrentPlayer % playersCount];
      document.getElementById("dice" + currentPlayer).style.color = "";
      disableDices();
    }, 2000 + diceNumber * 400);
  }
};
const disableDices = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    if (currentPlayer != i) {
      let x = "dice" + i;
      document.getElementById(x).style.color = "grey";
    }
  }
};
const checkLadder = (value, playerNumber) => {
  for (let i = 0; i < ladders.length; i++) {
    if (ladders[i][0] === value) {
      specialMove(i, playerNumber);
    }
  }
};
const checkSnake = (value, playerNumber) => {
  for (let i = 0; i < snakes.length; i++) {
    if (snakes[i][0] === value) {
      specialMoveSnake(i, playerNumber);
    }
  }
};
const specialMove = (value, playerNumber) => {
  let i = 0;
  var t = setInterval(() => {
    players[playerNumber - 1].score = ladders[value][i];
    ladder.play();
    updateBoard();
    i++;
    if (i === ladders[value].length) {
      clearInterval(t);
    }
  }, 400);
};
const specialMoveSnake = (value, playerNumber) => {
  let i = 0;
  snake.play();
  var t = setInterval(() => {
    players[playerNumber - 1].score = snakes[value][i];
    updateBoard();
    i++;
    if (i === snakes[value].length) {
      clearInterval(t);
    }
  }, 400);
};

