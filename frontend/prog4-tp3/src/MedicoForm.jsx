import { useState, useEffect } from "react";
import { useAuth } from "./Auth.jsx";

// Este componente recibe 3 props:
// 1. medico: (null si es para "Crear", un objeto si es para "Modificar")
// 2. onClose: La función para cerrar este modal
// 3. onSuccess: La función para refrescar la lista de médicos
export const MedicoForm = ({ medico, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  // Usamos un estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula: "",
  });

  // Si nos pasan un médico (para modificar), llenamos el formulario
  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre,
        apellido: medico.apellido,
        especialidad: medico.especialidad,
        matricula: medico.matricula,
      });
    } else {
      // Si no hay médico (es "Crear"), reseteamos el form
      setFormData({
        nombre: "",
        apellido: "",
        especialidad: "",
        matricula: "",
      });
    }
  }, [medico]); // Este efecto se ejecuta cuando la prop 'medico' cambia

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
      const url = medico
        ? `http://localhost:3000/medicos/${medico.id_medicos}` // Modificar (PUT)
        : "http://localhost:3000/medicos"; // Crear (POST)
      const method = medico ? "PUT" : "POST";

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
          throw new Error(data.message || "Error al guardar el médico");
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
          <h2>{medico ? "Modificar Médico" : "Crear Médico"}</h2>
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
              Especialidad
              <input name="especialidad" value={formData.especialidad} onChange={handleChange} required aria-invalid={getError("especialidad") ? "true" : "false"} />
              {getError("especialidad") && <small style={{ color: "red" }}>{getError("especialidad")}</small>}
            </label>
            <label>
              Matrícula
              <input name="matricula" value={formData.matricula} onChange={handleChange} required aria-invalid={getError("matricula") ? "true" : "false"} />
              {getError("matricula") && <small style={{ color: "red" }}>{getError("matricula")}</small>}
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
              <button type="submit">{medico ? "Guardar Cambios" : "Crear"}</button>
            </div>
          </footer>
        </form>
      </article>
    </dialog>
  );
};
