"""
Programa de gestión de inventario Riwi.
Permite agregar, consultar, actualizar y eliminar productos,
mostrar el inventario y calcular su valor total.
Se implementa validación de entradas (nombre sin espacios,
precios como float positivos y cantidades como enteros positivos),
y limpieza de pantalla al ejecutar cada acción.
"""
import os

# Inventario global
inventario = []

# Función para limpiar la pantalla según el sistema operativo
def limpiar_pantalla():
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')

# Validaciones de entrada
def validar_nombre(nombre):
    #Valida que el nombre no esté vacío y no contenga espacios
    return bool(nombre) and ' ' not in nombre


def validar_precio(cad):
    #Valida que la cadena represente un float positivo
    try:
        val = float(cad)
        return val >= 0, val
    except ValueError:
        return False, None


def validar_cantidad(cad):
    #Valida que la cadena represente un entero positivo
    try:
        val = int(cad)
        return val >= 0, val
    except ValueError:
        return False, None

# Añadir un producto al inventario
def agregar_producto(nombre, precio, cantidad):
    #Agrega un nuevo producto si no existe
    for prod in inventario:
        if prod["nombre"] == nombre:
            print("El producto ya existe en el inventario.")
            return
    inventario.append({"nombre": nombre, "precio": precio, "cantidad": cantidad})
    print(f"{nombre}: {precio} x {cantidad} = {precio*cantidad}")

# Consultar un producto por nombre
def consultar_producto(nombre):
    # Retorna el diccionario del producto o None si no existe
    for prod in inventario:
        if prod["nombre"] == nombre:
            return prod
    return None

# Actualizar precio de un producto existente
def actualizar_precio(nombre, nuevo_precio):
    # Actualiza el precio si el producto existe
    for prod in inventario:
        if prod["nombre"] == nombre:
            prod["precio"] = nuevo_precio
            print(f"El precio del producto '{nombre}' ha sido actualizado a {nuevo_precio}")
            return
    print("Producto no encontrado.")

# Eliminar un producto del inventario
def eliminar_producto(nombre):
    # Elimina el producto si existe
    for prod in inventario:
        if prod["nombre"] == nombre:
            inventario.remove(prod)
            print(f"El producto '{nombre}' ha sido eliminado.")
            return
    print("Producto no encontrado.")

# Lambda para calcular valor total
calcular_valor_total = lambda: sum(p["precio"] * p["cantidad"] for p in inventario)

# Mostrar todo el inventario
def mostrar_inventario():
    # Imprime todos los productos del inventario
    if not inventario:
        print("El inventario está vacío.")
        return
    print("--- Inventario completo ---")
    for p in inventario:
        print(f"{p['nombre']}, Precio: {p['precio']}, Cantidad: {p['cantidad']}")
