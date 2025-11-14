import { useState, useEffect } from "react";
import { useAuth } from "./Auth.jsx";

// Este componente es el formulario para "Crear" y "Modificar" Pacientes.
// 1. paciente: (null si es "Crear", un objeto si es "Modificar")
// 2. onClose: Función para cerrar el modal
// 3. onSuccess: Función para refrescar la lista de pacientes
export const PacienteForm = ({ paciente, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  // Usamos un estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    obra_social: "",
  });

  // Si nos pasan un paciente (para modificar), llenamos el formulario
  useEffect(() => {
    if (paciente) {
      // Formateamos la fecha para el input type="date" (YYYY-MM-DD)
      const fechaFormateada = paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento).toISOString().split("T")[0] : "";

      setFormData({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
        fecha_nacimiento: fechaFormateada,
        obra_social: paciente.obra_social,
      });
    } else {
      // Si no hay paciente (es "Crear"), reseteamos el form
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        fecha_nacimiento: "",
        obra_social: "",
      });
    }
  }, [paciente]); // Este efecto se ejecuta cuando la prop 'paciente' cambia

  // Manejador para actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para encontrar errores de validación (estilo profesor)
  const getError = (field) => {
    return errores
      ?.filter((e) => e.path === field)
      .map((e) => e.msg)
      .join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]); // Limpiamos errores previos

    try {
      // Definimos la URL y el Método (Crear vs Modificar)
      const url = paciente
        ? `http://localhost:3000/pacientes/${paciente.id_pacientes}` // Modificar (PUT)
        : "http://localhost:3000/pacientes"; // Crear (POST)
      const method = paciente ? "PUT" : "POST";

      const response = await fetchAuth(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Errores de validación del backend
          setErrores(data.errores || []);
        } else {
          // Otro tipo de error
          throw new Error(data.message || "Error al guardar el paciente");
        }
      } else {
        // ¡Éxito!
        onSuccess(); // Llamamos a la función para refrescar la lista
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    // Usamos <dialog open> para el modal (estilo profesor)
    <dialog open>
      <article>
        <header>
          {/* Cerramos el modal llamando a la prop onClose */}
          <a
            href="#close"
            aria-label="Close"
            className="close"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          ></a>
          <h2>{paciente ? "Modificar Paciente" : "Crear Paciente"}</h2>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label>
              Nombre
              <input name="nombre" value={formData.nombre} onChange={handleChange} required aria-invalid={getError("nombre") ? "true" : "false"} />
              {getError("nombre") && <small style={{ color: "red" }}>{getError("nombre")}</small>}
            </label>
            <label>
              Apellido
              <input name="apellido" value={formData.apellido} onChange={handleChange} required aria-invalid={getError("apellido") ? "true" : "false"} />
              {getError("apellido") && <small style={{ color: "red" }}>{getError("apellido")}</small>}
            </label>
            <label>
              DNI
              <input name="dni" value={formData.dni} onChange={handleChange} required aria-invalid={getError("dni") ? "true" : "false"} />
              {getError("dni") && <small style={{ color: "red" }}>{getError("dni")}</small>}
            </label>
            <label>
              Fecha de Nacimiento
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required aria-invalid={getError("fecha_nacimiento") ? "true" : "false"} />
              {getError("fecha_nacimiento") && <small style={{ color: "red" }}>{getError("fecha_nacimiento")}</small>}
            </label>
            <label>
              Obra Social
              <input name="obra_social" value={formData.obra_social} onChange={handleChange} required aria-invalid={getError("obra_social") ? "true" : "false"} />
              {getError("obra_social") && <small style={{ color: "red" }}>{getError("obra_social")}</small>}
            </label>
          </fieldset>

          <footer>
            <div className="grid">
              <button
                type="button"
                className="secondary"
                onClick={() => onClose()} // Botón de cancelar
              >
                Cancelar
              </button>
              <button type="submit">{paciente ? "Guardar Cambios" : "Crear"}</button>
            </div>
          </footer>
        </form>
      </article>
    </dialog>
  );
};
