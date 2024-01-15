// Load categories from the server and display them.
const loadCategories = async () => {
  displayproducts.innerHTML = displaySpiner()
  const res = await axios.get(MY_SERVER + "/categories")
  categories = res.data
  displayCategories()
}

// Display categories on the user interface as buttons, each triggering the loading of products for the corresponding category.
const displayCategories = () => {
  categories.map((cat, ind) => dropdownoption.innerHTML += `
    <li><a class="dropdown-item" onclick="loadProducts(${ind+2})" href="#">${cat.desc}</a></li>
    `)
}


// Load products from the server, either all products or those belonging to a specific category.
const loadProducts = async (catID) => {
  displayproducts.innerHTML = displaySpiner()
  if (catID) {
    const res = await axios.get(MY_SERVER + `/products/${catID}`);// Fetch products for the specified category from the server
    products = res.data;
    displayProducts(products);
  } else {
    const res = await axios.get(MY_SERVER + `/products/`);// Fetch all products from the server
    products = res.data;
    displayProducts(products);
  }
};


// Display products list
const displayProducts = async (prods) => {
  displayproducts.innerHTML =
    displayproducts.innerHTML = prods.map((prod, ind) => `<div class="card">
      <img src="${MY_SERVER}${prod.img}" alt="Denim Jeans" class="img" style="width:100%">
      <h1>${prod.desc}</h1>
      <p class="price">$${prod.price}</p>
      <input style="justify-content: center; align-items: center;" type="number" id="amount_${ind}" value="1">
      <p><button onclick="buy(${ind})">Add to Cart</button></p>
    </div>`)
}


// Add item to cart and save cart in localstorage
const buy = async (ind) => {
  const product = products[ind]
  const quantity = parseInt(document.getElementById(`amount_${ind}`).value) || 1;
  if (quantity <= 0) {
    showErrorNotification("Please enter a valid positive quantity.");
    return;//exit function if user trying to add negativ amount
  }
  if (cart.filter(prd => prd.id === product.id).length > 0) {
    currentProduct = cart.filter(item => item.id === product.id)[0]
    currentProduct.amount = parseInt(currentProduct.amount) + quantity//if item allready exist in cart, just update amount
  }
  else cart.push({ id: product.id, desc: product.desc, price: product.price, img: product.img, category: product.category, amount: quantity })

  localStorage.setItem("cart", JSON.stringify(cart))//save cart to localstorage
  showSuccessNotification("Item added to cart")
  displayCartLink()
}