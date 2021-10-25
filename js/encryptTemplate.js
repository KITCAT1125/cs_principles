//Comment pseudocode up here
// Objective: take a message from a user and encrypt it
// Then using the cypher decrypt it
/* 
1. Get input from user

*/
// global variables go at the top

// The alphabet, and the encrypted values that correspond with the letters
let POINTS = ["27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];
let Letters = ["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let player1score = 0;
let player2score = 0;
// utility functions

// check if is upper
function isupper(str) {
  return str === str.toUpperCase();
}

// check if is lower
function islower(str) {
  return str === str.toLowerCase();
}

// return points by associating the index of the letter with the POINTS array
function getPoints(letter){
  let index = Letters.indexOf(letter);
  return POINTS[index];
}

// Return letters by associating the index of the point with the Letters array
function getLetters(point){
  let index = POINTS.indexOf(point);
  return Letters[index];
}
// can you in JS perform an islower/isupper and strlen

// Rotates through the lowercase form of each character, calling the getPoints function and returning a list of the encrypted characters
function encrypt(word){
    let score = [];
    for (i = 0, n = word.length; i < n; i++){
        // if (islower(word[i])){
        //   console.log(word[i] + "this is lower case");
        // }
        // if (isupper(word[i])){
        //   console.log(word[i] + " is upper case");
        // }
        // console.log("letter is " + (word[i]));
        // console.log("letter score is " + getPoints(word[i].toLowerCase()));
        score.push(getPoints(word[i].toLowerCase()));
        // console.log("final score here " + score);
    }
    return score;
}

// Calls the getLetters function on the input and returns its output
function decrypt(number){
  let score = [];
  // for (i = 0, n = number.length; i < n; i++){
      // if (islower(word[i])){
      //   console.log(word[i] + "this is lower case");
      // }
      // if (isupper(word[i])){
      //   console.log(word[i] + " is upper case");
      // }
      // console.log("letter is " + (word[i]));
      // console.log("letter score is " + getPoints(word[i].toLowerCase()));
      score.push(getLetters(number));
      // console.log("final score here " + score);
  // }
  return score;
}
// encrypt("hello");
// SCOPE>>>>>>>>>>>

// Retrieves the input from the html
function getInputValue() {
  // Selecting the input element and get its value 
  return document.getElementById("inputId").value;
  // Displaying the value
}

// Calls the encrypt function and returns an output in a sentence to the html
function encryptMessage(){
  let score = encrypt(getInputValue())
  // alert("You scored " + score );
  output("The encrypted message is '" + score + "'.");
}

// Calls the decrypt function and returns an output in a sentence to the html
function decryptMessage(){
  let score = decrypt(getInputValue())
  // alert("You scored " + score );
  output("The decrypted character is '" + score + "'.");
}

// failing function due to inability to access element on page and alter it dynamically
function output(content){
  document.getElementById("display").innerHTML = content;
}
  