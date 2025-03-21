#1 Se solicita a el usuario ingresar una lista de calificaciones de 0 a 100 verificando que no ingrese numeros negativos y ni un string
#2 Se valida la calificaciones optenidas por el usuario
#3 Se calcucula y se muestra el promedio a el usuario de las calificaciones optenidas 
#4 Se compara el promedio de las calificaciones del estudiante con el promedio que el usuario ingrese
#4.1 Se valida que el promedio que el usuario ingrese no sea un promedio negativo y ni un string 
#5 Se calcula las cuantas notas son mayores que la nota que el usuario ingrese y se muestras cuales son
#5.1 Se valida que el valor de la nota no sea negativo y que no sea string
#6 Se calcula cuantas veces se repitio una nota especifica de las calificaciones ingresadas por un valor del usuario
#6.1 Se valida que el valor de la nota especifica ingresada por el usario no sea negativa ni tampoco un string
#7 Creo un menu lo cual interactua con el usuario ingresando los datos de estudiante
#7.1 valido la opcion que el usuario ingrese no sea un valor negativo y que no sea un dato string
#8 Imprimo los resultados obtenidos por el usario ingresado veridicando el estado total del estudiante
#8.1 si el usuario por error al momento de interactuar con el menu ingresa la opcion de sali sin haber ingresado los datos especificos se le imprime pero se le indica que no hay datos 

lista_calificaciones = []

def lista_calificacion():
    while True:
        try:
           
            calificaciones = input("Ingrese las calificaciones (separadas por comas): ")
            calificaciones = calificaciones.split(",") # aqui se divide la cadena en subcadenas agregando la coma. 
         

            for calificacion in calificaciones: 
                while True:
                    try:
                        calificacion = float(calificacion.strip())  #Convieto a float y utilizo strip para eliminar espacion entre los numeros
                        if calificacion < 0 or calificacion > 100:
                            print("No se puede ingresar una calificación negativa, el rango es de 0 a 100.")
                            break 
                        else:
                            lista_calificaciones.append(calificacion) # aqui agrego los datos a la lista del de calificaciones utilzando el metododo append
                        break  
                    except ValueError:
                        print("Ingrese un valor de calificación numérico válido.")
                    break  
        
            if len(lista_calificaciones):  #con el metodo len corro toda la lista luego la imprimo
                print(f"la lista de las calificaciones ingresadas son: {lista_calificaciones}")
                break 
            else:
                continue  
        except ValueError:
            print("Error inesperado")


def promedio_notas_ingresasdas():
    global promedio # convierto la variable promedio a global para utilizarla a futuro
    suma= 0
    for i in lista_calificaciones:
        suma += float(i)
        promedio= suma/len(lista_calificaciones)
    print(f"El promedio de las calificaciones del estudiante es: {promedio}")
    
    



def promedio_de_aprobacion():
    global estado_aprobado 
    
    
    while True:
        try:
        
            calificacion_aprobacion = input("ingrese la calificacion aprobatoria de 0 a 100: ")
            calificacion_aprobacion = int(calificacion_aprobacion)
            if calificacion_aprobacion < 0 or calificacion_aprobacion > 100:
                print("no se puede ingresar una calificacion aprobatoria negativa, el rango es de 0 a 100 ")
                continue
            if calificacion_aprobacion <= promedio:
                estado_aprobado = "Aprobado, paso el semestre"
                print("El estudiante aprobado el semestre")
                break
            else:
                estado_aprobado = "Reprobado, perdio el semestre"
                print("El estudiante reprobo el semestre")    
            break
        except ValueError:
            print("ingrese un promedio numerico aprobatorio valido")              




def calificaciones_mayores():
    global contador
    global valor
    calificaciones_mayore = [] # creo una nueva que sera como alamcenamiento de las notas mayores a una nota expecifica que usuario ingrese 
    while True:
        try:
            valor = input("ingrese una nota especifica para verificar cuantas son mayores a esta :")
            valor = float(valor)
            contador= 0
            i = 0
            if valor < 0:
                print("no se puede comparar valores negativos, porfavor ingrese valores positivo")
                continue
            else:
                while i < len(lista_calificaciones):
                    if lista_calificaciones[i] > valor:
                        contador += 1
                        calificaciones_mayore.append(lista_calificaciones[i]) # aqui le agrego las calificaciones encontradas mayores a que el usario ingreso para comparar
                    i += 1
            break
        except ValueError:
            print("Porfavor ingrese valores numericos validos")           
    print(f"Las calificaciones mayores a {valor} se encontraron {contador} y son : {calificaciones_mayore}")




def frecuencia_de_calificacioes():
    global contador_frecuencia
    while True:
        try:
            frecuencia_valor = input("ingrese una calificacion para verificar su frecuencia: ")
            frecuencia_valor = int(frecuencia_valor)
            contador_frecuencia = 0
            if frecuencia_valor < 0:
                print("No se puede ejecutar valores negativos, porfavor ingrese valores postivos")
                continue
            else:
                for i in lista_calificaciones:
                    if int(i) == frecuencia_valor:
                        contador_frecuencia += 1
            break
        except ValueError:
            print("Porfavor ingrese valores numericos validos")
    print(f"La frecuencia de la calificacion {frecuencia_valor} son: {contador_frecuencia}")
    

promedio = "No hay datos"
estado_aprobado = "No hay datos"
contador = "No hay datos"
contador_frecuencia = "No hay datos"
valor = "No hay datos"

   
def menu(): # creo un menu para que el usuario interactue, ingrese los datos correspondiente del estudiante
    global opcion
    print(f"-"*60)
    print("              Elija una opcion a ejecutar"                 )
    print(f"-"*60)
    print("1. Actualizar la lista de Calificaciones")
    print("2. Calcular el Promedio de las calificaiones")
    print("3. Verificar el estado de aprobacion")
    print("4. Contar las calificaciones mayores")
    print("5. Verificar la cantidad de una calificacion ingresada")
    print("6. Salir")
    print("-"*60)
    while True:
        opcion = input("Seleccione una opción: ")
        try:
            opcion = int(opcion)
            break
        except ValueError:
            print("ingrese una opcion numerica valida")
    
    
    if opcion == 1:
        lista_calificaciones.clear()
        lista_calificacion()
    elif opcion == 2:
        promedio_notas_ingresasdas()
    elif opcion == 3:
        promedio_de_aprobacion()
    elif opcion == 4:
        calificaciones_mayores()
    elif opcion == 5:
        frecuencia_de_calificacioes()
    elif opcion == 6:
        print("saliendo del programa...")
        return False  
    else:
      print("Opción inválida. Por favor, elige una opción válida.")
    return True  
      

lista_calificacion()
lista_calificaciones

salir = True  # aqui asta que la opcion salir sea verdadera automaticamente se sale del sistema de lo cotrario sigue retornando
while salir:
    salir = menu()
    
    
    
print(f"-"*60)
print("                         Resutados                                         ")
print(f"-"*60)    
print(f"Las calificaciones ingresadas fueron: {lista_calificaciones}")
print(f"El promedio de las calificaciones ingresadas es: {promedio}")
print(f"El estado del estudiante mediante el promedio de sus notas fue: {estado_aprobado}")
print(f"La calificacion mayore a {valor} fueron: {contador}")
print(f"La calificacion con mayor frecuencia fue: {contador_frecuencia}")
    
