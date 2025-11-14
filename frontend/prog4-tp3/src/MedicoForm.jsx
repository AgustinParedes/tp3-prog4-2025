import { useState, useEffect } from "react";
import { useAuth } from "./Auth.jsx";

export const MedicoForm = ({ medico, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula: "",
  });

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre,
        apellido: medico.apellido,
        especialidad: medico.especialidad,
        matricula: medico.matricula,
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        especialidad: "",
        matricula: "",
      });
    }
  }, [medico]);

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
      const url = medico ? `http://localhost:3000/medicos/${medico.id_medicos}` : "http://localhost:3000/medicos";
      const method = medico ? "PUT" : "POST";

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
          throw new Error(data.message || "Error al guardar el médico");
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
          <h2>{medico ? "Modificar Médico" : "Crear Médico"}</h2>
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
              <button type="button" className="secondary" onClick={() => onClose()}>
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
