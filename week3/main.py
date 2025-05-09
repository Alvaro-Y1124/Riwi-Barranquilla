from src.utils import *  # para modular el programa

# Programa principal
        
def main():
    limpiar_pantalla()
    print("Bienvenido al sistema de Gestión de Inventario Riwi")
    while True:
        print("\n--- Menú de opciones ---")
        print("1. Añadir productos.")
        if inventario:
            print("2. Consultar producto.")
            print("3. Actualizar precio.")
            print("4. Eliminar producto.")
            print("5. Mostrar el inventario.")
            print("6. Calcular el valor total del inventario.")
            print("7. Salir.")
        opcion = input("Elija una opción: ").strip()

        match opcion:
            case "1":
                # Validación de nombre (sin espacios)
                while True:
                    nombre = input("Ingrese el nombre del producto: ").strip()
                    if validar_nombre(nombre):
                        break
                    print("Nombre inválido. No use espacios.")
                # Validación de precio
                while True:
                    cad = input("Ingrese el precio del producto: ").strip()
                    ok, precio = validar_precio(cad)
                    if ok:
                        break
                    print("Precio inválido, Debe ser un número positivo.")
                # Validación de cantidad
                while True:
                    cad = input("Ingrese la cantidad del producto: ").strip()
                    ok, cantidad = validar_cantidad(cad)
                    if ok:
                        break
                    print("Cantidad inválida, Debe ser un entero positivo.")
                agregar_producto(nombre, precio, cantidad)

            case "2" if inventario:
                nombre = input("Ingrese el nombre del producto a consultar: ").strip()
                prod = consultar_producto(nombre)
                if prod:
                    print(f"Producto: {prod['nombre']}, Precio: {prod['precio']}, Cantidad: {prod['cantidad']}")
                else:
                    print("Producto no encontrado.")

            case "3" if inventario:
                nombre = input("Ingrese el nombre del producto a actualizar: ").strip()
                if not consultar_producto(nombre):
                    print("Producto no encontrado. No se solicitará precio.")
                else:
                    while True:
                        cad = input("Ingrese el nuevo precio: ").strip()
                        ok, nuevo = validar_precio(cad)
                        if ok:
                            break
                        print("Precio inválido. Debe ser un número positivo.")
                   
                    actualizar_precio(nombre, nuevo)

            case "4" if inventario:
                nombre = input("Ingrese el nombre del producto a eliminar: ").strip()
                
                eliminar_producto(nombre)

            case "5" if inventario:
                mostrar_inventario()

            case "6" if inventario:
                print(f"El valor total del inventario es: {calcular_valor_total()}")

            case "7" if inventario:
                print("Gracias por usar nuestros servicios. ¡Hasta luego!")
                break

            case _:
                print("Opción no válida, intente de nuevo.")

if __name__ == "__main__":
    main()
