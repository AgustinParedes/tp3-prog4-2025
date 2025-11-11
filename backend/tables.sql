--Tabla médicos
CREATE TABLE `medicos` (
  `id_medicos` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `especialidad` VARCHAR(45) NOT NULL,
  `matricula` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_medicos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--Tabla pacientes
CREATE TABLE `pacientes` (
  `id_pacientes` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `dni` VARCHAR(20) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `obra_social` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_pacientes`),
  UNIQUE KEY `uq_dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--Tabla turnos
CREATE TABLE `turnos` (
  `id_turnos` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `estado` ENUM('pendiente','atendido','cancelado') NOT NULL DEFAULT 'pendiente',
  `observaciones` VARCHAR(255) DEFAULT NULL,
  `id_paciente` INT NOT NULL,
  `id_medico` INT NOT NULL,
  PRIMARY KEY (`id_turnos`),
  KEY `fk_medico_id_idx` (`id_medico`),
  KEY `fk_paciente_id_idx` (`id_paciente`),
  CONSTRAINT `fk_medico_id`
    FOREIGN KEY (`id_medico`)
    REFERENCES `medicos` (`id_medicos`),
  CONSTRAINT `fk_paciente_id`
    FOREIGN KEY (`id_paciente`)
    REFERENCES `pacientes` (`id_pacientes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--Tabla usuarios
CREATE TABLE `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;