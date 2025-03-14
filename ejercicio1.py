nombre_producto = input("ingrese el nombre del producto: ")
nombrer_poducto = str(nombre_producto) 



validacion = False 

while True:
    try:
        #Aqui solicito la entrada del usuario
        precio = valor = input("ingrese el precio unitario del producto: ") 
        
        #convertierto la entrada a float
        try:
            precio = float(precio)
        except ValueError:
            print("Ingrese precio valido, que no sea negativo")
            continue

        # verifico si el valor ingresado es un entero o un decimal
        if( validacion and precio != int(precio)) and ():
            print("El valor debe ser un entero, vuela a ingresar nuevamente ")   
            continue

        # Verifico que el valor no sea negativo
        if precio > 0:
            # Devuelvo el valor como entero o flotante según se requiera
            if validacion:
                precio = int(precio)
            break  # Termina el bucle después de obtener un valor válido
        else:
            print("Ingrese un precio valido, que no sea negativo")
            continue
    except ValueError:
        print("ingresa un precio valido que no sea negativo.")


while True:

    try:
        # Aqui solicito la entrada del usuario
        cantidad = input("ingrese la cantidad del producto: ")
        cantidad = int(cantidad) # aqui convieto el dato de str a int
        
        # Realizo la comparacion para que el usurio solo ingrese el dato indicado
        if cantidad <= 0: # valido que el dato ingresado no sea cero o menor a cero
            print("Ingrese una cantidad válida, que no sea numero negativo")
            continue
        else:
            print ("la cantida es valida")
            break

    except ValueError:
        print("Ingrese una cantidad que sea entero positivo")  # si el usurio ingresa un valor que no sea int vuelve a ejecutarse la condicion hasta que se cumpla
                                                
    
    
    # Aqui se solicita si se aplica el descuento o no
while True:
    respuesta = input("Se le aplicará descuento (si/no): ").lower() 
    if respuesta == "si" or respuesta == "no":
        break  
    else:
        print("Respuesta inválida. Por favor ingrese 'si' o 'no'.")

# Si la respuesta es "si", se le aplica el descuento
if respuesta == "si":
    while True:
       
        try:
            # Aqui solicito la entrada a el usuario
            descuento = input("ingrese el descuento: ");
            descuento = int(descuento) #aqui convierto el dato de str a int

            costo_sin_descuento = precio * cantidad; #calculo el valor sin el descuento
            costo_total = costo_sin_descuento * (descuento / 100); # calculo el valor del producto con el descuento aplicado

            descuento = descuento  
            if 0 < descuento <= 100:  #Aqui verifico si el descuento es válido (entre 1 y 100)
                print("El descuento es válido")
                break  
            else:
                print("El descuento no es válido, debe estar entre 1 y 100")
        except ValueError:
            print("El descuento debe ser un número entero")
else:
    print("El descuento no ha sido aplicado")
    costo_total = precio * cantidad #si el descuento no es aplicado se calcula esta formula
    descuento = 0 # indico que el porcentaje sea 0% al no ser aplicado por el usuario

  
# Imprimo el resultado en forma de la compra del producto
print("--------------------------------------------------------")

print("                    TIENDA RIWI                   ")
print("--------------------------------------------------------")
print(f"El nombre del producto es: {nombre_producto} ");
print(f"El precio unitario es: ${valor}");
print(f"La cantidad del producto es: {cantidad} ")
print(f"El descuento aplicado es: {descuento} %")
print(f"Precio del producto sin descuento {costo_sin_descuento}")

print(f"El costo total del producto {nombre_producto} es: ${costo_total: .2f}") ## le doy formato para que solo cuente dos decimales del valor 




