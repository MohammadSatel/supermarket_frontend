// Display order history in the div
const displayOrderHistory = () => {
  displayy.innerHTML = displaySpiner()
  axios.get(MY_SERVER + '/history', { headers: tokenData })
    .then((response) => {
      const orderHistory = response.data.orders;
      if (orderHistory.length === 0) {
        changePageError('index.html', "No history of orders. Lets create new history:)")
      }
      orderHistory.reverse()//to get last one first
      // Build the HTML content for displaying order history
      displayy.innerHTML = ''
      displayy.innerHTML = `
          <ul>
            ${orderHistory.map(order => `
              <li>
                <strong>Order Date:</strong>${new Date(order.order_date).toLocaleString()}<br>
                <ul>
                <div class="row row-cols-1 row-cols-md-6 g-1">
                  ${order.order_details.map(detail => ` 
                  <div class="Hcard">
                    <img src="${MY_SERVER}${detail.product_image}" alt="Denim Jeans" class="Himg" style="width:100%">
                    <h1>${detail.product_desc}</h1>
                    <p class="Hprice">$${detail.product_price}</p>
                  </div>
                  `).join('')}
                  </div>
                </ul>
              </li>
              <hr>
            `).join('')}
          </ul>
        `;
      orderHistoryDiv.innerHTML = orderHistoryHtml;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        showErrorNotification("Unauthorized. Please log in")
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);//take user to login page if unauthorized
      }
      console.error('Error fetching order history:', error);
    });
}