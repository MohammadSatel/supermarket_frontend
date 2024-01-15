// Centralized configuration and utility functions shared across project files

let categories = []
let products = []
let temp_products = []
let cart = []
const cartData = JSON.parse(localStorage.getItem("cart"));
let total = 0;
const MY_SERVER = "https://super-django-1.onrender.com"
let token = sessionStorage.getItem("token") || null
const tokenData = {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token,
}


// Load cart list from local storage
// (Since I call this function with every page load, I'm using it to call other functions)
const loadCart = () => {
  if (cartData != null) cart = cartData
  displayCartLink()
  displayLoginLink()
  checkDarkMode()
}

// Dispaly cart link with amount of items
const displayCartLink = () => {
  const yourCartElement = document.getElementById("yourCart");
  if (yourCartElement) yourCartElement.innerHTML = (cart.length === 0 || !cart)? "your cart(0)" : `your cart(${cart.length})`;
}

// Display username as the text in the login link
const displayLoginLink = () => {
  const loginElement = document.getElementById("loginButton");
  if(token) loginElement.innerHTML = parseJwt(token).username || nul
}

// Display a success notification using Toastify
function showSuccessNotification(message) {
  Toastify({
    text: message,
    duration: 3500,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () { } // Callback after click
  }).showToast();
}

// Display an error notification using Toastify
function showErrorNotification(message) {
  Toastify({
    text: message,
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #ee4318, #efef0c   )",
    },
    onClick: function () { } // Callback after click
  }).showToast();
}

// Show error tostify and take to other page
const changePageError = (page, message) => {
  showErrorNotification(message)
  setTimeout(() => {
    window.location.href = page;
  }, 2000)
}

// Show success tostify and take to other page
const changePageSuccess = (page, message) => {
  showSuccessNotification(message)
  setTimeout(() => {
    window.location.href = page;
  }, 2000)
}

// Token Decoding
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Return username if exist, else return 'guest'
const current_user= ()=>{
  return (token) ?  parseJwt(token).username || nul : 'guest'
}

// Return username mail if exist, else return '-'
const current_user_mail= ()=>{
  return (token) ? parseJwt(token).email||'-' : '-'
}

// make sure cart isnt empty before passing to cart page
const cartLink = () => {
  (cart.length === 0 || !cart) ? showErrorNotification(`your cart is empty, ${current_user()}`) : window.location.href = 'cart.html'
}

//Make sure user login before passing to order hustory page
const OrderHistoryLink = () => {
  (!token || token === null) ? changePageError('login.html', 'Unauthorized. please login') : window.location.href = 'history.html'
}

//Return a spiner to display when waiting for server
const displaySpiner = () => {
  return `<div class="spinner-grow" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
`
}

//Toggle dark mode
const darkMode = () => {
  var element = document.body;
  element.classList.toggle("dark-mode");
  var darkModeButton = document.getElementById("darkModeButton");// Update button text based on the mode
  darkModeButton.innerHTML = element.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
  // Store the mode preference in local storage
  (element.classList.contains("dark-mode")) ? localStorage.setItem("mode", "dark") : localStorage.setItem("mode", "light");
}

//Check for user preference in local storage
const checkDarkMode = () => {
  var element = document.body;
  var mode = localStorage.getItem("mode");
  if (mode === "dark") {
    element.classList.add("dark-mode");
    var darkModeButton = document.getElementById("darkModeButton");
    darkModeButton.innerHTML = "Light Mode";
  }
};