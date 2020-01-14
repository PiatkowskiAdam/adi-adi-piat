/*
********** General Data Structures **********
*/


// 2 empty arrays. One of them will be used for storing balls for selection, the other one will hold the generated code (the goal of the game is to break this code)
let balls = [];
let generatedCode = [];


// this array will store the guessed code that will be compared with the generated one.
let guessedCode = [];


// the pre-set difficulty for the first game is normal. It is adjustable.
let difficulty = 'normal';


// If this is not the first game in a session, the default difficulty is set to the level chosen the previous time.
if (sessionStorage.length > 0) {
  difficulty = sessionStorage.getItem('difficulty');
  let selectedDifficulty = document.getElementById(difficulty);
  selectedDifficulty.selected = true;
}


/*
********** Main Menu **********
*/


// this is the first screen you see after launching the game
let mainMenu = document.querySelector('.mainMenu');


// a drop-down list that handles difficulty selection
let difficultyBar = document.querySelector(".difficulty");
difficultyBar.addEventListener('change', difficultyChanger);


// a function that handles difficulty changes.
function difficultyChanger() {
  difficulty = difficultyBar.value;
}


// a button that starts a new game
let newGameBtn = document.querySelector('.newGameBtn');
newGameBtn.addEventListener("click", function() {
  gameStart(difficulty);
});


// a button that switches the rules on
let rulesBtn = document.querySelector('.rulesBtn');
rulesBtn.addEventListener('click', readRules);


// a modal that stores the rules section
let rulesSection = document.querySelector('.rules');


// a function that allows you to read the rules
function readRules() {
  rulesSection.style.display = 'block';
}


// a button that switches the rules off
let offSwitch = document.querySelector('.offSwitch');
offSwitch.addEventListener('click', shuttingRules);


// a function handling switching the rules off
function shuttingRules() {
  rulesSection.style.display = 'none';
}


/*
********** The Sideboard **********
*/


// selection of the sideboard
let selectionSide = document.querySelector(".selectionSide-8-Ball");


// button that submits a row
let submitButton = document.querySelector(".submitGuess");
submitButton.addEventListener('click', newRow);


// a button used to trigger the function that reverts your choice after a mistake has been made
let revertButton = document.querySelector(".revert");
revertButton.addEventListener('click', revertChoice);


// a function used to create balls
function Ball(color) {
  let ballDiv = document.createElement('div');
  ballDiv.setAttribute("class", "ball");
  ballDiv.style.backgroundColor = color;
  ballDiv.addEventListener('click', selectColor);
  balls.push(ballDiv);
}


// a function handling creation of balls used for selection. Depending on difficulty, there are either 6 or 8 of them.
function setSelectionBalls(difficulty) {
  if (difficulty === "easy" || difficulty === "normal") {
    for (let i = 0; i < 6; i++) {
      selectionSide.appendChild(balls[i]);
    }
    selectionSide.className = 'selectionSide-6-Ball';
  } else {
    for (let i = 0; i < balls.length; i++) {
      selectionSide.appendChild(balls[i]);
    }
    selectionSide.className = 'selectionSide-8-Ball';
  }
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

  if (previousChoices.length === 0) {
    alert("Reverting your choice is only possible if there's a ball to perform the action on.")
  }
  // only the balls from the current row are allowed to be reverted. Once the user received feedback from the game, reverting the choice is not possible anymore.
  else if (previousChoices[previousChoices.length - 1].parentNode.className === "activeRow") {
    previousChoices[previousChoices.length - 1].className = 'nextBall';
    previousChoices[previousChoices.length - 1].style.backgroundColor = '#f5f7f6';
    guessedCode.pop();
  } else {
    alert("Reverting your selection is only available in active rows.")
  }
}


// creating balls with all available colors to choose from
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
  // the row can only be submitted if all empty balls have been coloured. This prevents a row submission by mistake
  if (guessedCode.length === 4) {
    let scoring = codesComparison(guessedCode, generatedCode);
    if (scoring === 4) {
      result.textContent = "You've won! Awesome! Do you want to play again and prove that you weren't just lucky?"
      gameConclusion.style.display = 'block';
    }
    guessedCode = [];
    let currentRow = document.querySelector('.activeRow');
    currentRow.className = 'finishedRow';
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
function gameStart(difficulty) {
  // making the main menu disappear
  mainMenu.style.display = 'none';
  // setting-up empty rows
  let availableGuesses = 10;
  if (difficulty === 'easy' || difficulty === 'hard') {
    availableGuesses = 12;
  }
  for (let i = 0; i < availableGuesses; i++) {
    emptyBalls();
  }
  // generating new code for the game. The objective of the game is to guess it.
  for (let i = 0; i < 4; i++) {
    if (difficulty === "easy" || difficulty === "normal") {
      let randomBall = balls[Math.floor(Math.random()*6)];
      generatedCode.push(randomBall);
    } else {
      let randomBall = balls[Math.floor(Math.random()*balls.length)];
      generatedCode.push(randomBall);
    }
  }
  setSelectionBalls(difficulty)
  // changing the first row to be active, i.e. making it stand out visually and allow the functions to handle balls accordingly.
  let firstRow = document.querySelector(".singleRow");
  firstRow.className = "activeRow";
  // changing the classname of the first ball and hence allowing color-assignment to it.
  let firstBall = document.querySelector(".emptyBall");
  firstBall.className = "nextBall";
}


// this function reloads the page, allowing the game to be started over. The current difficulty is saved so that it's not overwritten by the default difficulty at the onset of the new game.
function gameRestart() {
  sessionStorage.setItem("difficulty", difficulty)
  location.reload()
}


// comparing two codes and providing feedback on those to the user. The code generated by the game is compared with the one the user inputs.
function codesComparison(array1, array2) {
  // 2 variables that will store the value of both, balls that match perfectly, as well as those that match only when it comes to colour.
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
  // a for loop that counts perfect matches
  for (let i = 0; i < workingVersion1.length; i++) {
    if (workingVersion1[i].style.backgroundColor === workingVersion2[i].style.backgroundColor) {
      perfectMatches += 1;
      // to correctly handle duplicates, a ball needs to be deleted from its array in order not to be counted again
      workingVersion1.splice([i], 1);
      workingVersion2.splice([i], 1);
      i--;
    }
  }
  // a for loop that counts partial matches (the matches of which, only the colour is correct)
  for (let i = 0; i < workingVersion1.length; i++) {
    let j = 0;
    while (j < workingVersion2.length) {
      if (!(workingVersion1[i].style.backgroundColor === workingVersion2[j].style.backgroundColor)) {
        j++;
    // if a match is found, both balls need to be deleted from their arrays. Otherwise, the duplicates are not counted correctly.
      } else {
          partialMatches += 1;
          workingVersion1.splice([i], 1);
          workingVersion2.splice([j], 1);
          i--;
          break;
      }
    }
  }
    // a for loop that handles scoring
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
      // .scoredBall and .scoringBall appear to be the same, however, in order for the next scoring to start from the beginning of the next row, all scoring balls need to have their classname changed.
      for (let i = 0; i < 4 - perfectMatches - partialMatches; i++) {
        let emptyScoringBall = document.querySelector('.scoringBall');
        emptyScoringBall.className = "scoredBall";
      }
      return perfectMatches
    }
  };
