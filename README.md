# Riwi-Barranquilla


# Proyecto de Cálculo de Precios de Productos con Descuento
Mi proyecto es un programa que permite calcular el costo total de un producto, teniendo en cuenta su precio unitario, la cantidad deseada y un posible descuento. mi código solicita al usuario ingresar los detalles del producto, valida la entrada de datos, y calcula el costo total de la compra, aplicando un descuento si es necesario.


## Descripción de mi Proyecto
Mi programa interactúa con el usuario para obtener información sobre un producto (nombre, precio, cantidad y descuento), valida los datos de entrada para asegurarse de que sean correctos y realiza cálculos para determinar el costo total de la compra.

Mi programa ofrece la opción de aplicar un descuento sobre el precio total si el usuario lo solicita. Finalmente, muestra un resumen con todos los datos ingresados y el costo total de la compra.

## Características Principales

- Validación de entradas: Mi programa verifica que el precio y la cantidad sean números válidos y positivos.
- Opcionalidad de descuento: El usuario puede decidir si aplicar un descuento al precio total de la compra.
- Cálculo automático: Mi programa calcula el precio final de acuerdo con las entradas del usuario.
- Formato de salida: El resultado final se presenta con dos decimales para una mayor claridad.


## Cómo Usar Mi Proyecto

1. Mi programa solicitará que ingreses el **nombre del producto**.
2. Luego, te pedirá el **precio unitario** del producto. Debes ingresar un número positivo.
3. A continuación, ingresarás la **cantidad** del producto, también un número positivo.
4. Se te preguntará si deseas aplicar un **descuento**. Responde con "si" o "no".
5. Si seleccionas "si", deberás ingresar el **descuento** en porcentaje (un número entre 1 y 100).
6. Finalmente calculará el costo total y te mostrará un resumen.

## Ejemplo de ejecucion

```text
Ingrese el nombre del producto: Laptop
Ingrese el precio unitario del producto: 500
Ingrese la cantidad del producto: 2
Se le aplicará descuento (si/no): si
Ingrese el descuento: 10

--------------------------------------------------------
                    TIENDA RIWI                   
--------------------------------------------------------
El nombre del producto es: Laptop 
El precio unitario es: $500
La cantidad del producto es: 2
El descuento aplicado es: 10 %
Precio del producto sin descuento 1000
El costo total del producto Laptop es: $900.00
