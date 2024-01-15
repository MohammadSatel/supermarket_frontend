// Display cart
const displayCart = () => {
  if (cart.length === 0 || !cart) changePageError('index.html', `your cart is empty, ${current_user()}`)
  total = 0;
  cartDisplay.innerHTML = cart.map((item, ind) => {
    total += parseFloat(item.price) * parseFloat(item.amount);//calc total price
    total = parseFloat(total.toFixed(2)); // Limit total to 2 decimal places
    return `
      <div class="col">
        <div class="card text-bg-dark mb-3">
          <img src="${MY_SERVER}${item.img}" class="card-img card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.desc} ${item.price}$</h5>
            <p class="card-text">amount: ${item.amount}</p>
            <button onclick="remove(${item.id})">Remove</button>
          </div>
        </div>
      </div>`;
  });
  checkoutbutton.innerHTML = `Checkout ${total}$`
}


// Remove item from cart list
const remove = (id) => {
  cart = cart.filter(item => item.id !== id);//gives a new cart without this item
  localStorage.setItem("cart", JSON.stringify(cart));//save updated cart to localstorage
  showSuccessNotification("Itam removed from cart")
  displayCart()
}


// checkout - Send cart to server
const checkOut = async () => {
  if (!token || token === null) {
    changePageError('login.html', 'Unauthorized. please login')
    return//exit function if unauthorized
  }
  checkoutbutton.innerHTML = displaySpiner()
  const userConfirmed = confirm("Are you sure you want to check out?");//ask user to confirm checkout
  if (userConfirmed) {
    try {
      let response = await axios.post(MY_SERVER + "/checkout", { cart: cartData }, { headers: tokenData });//send cart and token to server
      if (response.data === "order saved fucking successfuly") {
        checkoutbutton.innerHTML = 'CheckOut'
        localStorage.removeItem("cart");//delete cart from localstorage
        cart = []//clear cart var
        changePageSuccess('index.html',   `Thanks for your order ${current_user()}:) Recipt sent to your email`)
      }
    } catch (error) {
      console.log("Failed to perform the checkout.");
      checkoutbutton.innerHTML = 'CheckOut'
    }
  }
}