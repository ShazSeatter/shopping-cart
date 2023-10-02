import './style.css'

import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


document.querySelector('#app').innerHTML = `
  <div class="container">
    <img src="./shopping-basket.png"/>
    <input id="input-field" type="text" placeholder="Enter a item..."/>    
    <button id="add-btn">Add to cart</button>
    <ul id="shopping-list">
    </ul>
  </div>
`

const appSettings = {
  databaseURL: "https://realtime-database-7c76e-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const inputFieldEl = document.getElementById("input-field")
const shoppingListEl = document.getElementById("shopping-list")
const addButtonEl = document.getElementById("add-btn")

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value

  push(shoppingListInDB, inputValue)

  clearField()
})


// this will be updated in real time from DB
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val()) 
    clearShoppingListEl()

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
  
      
      appendToList(currentItem)

    }
  } else {
    shoppingListEl.innerHTML = "No items listed...yet"
  }
})

function appendToList(item) {
  let itemID = item[0]
  let itemValue = item[1]

  let newEl = document.createElement("li")
  newEl.textContent = itemValue

  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    remove(exactLocationOfItemInDB)
  })
  shoppingListEl.append(newEl)
}


// CLEAR FUNCTIONS 

// set the input field VALUE to empty string 
function clearField() {
  inputFieldEl.value = ""
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}
