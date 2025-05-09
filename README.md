# Riwi-Barranquilla

# Riwi - Sistema de Gestión de Inventario

## Descripción

Riwi es un programa de consola en Python diseñado para gestionar el inventario de productos de forma sencilla y segura. Permite agregar, consultar, actualizar y eliminar productos, así como calcular el valor total del inventario.

## Características

Validación de entradas:

    Nombre de producto sin espacios y no vacío.
    Precio unitario como flotante positivo.
    Cantidad como entero positivo.
   
Operaciones CRUD:

    Agregar producto**: Inserta un nuevo producto si no existe.
    Consultar producto**: Busca y muestra información de un producto.
    Actualizar precio**: Modifica el precio de un producto existente.
    Eliminar producto**: Borra un producto del inventario.
    
Visualización y cálculo:

    Mostrar el inventario completo.
    Calcular el valor total (precio × cantidad) de todos los productos.
    Interfaz interactiva**: Menú de opciones que se adapta al estado del inventario.
    Limpieza de pantalla**: El terminal se limpia antes de mostrar el menú principal.

## Requisitos

    Python 3.8 o superior

## Estructura del proyecto

    riwi/
    ├── main.py           # Punto de entrada del programa
    ├── src/
    │   └── utils.py      # Módulo con funciones auxiliares y validaciones
    └── README.md         # Documentación del proyecto


## Instalación y ejecución

1. Clona el repositorio:

   git clone [https://github.com/tu-usuario/riwi.git](https://github.com/tu-usuario/riwi.git)
   cd riwi


2. (Opcional) Crea y activa un entorno virtual:
 
python -m venv venv
# Windows
env\Scripts\activate
# macOS/Linux
source venv/bin/activate

3. Ejecuta el programa:

python main.py


## Uso

Al iniciar el programa, se mostrará un menú con las siguientes opciones:

    1. Añadir productos**: Solicita nombre, precio y cantidad para crear un nuevo registro.
    2. Consultar producto**: Permite buscar un producto por nombre.
    3. Actualizar precio**: Solicita nombre y nuevo precio para un producto existente.
    4. Eliminar producto**: Borra un producto del inventario.
    5. Mostrar inventario**: Muestra la lista completa de productos.
    6. Calcular valor total**: Muestra la suma total (precio × cantidad) de los productos.
    7. Salir: Cierra el programa.

Cada opción validará las entradas para evitar datos inválidos.

## Ejemplo de ejecución
python main.py

Bienvenido al sistema de Gestión de Inventario Riwi

--- Menú de opciones ---
1. Añadir productos.
Elija una opción: 1

Ingrese el nombre del producto: Cuaderno
Ingrese el precio del producto: 2500
Ingrese la cantidad del producto: 3
Cuaderno: 2500.0 x 3 = 7500.0

--- Menú de opciones ---
1. Añadir productos.
2. Consultar producto.
3. Actualizar precio.
4. Eliminar producto.
5. Mostrar inventario.
6. Calcular valor total del inventario.
7. Salir.
Elija una opción: 6
El valor total del inventario es: 7500.0

--- Menú de opciones ---
Elija una opción: 7
Gracias por usar nuestros servicios. ¡Hasta luego!


