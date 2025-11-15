import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth.jsx";

export const TurnoForm = ({ turno, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const [formData, setFormData] = useState({
    id_paciente: "",
    id_medico: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    observaciones: "",
  });

  const fetchMedicos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/medicos");
      const data = await response.json();
      if (data.success) {
        setMedicos(data.medicos);
      }
    } catch (error) {
      console.error("Error al cargar médicos:", error);
    }
  }, [fetchAuth]);

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/pacientes");
      const data = await response.json();
      if (data.success) {
        setPacientes(data.pacientes);
      }
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchMedicos();
    fetchPacientes();
  }, [fetchMedicos, fetchPacientes]);

  useEffect(() => {
    if (turno) {
      const fechaFormateada = turno.fecha ? new Date(turno.fecha).toISOString().split("T")[0] : "";

      setFormData({
        id_paciente: turno.id_paciente || "",
        id_medico: turno.id_medico || "",
        fecha: fechaFormateada,
        hora: turno.hora ? turno.hora.substring(0, 5) : "",
        estado: turno.estado,
        observaciones: turno.observaciones || "",
      });
    } else {
      setFormData({
        id_paciente: "",
        id_medico: "",
        fecha: "",
        hora: "",
        estado: "pendiente",
        observaciones: "",
      });
    }
  }, [turno]);

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
      const url = turno ? `http://localhost:3000/turnos/${turno.id_turnos}` : "http://localhost:3000/turnos";
      const method = turno ? "PUT" : "POST";

      const bodyPayload = turno ? { estado: formData.estado, observaciones: formData.observaciones } : formData;

      const response = await fetchAuth(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrores(data.errores || []);
        } else {
          throw new Error(data.message || "Error al guardar el turno");
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
          <h2>{turno ? "Modificar Turno" : "Crear Turno"}</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset>
            {!turno && (
              <>
                <label>
                  Paciente
                  <select name="id_paciente" value={formData.id_paciente} onChange={handleChange} required>
                    <option value="" disabled>
                      Seleccione un paciente...
                    </option>
                    {pacientes.map((p) => (
                      <option key={p.id_pacientes} value={p.id_pacientes}>
                        {p.nombre} {p.apellido} (DNI: {p.dni})
                      </option>
                    ))}
                  </select>
                  {getError("id_paciente") && <small style={{ color: "red" }}>{getError("id_paciente")}</small>}
                </label>

                <label>
                  Médico
                  <select name="id_medico" value={formData.id_medico} onChange={handleChange} required>
                    <option value="" disabled>
                      Seleccione un médico...
                    </option>
                    {medicos.map((m) => (
                      <option key={m.id_medicos} value={m.id_medicos}>
                        {m.nombre} {m.apellido} ({m.especialidad})
                      </option>
                    ))}
                  </select>
                  {getError("id_medico") && <small style={{ color: "red" }}>{getError("id_medico")}</small>}
                </label>

                <div className="grid">
                  <label>
                    Fecha
                    <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required aria-invalid={getError("fecha") ? "true" : "false"} />
                    {getError("fecha") && <small style={{ color: "red" }}>{getError("fecha")}</small>}
                  </label>
                  <label>
                    Hora (HH:MM)
                    <input type="time" name="hora" value={formData.hora} onChange={handleChange} required aria-invalid={getError("hora") ? "true" : "false"} />
                    {getError("hora") && <small style={{ color: "red" }}>{getError("hora")}</small>}
                  </label>
                </div>
              </>
            )}

            {turno && (
              <label>
                Estado del Turno
                <select name="estado" value={formData.estado} onChange={handleChange} required>
                  <option value="pendiente">Pendiente</option>
                  <option value="atendido">Atendido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                {getError("estado") && <small style={{ color: "red" }}>{getError("estado")}</small>}
              </label>
            )}

            <label>
              Observaciones
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} aria-invalid={getError("observaciones") ? "true" : "false"} />
              {getError("observaciones") && <small style={{ color: "red" }}>{getError("observaciones")}</small>}
            </label>
          </fieldset>

          <footer>
            <div className="grid">
              <button type="button" className="secondary" onClick={() => onClose()}>
                Cancelar
              </button>
              <button type="submit">{turno ? "Guardar Cambios" : "Crear Turno"}</button>
            </div>
          </footer>
        </form>
      </article>
    </dialog>
  );
};
