const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
// cards are set to false before starting game
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    { name: "card1", image: "images/img1.jpg"},
    { name: "card2", image: "images/img2.jpg" },
    { name: "card3", image: "images/img3.jpg" },
    { name: "card4", image: "images/img4.jpg" },
    { name: "card5", image: "images/img5.jpg" },
    { name: "card6", image: "images/img6.jpg" },
    { name: "card7", image: "images/img7.jpg" },
    { name: "card8", image: "images/img8.jpg" },
];

//Initial Time
let seconds = 0;
let minutes = 0;
let time=0;
//Initial moves and win count
let movesCount = 0;
let winCount = 0;

//function to calculate time
const timeGenerator = () => {
     seconds += 1;
     //When seconds is greater than 59 it will become a minute
     if (seconds >= 60) {
     minutes += 1;
     seconds = 0;
     }
     //format time 
     let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
     let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
     time=`${minutesValue}:${secondsValue}`
     timeValue.innerHTML = `<span>Time:</span>${time}`;
};

//Functions for calculating moves
const movesCounter = () => {
     movesCount += 1;
     moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Generates random images from items array
const generateCards = (size = 4) => {
    let tempArray = [...items]; /*temporary array to store items array */
    //creating new array called cardValues
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random images are selected 
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
    }
    return cardValues;
};

// function to shuffle the cards during each game
const shuffleCards = (cardValues, size = 4) => {
     gameContainer.innerHTML = "";
     cardValues = [...cardValues, ...cardValues];
     //simple shuffle of the cards using math random
     cardValues.sort(() => Math.random() - 0.5);
     for (let i = 0; i < size * size; i++) {
         /* Create Cards linked with html
         card-before = front side that contains question mark
         card-after => back side that contains images
         data-card-values is a custom attribute which stores the names of the cards to match later */
         gameContainer.innerHTML += `
         <div class="card-container" data-card-value="${cardValues[i].name}">
             <div class="card-before">?</div>
             <div class="card-after">
             <img src="${cardValues[i].image}" class="image"/></div>
         </div> `;
     }

    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
        // the cards are not matched 
        if (!card.classList.contains("matched")) {
             //flip the clicked card
             card.classList.add("flipped");
             if (!firstCard) {
                 firstCard = card; /*current card will become fist card */
                 //current cards value becomes firstCardValue
                 firstCardValue = card.getAttribute("data-card-value");
             } 
             else {
             //increment moves since user selected second card
                  movesCounter();
                  secondCard = card;
                  let secondCardValue = card.getAttribute("data-card-value");

                  if (firstCardValue == secondCardValue) {
                      firstCard.classList.add("matched");
                      secondCard.classList.add("matched");

                      //setting firstCard to false since next card would become first after two cards are matched
                      firstCard = false;

                      //winCount increment as user found a correct match
                      winCount += 1;
                      //check if winCount cardValues is half of 2 and shows the result
                      if (winCount == Math.floor(cardValues.length / 2)) {
                          if(movesCount<=20){
                              result.innerHTML = `<h2>You Won :-)</h2>
                              <h4>Moves: ${movesCount}</h4>
                              <h4>Time: ${time}`
                          } else{
                              result.innerHTML = `<h2>You Lost :-(</h2>
                              <h4>Moves: ${movesCount}</h4>
                              <h4>Time: ${time}`
                           }
                           stopGame(); /*game is stopped after all cards are matched */
                      }
                    } else {
                        //if the cards don't match, then it will flip back
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};


//Start button allows the game to start
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //controls amd buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //Starts time on the container
    interval = setInterval(timeGenerator,1000);
    //number of moves will be showed 
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

// stop button stops the game and get back to start button
stopButton.addEventListener("click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

//Initialize values and calls functions
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateCards();
    console.log(cardValues);
    shuffleCards(cardValues);
};
