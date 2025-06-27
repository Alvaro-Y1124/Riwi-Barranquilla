/*
GLOBAL VARIABLES AND DATA STRUCTURES:
    This block starts the main data structures that will be
    used to store product information:
    - productos: Object that stores all products with unique ID
    - productosSet: Set to make sure products are unique
    - categoriasMap: Map to connect categories with products
    - siguiente_id: Counter to make unique IDs automatically
*/
let productos = {}; // Main object to store products
let productosSet = new Set(); // Set to avoid duplicates
let categoriasMap = new Map(); // Map for categories and products
let siguiente_id = 1; // ID counter that goes up

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
  const nombre = document.getElementById("nombre_producto").value.trim();
  const precio = parseFloat(document.getElementById("precio_producto").value);
  const categoria = document.getElementById("categoria_producto").value;

// Check required fields
  if (!nombre || isNaN(precio) || precio <= 0 || !categoria) {
    alert("Please complete all fields correctly.");
    return;
  }

// Create product object with unique ID that goes up
  const producto = {
    id: siguiente_id++,
    nombre: nombre,
    precio: precio,
    categoria: categoria,
  };

// STEP 1: Store in the main object
  productos[`producto_${producto.id}`] = producto;

// STEP 2: Add to Set (automatically avoids duplicates)
  productosSet.add(JSON.stringify(producto));

// STEP 3: Store in Map connecting category with product
  if (categoriasMap.has(categoria)) {
    // If category already exists, add product to array
    categoriasMap.get(categoria).push(producto.nombre);
  } else {
// If it's a new category, create new array with the product
    categoriasMap.set(categoria, [producto.nombre]);
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
  const mensaje = document.getElementById("mensaje_confirmacion");
  mensaje.classList.add("show");

// Hide message after 3 seconds
  setTimeout(() => {
    mensaje.classList.remove("show");
  }, 3000);
}

/*
FUNCTION: ENABLE SHOW BUTTON
    Activates visually the "Show Products" button when data is available
    Changes the button style from disabled to enabled
*/
function habilitarBotonMostrar() {
  const btnMostrar = document.getElementById("btn_mostrar");
  btnMostrar.classList.add("enabled");
  btnMostrar.style.opacity = "1";
  btnMostrar.style.cursor = "pointer";
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
  if (Object.keys(productos).length === 0) {
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
  const contenedor = document.getElementById("productos_objeto");
  contenedor.innerHTML = ""; // Clean previous content

// Loop through products object using for...in
  for (let clave in productos) {
    const producto = productos[clave];

    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
        <strong>ID:</strong> ${producto.id} | 
        <strong>Name:</strong> ${producto.nombre} | 
        <strong>Price:</strong> ${producto.precio.toFixed(2)} | 
        <strong>Category:</strong> ${producto.categoria}
    `;
    contenedor.appendChild(itemDiv);
  }
}

/*
FUNCTION: SHOW PRODUCTS SET (for...of):
    Loops through products Set using for...of loop
    The Set makes sure there are no duplicate products
    Parses each JSON element to show the information
*/
function mostrarProductosSet() {
  const contenedor = document.getElementById("productos_set");
  contenedor.innerHTML = ""; // Clean previous content

// Loop through Set using for...of
  for (let productoJSON of productosSet) {
    const producto = JSON.parse(productoJSON);

    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
                    <strong>ID:</strong> ${producto.id} | 
                    <strong>Name:</strong> ${producto.nombre} | 
                    <strong>Price:</strong> ${producto.precio.toFixed(2)} | 
                    <strong>Category:</strong> ${producto.categoria}
                    <small style="color: #666; display: block; margin-top: 5px;">
                        Unique product verified by Set
                    </small>
                `;
    contenedor.appendChild(itemDiv);
  }
}

/*
FUNCTION: SHOW CATEGORIES MAP (forEach):
    Loops through categories Map using forEach method
    Shows each category with all connected products
    The Map allows connecting multiple values (products) to one key (category)
*/
function mostrarCategoriasMap() {
  const contenedor = document.getElementById("productos_map");
  contenedor.innerHTML = ""; // Clean previous content

// Loop through Map using forEach
  categoriasMap.forEach((productos, categoria) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "data-item";
    itemDiv.innerHTML = `
        <strong>Category:</strong> ${categoria}
        <br>
        <strong>Products:</strong> ${productos.join(", ")}
        <small style="color: #666; display: block; margin-top: 5px;">
            Total products in this category: ${
              productos.length
            }
        </small>
    `;
    contenedor.appendChild(itemDiv);
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
      const precio = parseFloat(this.value);
      if (precio < 0) {
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
  const totalProductos = Object.keys(productos).length;
  const totalCategorias = categoriasMap.size;
  const precioPromedio =
    Object.values(productos).reduce((sum, prod) => sum + prod.precio, 0) /
    totalProductos;

  console.log(`SYSTEM STATISTICS:
            - Total products: ${totalProductos}
            - Total categories: ${totalCategorias}
            - Average price: ${precioPromedio.toFixed(2)}`);
}