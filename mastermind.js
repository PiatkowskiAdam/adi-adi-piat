/*
********** The Sideboard **********
*/

// a variable storing the amount of rounds, the game is to be easily scalable (difficulty to be developed later)
let availableGuesses = 12;

// 2 empty arrays. One will be used for storing balls, the other one will store 4 random balls that will serve as code to be broken
let balls = [];
let generatedCode = [];

// this array will store the guessed code that will be compared with the generated one.
let guessedCode = [];

// selection the sideboard
let selectionSide = document.querySelector(".selectionSide");

// button that submits a row
let submitButton = document.querySelector(".submitGuess");
submitButton.addEventListener('click', newRow);


// a button used to trigger the function that reverts your choice after a mistake has been made
let revertButton = document.querySelector(".revert");
revertButton.addEventListener('click', revertChoice);


// a tool that creates balls
function Ball(color) {
  let ballDiv = document.createElement('div');
  ballDiv.setAttribute("class", "ball");
  ballDiv.setAttribute("draggable", true);
  ballDiv.style.backgroundColor = color;
  selectionSide.appendChild(ballDiv);
  ballDiv.addEventListener('click', selectColor);
  balls.push(ballDiv);
}


// a function handling color selection
function selectColor(e) {
  let colorSelected = e.target.style.backgroundColor;
  let coloredBall = document.querySelector('.nextBall');
  if (coloredBall) {
    coloredBall.style.backgroundColor = colorSelected;
    coloredBall.className = "coloredBall";
    guessedCode.push(coloredBall);
    nextBall();
  } else {
    alert("You completed a row! You need to submit it in order to keep guessing!")
  }
}


// a function that changes the previously selected color back to a blank
function revertChoice() {
  let previousChoices = document.querySelectorAll('.coloredBall');

  // only the balls from the current row are allowed to be changed. Once the user received feedback, the choice is frozen.
  if (previousChoices[previousChoices.length - 1].parentNode.className === "activeRow" || !previousChoices) {
    previousChoices[previousChoices.length - 1].className = 'nextBall';
    previousChoices[previousChoices.length - 1].style.backgroundColor = '#f5f7f6';
    guessedCode.pop();
  } else {
    alert("Reverting your selection is only available in active rows.")
  }
}


// creating balls with all colors to choose from
let blueBall = new Ball("#2b2ee3");
let redBall = new Ball("#c40e0e");
let yellowBall = new Ball("#f5f107");
let greenBall = new Ball("#11ab09");
let purpleBall = new Ball("#6a0f91");
let brownBall = new Ball("#75240c");
let orangeBall = new Ball("#e0640b");
let greyBall = new Ball("#a3978e");



/*
********** The Main Playboard **********
*/

// identifying this part of the board
let playingBoard = document.querySelector(".playingBoard");

// identifying the modal that shows up after the game ends
let gameConclusion = document.querySelector(".gameConclusion")
// the text that indicates the result of the game
let result = document.querySelector(".result")
// and the button that lets you restart the game
let restartBtn = document.querySelector('.playAgain')
restartBtn.addEventListener('click', gameRestart)


// setting-up empty rows
for (let i = 0; i < availableGuesses; i++) {
  emptyBalls();
}

//function setting up empty rows
function emptyBalls() {
  let singleRow = document.createElement('div');
  singleRow.setAttribute('class', "singleRow");
  for (var i = 0; i < 4; i++) {
    let ballDiv = document.createElement('div');
    ballDiv.setAttribute("class", "emptyBall");
    singleRow.appendChild(ballDiv);
  }
  let scoringDiv = document.createElement('div');
  scoringDiv.setAttribute("class", "scoringDiv")
  singleRow.appendChild(scoringDiv);
  for (let j = 0; j < 4; j++) {
    let scoringBall = document.createElement('div');
    scoringBall.setAttribute("class", "scoringBall");
    scoringDiv.appendChild(scoringBall);
  }
  playingBoard.appendChild(singleRow);
}


// a function that prepares the new row for color-selection.
function newRow() {
  if (guessedCode.length === 4) {
    let scoring = codesComparison(guessedCode, generatedCode);
    if (scoring === 4) {
      result.textContent = "You've won! Awesome! Do you want to play again and prove that you weren't just lucky?"
      gameConclusion.style.display = 'block';
    }
    guessedCode = [];
    let currentRow = document.querySelector('.activeRow');
    if (currentRow) {
      currentRow.className = 'finishedRow';
    }
    let activeRow = document.querySelector('.singleRow');
    if (activeRow) {
      activeRow.className = 'activeRow';
      nextBall();
    } else {
        if (scoring !== 4) {
          result.textContent = "You've run out of guesses. Do not get discouraged and try again!"
          gameConclusion.style.display = 'block';
        }
    }

  } else {
    alert("You need to select all four balls to submit a row!")
  }
}

// a function that prepares the next ball for color-selection
function nextBall() {
  let nextBall = document.querySelector(".emptyBall");
  if (nextBall) {
    nextBall.className = "nextBall";

    if (nextBall.parentNode.className !== 'activeRow') {
      nextBall.className = "emptyBall"
  }}}

// there are a couple of steps needed on the onset of the game, this function handles them.
function gameStart() {

  // generating new code for the game. The objective of the game is to guess it.
  for (let i = 0; i < 4; i++) {
    let randomBall = balls[Math.floor(Math.random()*balls.length)];
    generatedCode.push(randomBall);
  }

  // changing the first row to be active, i.e. making it stand out visually and allow the functions to handle balls accordingly.
  let firstRow = document.querySelector(".singleRow");
  firstRow.className = "activeRow";

  // changing the classname of the first ball and hence allowing color-assignment to it.
  let firstBall = document.querySelector(".emptyBall");
  firstBall.className = "nextBall";
}

// this function brings back everything back to its initial settings, allowing the game to be started over
function gameRestart() {
  let coloredBalls = document.querySelectorAll('.coloredBall');
  let finishedRows = document.querySelectorAll('.finishedRow');
  let activeRow = document.querySelector('.activeRow');
  let scoredBallsWhite = document.querySelectorAll('.scoredBallWhite');
  let scoredBallsBlack = document.querySelectorAll('.scoredBallBlack');
  let scoredBalls = document.querySelectorAll('.scoredBall');
  gameConclusion.style.display = 'none';
  generatedCode = [];

  for (let i = 0; i < coloredBalls.length; i++) {
    coloredBalls[i].className = 'emptyBall';
    coloredBalls[i].style.backgroundColor = '#f5f7f6'
  }
  for (let i = 0; i < finishedRows.length; i++) {
    finishedRows[i].className = 'singleRow';
  }

  if (activeRow) {
    activeRow.className = 'singleRow';
  }

  for (let i = 0; i < scoredBallsWhite.length; i++) {
    scoredBallsWhite[i].className = 'scoringBall';
  }

  for (let i = 0; i < scoredBallsBlack.length; i++) {
    scoredBallsBlack[i].className = 'scoringBall';
  }

  for (let i = 0; i < scoredBalls.length; i++) {
    scoredBalls[i].className = 'scoringBall';
  }
  gameStart()
}


// comparing two codes and providing feedback on those to the user. The code generated by the game is compared with the one the user inputs.
function codesComparison(array1, array2) {
  perfectMatches = 0;
  partialMatches = 0;

  // some items will be deleted from the arrays in order to handle duplicates properly. These
  workingVersion1 = [];
  workingVersion2 = [];

  for (let i = 0; i < array1.length; i++) {
    workingVersion1.push(array1[i])
  }
  for (let i = 0; i < array2.length; i++) {
    workingVersion2.push(array2[i])
  }

  for (let i = 0; i < workingVersion1.length; i++) {
    if (workingVersion1[i].style.backgroundColor === workingVersion2[i].style.backgroundColor) {
      perfectMatches += 1;
      workingVersion1.splice([i], 1);
      workingVersion2.splice([i], 1);
      i--;
    }
  }

  for (let i = 0; i < workingVersion1.length; i++) {
    let j = 0;
    while (j < workingVersion2.length) {
      if (!(workingVersion1[i].style.backgroundColor === workingVersion2[j].style.backgroundColor)) {
        j++;
    } else {
        partialMatches += 1;
        workingVersion1.splice([i], 1);
        workingVersion2.splice([j], 1);
        i--;
        break;
    }
    }
    }
    for (let i = 0; i < 4; i++) {
      let scoringBall = document.querySelector('.scoringBall');
      for (let i = 0; i < perfectMatches; i++) {
        let scoredBallBlack = document.querySelector('.scoringBall');
        scoredBallBlack.className = "scoredBallBlack";
      }
      for (let i = 0; i < partialMatches; i++) {
          let partialScoringBall = document.querySelector('.scoringBall');
          partialScoringBall.className = "scoredBallWhite";
      }
      for (let i = 0; i < 4 - perfectMatches - partialMatches; i++) {
        let emptyScoringBall = document.querySelector('.scoringBall');
        emptyScoringBall.className = "scoredBall";
      }

      return perfectMatches
    }
  };





gameStart();
