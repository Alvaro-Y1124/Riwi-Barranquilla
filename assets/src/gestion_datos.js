/*
GLOBAL VARIABLES AND DATA STRUCTURES:
    This block starts the main data structures that will be
    used to store product information:
    - products: Object that stores all products with unique ID
    - productsSet: Set to make sure products are unique
    - categoriesMap: Map to connect categories with products
    - nextId: Counter to make unique IDs automatically
*/
let products = {}; // Main object to store products
let productsSet = new Set(); // Set to avoid duplicates
let categoriesMap = new Map(); // Map for categories and products
let nextId = 1; // ID counter that goes up

/*
MAIN FUNCTION: ADD PRODUCT
    This function does:
    1. Check that all fields are complete
    2. Create a new product with unique ID
    3. Store it in the three data structures (Object, Set, Map)
    4. Show success message
    5. Enable the show data button
    6. Clean the form for the next input
*/
function agregarProducto() {
// Get the values from the form fields
  const name = document.getElementById("nombre_producto").value.trim();
  const price = parseFloat(document.getElementById("precio_producto").value);
  const category = document.getElementById("categoria_producto").value;

// Check required fields
  if (!name || isNaN(price) || price <= 0 || !category) {
    alert("Please complete all fields correctly.");
    return;
  }

// Create product object with unique ID that goes up
  const product = {
    id: nextId++,
    name: name,
    price: price,
    category: category,
  };

// STEP 1: Store in the main object
  products[`product_${product.id}`] = product;

// STEP 2: Add to Set (automatically avoids duplicates)
const uniqueKey = `${product.name}`;
if (productsSet.has(uniqueKey)) {
    alert("This product already exists!");
    return;
}
productsSet.add(uniqueKey);

// STEP 3: Store in Map connecting category with product
  if (categoriesMap.has(category)) {
    // If category already exists, add product to array
    categoriesMap.get(category).push(product.name);
  } else {
// If it's a new category, create new array with the product
    categoriesMap.set(category, [product.name]);
  }

// Show success message with animation
  mostrarMensajeConfirmacion();

// Enable the show data button
  habilitarBotonMostrar();

// Clean form for next input
  limpiarFormulario();
}

/*
FUNCTION: SHOW SUCCESS MESSAGE:       
    Shows a temporary success message when a product is added
    The message disappears automatically after 3 seconds
*/
function mostrarMensajeConfirmacion() {
  const message = document.getElementById("mensaje_confirmacion");
  message.classList.add("show");

// Hide message after 3 seconds
  setTimeout(() => {
    message.classList.remove("show");
  }, 3000);
}

/*
FUNCTION: ENABLE SHOW BUTTON
    Activates visually the "Show Products" button when data is available
    Changes the button style from disabled to enabled
*/
function habilitarBotonMostrar() {
  const showBtn = document.getElementById("btn_mostrar");
  showBtn.classList.add("enabled");
  showBtn.style.opacity = "1";
  showBtn.style.cursor = "pointer";
}

/*
FUNCTION: CLEAN FORM:
    Resets all form fields after adding a product
    Allows the user to enter a new product without deleting manually
*/
function limpiarFormulario() {
  document.getElementById("nombre_producto").value = "";
  document.getElementById("precio_producto").value = "";
  document.getElementById("categoria_producto").value = "";
}

/*
MAIN FUNCTION: SHOW DATA:
    This function runs when the user clicks "Show Products"
    Does the complete loop through the three data structures:
    1. Loop through object using for...in
    2. Loop through Set using for...of  
    3. Loop through Map using forEach
    Shows all information formatted in the interface
*/
function mostrarDatos() {
// Check that products exist before showing
  if (Object.keys(products).length === 0) {
    alert("No products to show. Add at least one product.");
    return;
  }

// Show the results section with animation
  document.getElementById("seccion_resultados").classList.add("show");

// LOOP 1: Show products from object using for...in
  mostrarProductosObjeto();

// LOOP 2: Show products from Set using for...of
  mostrarProductosSet();

// LOOP 3: Show categories from Map using forEach
  mostrarCategoriasMap();
}

/*
FUNCTION: SHOW PRODUCTS OBJECT (for...in):
    Loops through products object using for...in loop
    Shows each product with all its detailed information
    This method access object properties directly
*/
function mostrarProductosObjeto() {
  const container = document.getElementById("productos_objeto");
  container.innerHTML = ""; // Clean previous content

// Loop through products object using for...in
  for (let key in products) {
    const product = products[key];

    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
        <strong>ID:</strong> ${product.id} | 
        <strong>Name:</strong> ${product.name} | 
        <strong>Price:</strong> ${product.price.toFixed(2)} | 
        <strong>Category:</strong> ${product.category}
    `;
    container.appendChild(itemDiv);
  }
}

/*
FUNCTION: SHOW PRODUCTS SET (for...of):
    Loops through products Set using for...of loop
    The Set makes sure there are no duplicate products
    Shows the unique keys stored in the Set
*/
function mostrarProductosSet() {
  const container = document.getElementById("productos_set");
  container.innerHTML = ""; // Clean previous content

// Loop through Set using for...of
  for (let uniqueKey of productsSet) {
    // Split the unique key to get product info
    const parts = uniqueKey.split('-');
    const name = parts[0];

    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
                    <strong>Name:</strong> ${name} 
                    <small style="color: #666; display: block; margin-top: 5px;">
                        Unique product verified by Set
                    </small>
                `;
    container.appendChild(itemDiv);
  }
}

/*
FUNCTION: SHOW CATEGORIES MAP (forEach):
    Loops through categories Map using forEach method
    Shows each category with all connected products
    The Map allows connecting multiple values (products) to one key (category)
*/
function mostrarCategoriasMap() {
  const container = document.getElementById("productos_map");
  container.innerHTML = ""; // Clean previous content

// Loop through Map using forEach
  categoriesMap.forEach((productList, category) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
        <strong>Category:</strong> ${category}
        <br>
        <strong>Products:</strong> ${productList.join(", ")}
        <small style="color: #666; display: block; margin-top: 5px;">
            Total products in this category: ${
              productList.length
            }
        </small>
    `;
    container.appendChild(itemDiv);
  });
}

/*

FUNCTION: REAL TIME VALIDATION:
    Adds real time checking while the user types
    Makes user experience better by giving feedback right away
*/
document.addEventListener("DOMContentLoaded", function () {
// Validation for price field
  document
    .getElementById("precio_producto")
    .addEventListener("input", function () {
      const price = parseFloat(this.value);
      if (price < 0) {
        this.style.borderColor = "#ff4444";
      } else {
        this.style.borderColor = "#ddd";
      }
    });

// Validation for name field
document.getElementById("nombre_producto").addEventListener("input", function () {
      if (this.value.trim().length < 2) {
        this.style.borderColor = "#ff4444";
      } else {
        this.style.borderColor = "#4CAF50";
      }
    });
});

/*
ADDITIONAL UTILITY FUNCTIONS:
    Extra functions that make the system work better
*/

// Function to allow adding product with Enter key
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    agregarProducto();
  }
});

// Function to show quick statistics (extra functionality)
function mostrarEstadisticas() {
  const totalProducts = Object.keys(products).length;
  const totalCategories = categoriesMap.size;
  const averagePrice =
    Object.values(products).reduce((sum, prod) => sum + prod.price, 0) /
    totalProducts;

  console.log(`SYSTEM STATISTICS:
            - Total products: ${totalProducts}
            - Total categories: ${totalCategories}
            - Average price: ${averagePrice.toFixed(2)}`);
}  
