#!/usr/bin/env node --experimental-modules

// Use the formatter() function to format the Array into a readable string list.

const start = () => {

    let shoppingList1 = ["Apples"];
    let shoppingList2 = ["Apples", "Oranges"];
    let shoppingList3 = ["Apples", "Oranges", "Blueberries"];
    let shoppingList4 = ["Apples", "Oranges", "Blueberries", "Peaches"];

    console.log(formatter(shoppingList1)); // Apples
    console.log(formatter(shoppingList2)); // Apples and Oranges
    console.log(formatter(shoppingList3)); // Apples, Oranges and Blueberries
    console.log(formatter(shoppingList4)); // Apples, Oranges, Blueberries and Peaches

};

const formatter = (array) => {
    // Use this space to solve the problem
};

start();
