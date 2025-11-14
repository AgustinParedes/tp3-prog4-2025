import { useState, useEffect } from "react";
import { useAuth } from "./Auth.jsx";

export const PacienteForm = ({ paciente, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    obra_social: "",
  });

  useEffect(() => {
    if (paciente) {
      const fechaFormateada = paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento).toISOString().split("T")[0] : "";

      setFormData({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
        fecha_nacimiento: fechaFormateada,
        obra_social: paciente.obra_social,
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        fecha_nacimiento: "",
        obra_social: "",
      });
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getError = (field) => {
    return errores
      ?.filter((e) => e.path === field)
      .map((e) => e.msg)
      .join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);

    try {
      const url = paciente ? `http://localhost:3000/pacientes/${paciente.id_pacientes}` : "http://localhost:3000/pacientes";
      const method = paciente ? "PUT" : "POST";

      const response = await fetchAuth(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrores(data.errores || []);
        } else {
          throw new Error(data.message || "Error al guardar el paciente");
        }
      } else {
        onSuccess();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <dialog open>
      <article>
        <header>
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
              <button type="button" className="secondary" onClick={() => onClose()}>
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
