USE `biblioteca_2.0`;

-- tabla de los usuario de la biblioteca
CREATE TABLE usuarios (
    usuario_id INT AUTO_INCREMENT,
    nombre_usuario VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    PRIMARY KEY(usuario_id)
);

-- tabla de los autores
CREATE TABLE autores (
    autor_id INT AUTO_INCREMENT,
    nombre_autor VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY(autor_id)
);


-- talbla de libroswd
CREATE TABLE libros (
    libro_id INT AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    año_publicacion YEAR,
    autor_id INT NOT NULL,
    PRIMARY KEY(libro_id),
    FOREIGN KEY (autor_id) REFERENCES autores(autor_id)
);


-- tabla de estados
CREATE TABLE estados (
    estado_id INT AUTO_INCREMENT,
    nombre_estado VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100),
    PRIMARY KEY(estado_id)
);



CREATE TABLE prestamos (
    prestamo_id INT AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE,
    estado_id INT NOT NULL,
    PRIMARY KEY(prestamo_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY (libro_id) REFERENCES libros(libro_id),
    FOREIGN KEY (estado_id) REFERENCES estados(estado_id)
);




