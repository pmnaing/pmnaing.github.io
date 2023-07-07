//Search Filter Class to search for items in main page
class SearchFilter {
  constructor(inputSelector, itemSelector, nameSelector) {
    this.input = document.querySelector(inputSelector);
    this.items = document.querySelectorAll(itemSelector);
    this.nameSelector = nameSelector;
  }

  init() {
    this.input.addEventListener("keyup", () => {
      const filter = this.input.value.toUpperCase();
      this.items.forEach((item) => {
        const name = item.querySelector(this.nameSelector);
        const txtValue = name.textContent.toUpperCase();
        if (txtValue.indexOf(filter) > -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
}

const searchFilter = new SearchFilter(
  "#search",
  ".list-item",
  "p"
);

searchFilter.init();

// Add items to shopping cart

class Item {
  constructor(name, price, quantity = 1) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

class Cart {
  constructor() {
    this.items = [];
    this.checkoutButton = document.getElementById('checkoutButton');
  }

  addItem(item, quantity = 1) {
    // Check if the item is already in the cart
    const existingItemIndex = this.items.findIndex((i) => i.name === item.name && i.price === item.price);
    if (existingItemIndex >= 0) {
      // If the item exists, increment the quantity
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // Otherwise, add the item to the cart
      item.quantity = quantity;
      this.items.push(item);
    }
    this.updateCheckoutButton();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.updateCheckoutButton();
  }

  clearCart() {
    this.items = [];
    this.updateCheckoutButton();
  }

  showItems() {
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';

    if (this.items.length === 0) {
      modalBody.innerHTML = '<p>Your cart is empty</p>';
      this.checkoutButton.disabled = true; // disable checkout button
      return;
    }

    let total = 0;
    let cartItems = '';

    this.items.forEach((item, index) => {
      cartItems += `
        <div class="row mb-3">
          <div class="col-6 col-sm-6">
            <p>${item.name} - $${item.price}</p>
          </div>
          <div class="col-4 col-sm-3">
            <input class="form-control" type="number" value="${item.quantity}" min="1" max="20" onchange="updateItemQuantity(${index}, this.value)">
          </div>
          <div class="col-3 col-sm-2">
            <button class="btn btn-danger" onclick="removeItem(${index})">Remove</button>
          </div>
        </div>
      `;
      total += item.price * item.quantity;
    });

    cartItems += `<p>Total: $${total}</p>`;
    modalBody.innerHTML = cartItems;

    // Add "Empty Cart" button if there are items in the cart
    if (this.items.length > 0) {
      modalBody.innerHTML += `
        <div class="text-center">
          <button class="btn btn-danger" onclick="clearCart()">Empty Cart</button>
        </div>
      `;
      this.checkoutButton.disabled = false; // enable checkout button
    } else {
      this.checkoutButton.disabled = true; // disable checkout button
    }
  }

  updateCheckoutButton() {
    if (this.items.length === 0) {
      this.checkoutButton.disabled = true; // disable checkout button if there are no items in cart
    } else {
      this.checkoutButton.disabled = false; // enable checkout button if there are items in cart
    }
  }
}

let cart = new Cart();

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    let name = button.parentElement.querySelector('p').textContent;
    let price = parseFloat(button.parentElement.querySelector('span').textContent.slice(1));
    let item = new Item(name, price);
    cart.addItem(item);
    cart.showItems();
  });
});


function updateItemQuantity(index, quantity) {
  cart.items[index].quantity = parseInt(quantity);
  cart.showItems();
}

function removeItem(index) {
  cart.removeItem(index);
  cart.showItems();
}

function clearCart() {
  cart.clearCart();
  cart.showItems();
}


// Get Item Details
const itemImages = document.querySelectorAll('.item-image');

// add click event listener to each item image
itemImages.forEach((itemImage) => {
  itemImage.addEventListener('click', () => {
    // get item description and stock data
    const itemDescription = itemImage.getAttribute('data-description');
    const itemStock = itemImage.getAttribute('data-in-stock');
    const itemTitle = itemImage.getAttribute('data-title');

    // update modal content with item data
    const itemTitleContainer = document.querySelector('.item-title');
    itemTitleContainer.textContent = `Title: ${itemTitle}`;

    const itemDescriptionContainer = document.querySelector('.item-description');
    itemDescriptionContainer.textContent = `Description: ${itemDescription}`;

    const itemStockContainer = document.querySelector('.item-stock');
    itemStockContainer.textContent = `In Stock: ${itemStock}`;

    // show modal
    const modal = document.getElementById('item-modal');
    modal.classList.add('show');
    modal.style.display = 'block';

    // add click event listener to close button
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.style.display = 'none';
    });
    // add click event listener to document to close modal when clicking outside of it
    document.addEventListener('click', (event) => {
    const modal = document.getElementById('item-modal');
      if (event.target === modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
    
  });
});


//Nav filter
// Get the dropdown element
const dropdown = document.querySelector('.dropdown-menu');

// Listen for a click event on the dropdown
dropdown.addEventListener('click', (event) => {
  // Prevent the default link behavior
  event.preventDefault();

  // Get the selected category
  const category = event.target.dataset.category;
  
  // Get all the list items in the container
  const items = document.querySelectorAll('.container.items .list-item');

  // Loop through each list item
  items.forEach(item => {
    // Get the image element
    const imgElement = item.querySelector('img');

    // Check if the list item contains an image element and if its category matches the selected category
    if (imgElement && imgElement.dataset.category === category) {
      // Show the list item
      item.style.display = 'block';
    } else {
      // Hide the list item
      item.style.display = 'none';
    }
  });
});

// Get all the dropdown elements
const dropdowns = document.querySelectorAll('.dropdown-menu');

// Loop through each dropdown element
dropdowns.forEach((dropdown) => {
  // Listen for a click event on the dropdown
  dropdown.addEventListener('click', (event) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Get the selected category
    const category = event.target.dataset.category;

    // Get all the list items in the container
    const items = document.querySelectorAll('.container.items .list-item');

    // Loop through each list item
    items.forEach(item => {
      // Get the image element
      const imgElement = item.querySelector('img');

      // Check if the list item contains an image element and if its category matches the selected category
      if (imgElement && imgElement.dataset.category === category) {
        // Show the list item
        item.style.display = 'block';
      } else {
        // Hide the list item
        item.style.display = 'none';
      }
    });
  });
});

// Get all the nav links
const navLinks = document.querySelectorAll('.nav-link');

// Listen for a click event on the nav links
navLinks.forEach(navLink => {
  navLink.addEventListener('click', (event) => {
    // Get the selected category
    const category = event.target.dataset.category;

    // Check if the clicked link is the "Home" link
    if (event.target.href === window.location.href) {
      return;
    }

    // Prevent the default link behavior
    event.preventDefault();

    // Get all the list items in the container
    const items = document.querySelectorAll('.container.items .list-item');

    // Loop through each list item
    items.forEach(item => {
      // Get the image element
      const imgElement = item.querySelector('img');

      // Check if the list item contains an image element and if its category matches the selected category
      if (imgElement && imgElement.dataset.category === category) {
        // Show the list item
        item.style.display = 'block';
      } else {
        // Hide the list item
        item.style.display = 'none';
      }
    });
  });
});



//Enable add button if in stock otherwise disable
class ItemList {
  constructor(selector) {
    this.selector = selector;
    this.listItems = document.querySelectorAll(selector);
  }

  updateStock() {
    this.listItems.forEach(item => {
      const inStock = item.querySelector('.item-image').getAttribute('data-in-stock');
      const addButton = item.querySelector('.add-to-cart');

      if (inStock === 'No') {
        addButton.disabled = true;
      } else {
        addButton.disabled = false;
      }
    });
  }
}

const myItemList = new ItemList('.list-item');
myItemList.updateStock();
























