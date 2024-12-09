// Import necessary Firebase modules directly from Google's CDN
// This allows us to use Firebase services without local installation
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Configuration object for connecting to a specific Firebase database
// Contains the unique URL of the Firebase Realtime Database
const appSettings = {
    // This URL points to a specific Firebase project's database
    // Think of this like a unique address for storing and retrieving data
    databaseURL: "https://playground-64b17-default-rtdb.firebaseio.com/"
}

// Initialize Firebase app with the configuration settings
// This creates a connection to the specific Firebase project
const app = initializeApp(appSettings)

// Get a reference to the Firebase Realtime Database
// This allows us to interact with the database (read/write data)
const database = getDatabase(app)

// Create a reference to a specific location in the database called "shoppingList"
// This is like creating a specific folder in the database to store shopping list items
const shoppingListInDB = ref(database, "shoppingList")

// Get references to HTML elements from the webpage
// These will be used to interact with the user interface
const inputFieldEl = document.getElementById("input-field")      // The text input where users type items
const addButtonEl = document.getElementById("add-button")        // The button to add items to the list
const shoppingListEl = document.getElementById("shopping-list")  // The container where shopping list items will be displayed

// Add a click event listener to the "Add" button
// This function runs whenever the user clicks the button to add an item
addButtonEl.addEventListener("click", function() {
    // Get the current value typed in the input field
    let inputValue = inputFieldEl.value
    
    // Use Firebase's push() method to add the new item to the database
    // This automatically creates a unique ID for each item and stores it
    push(shoppingListInDB, inputValue)
    
    // Clear the input field after adding the item
    clearInputFieldEl()
})

// Listen for changes in the shopping list database in real-time
// This function runs automatically whenever data is added, removed, or modified
onValue(shoppingListInDB, function(snapshot) {
    // Check if any items exist in the database
    if (snapshot.exists()) {
        // Convert the database snapshot to an array of key-value pairs
        // Object.entries() transforms the data so we can easily loop through it
        let itemsArray = Object.entries(snapshot.val())
        
        // Clear the current list display to prepare for updated data
        clearShoppingListEl()
        
        // Loop through each item in the array
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]     // Unique Firebase-generated ID
            let currentItemValue = currentItem[1]  // The actual item text
            
            // Add each item to the webpage's shopping list
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        // If no items exist, display a message
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Helper function to clear the shopping list display
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Helper function to clear the input field after adding an item
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to add an item to the shopping list on the webpage
function appendItemToShoppingListEl(item) {
    let itemID = item[0]     // Unique ID for the item
    let itemValue = item[1]  // Text of the item
    
    // Create a new list item element
    let newEl = document.createElement("li")
    
    // Set the text of the list item to the item's value
    newEl.textContent = itemValue
    
    // Add a click event to each list item
    // When an item is clicked, it will be removed from the database
    newEl.addEventListener("click", function() {
        // Create a reference to the exact location of this item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Remove the item from the database
        remove(exactLocationOfItemInDB)
    })
    
    // Add the new list item to the shopping list on the webpage
    shoppingListEl.append(newEl)
}