#!/usr/bin/env node

//TODO: Add Betting to the Black Jack Program

import Chalk from "chalk";
import Inquirer from "inquirer";
import DeckOfCards from "../resources/deckOfCards.js";

let deck = Array().concat(Object.values(DeckOfCards));
let players = [];
let numberOfDecks = 1;
let startingChipValue = 500;

function startBlackJack() {

    if (players.length > 0) {
        dealInitialCards();
    } else getPlayers().then(() => dealInitialCards());

}

async function getPlayers() {

    let numOfPlayers;

    await Inquirer.prompt([
        {
            type: "list",
            name: "numOfPlayers",
            message: `${Chalk.blue("How Many Players?")} (1-6)`,
            choices: ["1", "2", "3", "4", "5", "6"],
        },
        {
            type: "list",
            name: "numOfDecks",
            message: `${Chalk.blue("How Many Decks Will Be Used?")} (1-6)`,
            choices: ["1", "2", "3", "4", "5", "6"],
        },
        {
            type: "list",
            name: "numOfChips",
            message: `${Chalk.blue("How Many Starting Chips Should Each Player Receive?")} (1-6)`,
            choices: ["100", "200", "300", "500", "1000"],
        }
    ]).then(answers => {
        numOfPlayers = answers["numOfPlayers"];
        numberOfDecks = answers["numOfDecks"];
        startingChipValue = answers["numOfChips"];

        shuffleDeck();
    });

    for (let i = 0; i < numOfPlayers; i++) {

        await Inquirer.prompt([
            {
                type: "input",
                name: "nameOfPlayer",
                message: Chalk.blue(`${Chalk.green(`Player ${i + 1}`)} What Is Your Name??`),
                default: `Player ${i +1}`,
                validate: validatePlayerName,
            }
        ]).then(answers => {
            players.push({
                name: Chalk.green(answers["nameOfPlayer"]),
                cards:[],
                turns: 0,
                blackJack: false,
                busted: false,
                help: false,
                chips: startingChipValue,
                bet: 0
            });
        });
    }

    players.push({
        name: Chalk.red("Dealer"),
        cards: [],
        turns: 0,
        blackJack: false,
        busted: false,
        hiddenCard: {},
    });
}

function getPlayAgain() {
    shuffleDeck();
}

function dealInitialCards() {

    players.forEach((player, i) => drawCard(i) );
    players.forEach((player, i) => drawCard(i) );
    console.log("--- Evaluating Hands ---");
    players.forEach((player, i) => {
        console.log(`${players[i].name} has A ${getPlayerCards(i)} for a total of ${Chalk.yellow(getPlayerCardsValue(i))}`);
    });

    // checkDealerBlackJack()

    startPlayerTurns().then(() => getPlayAgain());
}

async function startPlayerTurns() {

    console.log("--- Starting Player Turns ---");

    for (let i = 0; i < players.length; i++) {

        if (i !== players.length - 1) await getPlayerTurn(i);
        else await getDealerTurn(i);

    }

    evaluateTable();
}

async function getPlayerTurn(playerIndex) {

    let playerFinished = false;

    while(!playerFinished) {

        let playerName = players[playerIndex].name;
        let playerCards = getPlayerCards(playerIndex);
        let playerCardsValue = getPlayerCardsValue(playerIndex);

        if (!players[playerIndex].help) {
            if (players[playerIndex].turns === 0) {
                console.log(`${playerName}! It's Your Turn!`);
                console.log(`You have A ${playerCards} for a total of ${Chalk.yellow(playerCardsValue)}`);
            } else {
                console.log(`Turn ${players[playerIndex].turns + 1}!!!`);
                console.log(`You now have A ${playerCards} for a total of ${Chalk.yellow(playerCardsValue)}`);
            }
        }

        await Inquirer.prompt([
            {
                type: "list",
                name: "intent",
                message: `${playerName} ${Chalk.blue("What Would You Like To Do?")}`,
                choices: getPlayerOptions(playerIndex),
            }
        ]).then(answers => {

            if (answers["intent"].includes("Hit")) {
                players[playerIndex].help = false;
                players[playerIndex].turns++;
                drawCard(playerIndex);

                if (getPlayerCardsValue(playerIndex) > 21) {
                    console.log(Chalk.red(`${playerName} has BUSTED!!`));
                    playerFinished = true;
                }

            } else if (answers["intent"].includes("Stand")) {
                players[playerIndex].help = false;
                console.log(`${playerName} has chosen to ${Chalk.green("Stand")} at ${Chalk.yellow(playerCardsValue)}`);
                playerFinished = true;

            } else if (answers["intent"].includes("Double Down")) {
                players[playerIndex].help = false;

            } else if (answers["intent"].includes("Split")) {
                players[playerIndex].help = false;

            } else if (answers["intent"].includes("Help")) {
                players[playerIndex].help = true;

                console.log("--- Evaluating Hands ---");
                players.forEach((player, i) => {
                    console.log(`${players[i].name} has A ${getPlayerCards(i)} for a total of ${Chalk.yellow(getPlayerCardsValue(i))}`);
                });

            }
        });
    }
}

function getPlayerOptions(playerIndex) {

    let playerOptions = [Chalk.red("Hit"), Chalk.green("Stand")];

    if (players[playerIndex].turns === 0) {
        playerOptions.push(Chalk.blue("Double Down"));

        if (players[playerIndex].cards[0].name === players[playerIndex].cards[0].name) {
            playerOptions.push(Chalk.yellow("Split"));
        }
    }

    if (!players[playerIndex].help) playerOptions.push(Chalk.grey("Help"));

    return playerOptions;
}

function getDealerTurn(dealerIndex) {
    let dealerFinished = false;

    players[dealerIndex].cards.push(players[dealerIndex].hiddenCard);
    players[dealerIndex].hiddenCard = {};

    while(!dealerFinished) {

        if (players[dealerIndex].turns === 0) {
            console.log(Chalk.red(`${players[dealerIndex].name} Turn!`));
            console.log(`${players[dealerIndex].name} has A ${getPlayerCards(dealerIndex)} for a total of ${Chalk.yellow(getPlayerCardsValue(dealerIndex))}`);
        } else {
            console.log(`Turn ${players[dealerIndex].turns + 1}!!!`);
            console.log(`${players[dealerIndex].name} now has A ${getPlayerCards(dealerIndex)} for a total of ${Chalk.yellow(getPlayerCardsValue(dealerIndex))}`);
        }

        if (getPlayerCardsValue(dealerIndex) > 21) {
            dealerFinished = true;
            players[dealerIndex].busted = true;

            console.log(Chalk.red(`${players[dealerIndex].name} has BUSTED!!`));
        } else if (getPlayerCardsValue(dealerIndex) > 17) {
            dealerFinished = true;

            console.log(Chalk.cyan(`${players[dealerIndex].name} has ${Chalk.yellow(getPlayerCardsValue(dealerIndex))} and must Stand!!`));
        } else {
            players[dealerIndex].turns++;
            drawCard(dealerIndex);
        }
    }

}

function evaluateTable() {

    let dealerName = players[players.length - 1].name;
    let dealerValue = getPlayerCardsValue(players.length - 1);

    console.log("--- Evaluating Table ---");

    if (dealerValue > 21) console.log(Chalk.red(`${dealerName} has BUSTED with ${dealerValue}`));
    else console.log(Chalk.blue(`${dealerName} has ${dealerValue}`));

    for (let i = 0; i < players.length -1; i++) {

        if (players[i].blackJack) {
            console.log(Chalk.green(`${players[i].name} WON with a BLACKJACK`));
        } else if (players[i].busted) {
            console.log(Chalk.red(`${players[i].name} BUSTED with ${Chalk.yellow(getPlayerCardsValue(i))}`));
        } else if (getPlayerCardsValue(i) > dealerValue) {
            console.log(Chalk.green(`${players[i].name} WON with ${Chalk.yellow(getPlayerCardsValue(i))}`));
        } else if (getPlayerCardsValue(i) < dealerValue) {
            console.log(Chalk.red(`${players[i].name} LOST with ${Chalk.yellow(getPlayerCardsValue(i))}`));
        } else if (getPlayerCardsValue(i) === dealerValue) {
            console.log(Chalk.blue(`${players[i].name} PUSHED with ${Chalk.yellow(getPlayerCardsValue(i))}`));
        }
    }
}

function shuffleDeck() {
    deck = Array().concat(Object.values(DeckOfCards));

    for (let i =0; i < numberOfDecks -1; i++) deck = deck.concat(Object.values(DeckOfCards));
}

function drawCard(playerIndex) {
    let card = deck.splice(Math.floor(Math.random() * deck.length - 1), 1)[0];

    if (playerIndex === players.length - 1
        && players[playerIndex].cards.length === 1
        && players[playerIndex].hiddenCard !== undefined) {

        players[playerIndex].hiddenCard = card;
        console.log(`${players[playerIndex].name} was dealt A Face Down Card`);

    } else {

        players[playerIndex].cards.push(card);
        console.log(`${players[playerIndex].name} was dealt A ${card.name} of ${card.suit}`);
    }
}

function getPlayerCards(playerIndex) {

    let playerCards = [];

    players[playerIndex].cards.map(card => {
        if (card.suit === "Spades" || card.suit === "Clubs") {
            playerCards.push(Chalk.bgWhiteBright.black.bold(`${card.name} of ${card.suit}`));
        } else playerCards.push(Chalk.bgWhiteBright.red.bold(`${card.name} of ${card.suit}`));
    });

    if (players[playerIndex].hiddenCard !== undefined) {
        if (Object.keys(players[playerIndex].hiddenCard).length !== 0) playerCards.push("A Face Down Card");
    }

    if (playerCards.length === 1) return playerCards.toString();
    else if (playerCards.length === 2) return playerCards.join(" and ");
    else return playerCards.join(", ").replace(/,(?=[^,]*$)/, " and");

}

function getPlayerCardsValue(playerIndex) {

    let foundAces = 0;
    let playerCardValue = 0;

    players[playerIndex].cards.forEach(card => {
        if (card.value === 1) {
            foundAces++;
            playerCardValue = playerCardValue + card.value + 10;
        } else playerCardValue = playerCardValue + card.value;
    });

    if (playerCardValue > 21 && foundAces > 0) {
        let potentialPlayerCardValue = playerCardValue;

        for (let i = 0; i < foundAces; i++) {
            potentialPlayerCardValue = potentialPlayerCardValue - 10;

            if (potentialPlayerCardValue < 21) break;
        }

        playerCardValue = potentialPlayerCardValue;
    }

    if (playerCardValue > 21) players[playerIndex].busted = true;

    return playerCardValue;
}

function validatePlayerName(name) {

    if (name.length < 1) {
        throw Chalk.red("Name Must Be At Least 1 Character!!!");
    } else if (name.length > 20) {
        throw Chalk.red("Name Must Be Less Than 20 Characters!!!");
    } else return true;
}

startBlackJack();
