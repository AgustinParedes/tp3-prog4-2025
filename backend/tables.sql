--Tabla médicos
CREATE TABLE `medicos` (
  `id_medicos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `especialidad` varchar(45) NOT NULL,
  `matricula` varchar(45) NOT NULL,
  PRIMARY KEY (`id_medicos`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

--Tabla pacientes
CREATE TABLE `pacientes` (
  `id_pacientes` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `obra_social` varchar(45) NOT NULL,
  PRIMARY KEY (`id_pacientes`),
  UNIQUE KEY `uq_dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

--Tabla turnos
CREATE TABLE `turnos` (
  `id_turnos` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('pendiente','atendido','cancelado') NOT NULL DEFAULT 'pendiente',
  `observaciones` varchar(255) DEFAULT NULL,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  PRIMARY KEY (`id_turnos`),
  KEY `fk_medico_id_idx` (`id_medico`),
  KEY `fk_paciente_id_idx` (`id_paciente`),
  CONSTRAINT `fk_medico_id` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medicos`),
  CONSTRAINT `fk_paciente_id` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_pacientes`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

--Tabla usuarios
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci