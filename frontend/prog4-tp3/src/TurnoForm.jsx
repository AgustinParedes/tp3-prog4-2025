import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth.jsx";

// Este componente es el formulario para "Crear" y "Modificar" Turnos.
// 1. turno: (null si es "Crear", un objeto si es "Modificar")
// 2. onClose: Función para cerrar el modal
// 3. onSuccess: Función para refrescar la lista de turnos
export const TurnoForm = ({ turno, onClose, onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState([]);

  // Estados para las listas de médicos y pacientes (para los <select>)
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_medico: "",
    fecha: "",
    hora: "", // El backend espera HH:MM (por el validador isTime())
    estado: "pendiente",
    observaciones: "",
  });

  // --- Carga de Médicos y Pacientes ---
  // (Lógica del profesor: usamos useCallback para funciones de fetch)
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

  // useEffect para cargar los datos de los <select> al montar el modal
  useEffect(() => {
    fetchMedicos();
    fetchPacientes();
  }, [fetchMedicos, fetchPacientes]);

  // useEffect para rellenar el formulario si estamos en modo "Modificar"
  useEffect(() => {
    if (turno) {
      // Formateamos la fecha para el input type="date" (YYYY-MM-DD)
      const fechaFormateada = turno.fecha ? new Date(turno.fecha).toISOString().split("T")[0] : "";

      setFormData({
        // El backend nos da los IDs en el GET /turnos (aunque no los mostramos en la tabla)
        // Si no, necesitaríamos ajustar el backend. Asumamos que los tenemos.
        // Si el GET /turnos no trae id_paciente y id_medico,
        // necesitamos buscarlos o ajustar el formulario/backend.
        // Por ahora, asumimos que NO los tenemos y los dejamos vacíos.
        // ---
        // EDICIÓN: El backend SÍ nos da los IDs en el GET /turnos/:id
        // pero NO en el GET /turnos.
        // Para simplificar, la modificación solo permitirá cambiar ESTADO y OBSERVACIONES.
        id_paciente: turno.id_paciente || "", // Asumimos que lo tenemos
        id_medico: turno.id_medico || "", // Asumimos que lo tenemos
        fecha: fechaFormateada,
        hora: turno.hora ? turno.hora.substring(0, 5) : "", // HH:MM
        estado: turno.estado,
        observaciones: turno.observaciones || "",
      });
    } else {
      // Modo "Crear", reseteamos el form
      setFormData({
        id_paciente: "",
        id_medico: "",
        fecha: "",
        hora: "",
        estado: "pendiente",
        observaciones: "",
      });
    }
  }, [turno]); // Se ejecuta si la prop 'turno' cambia

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
      const url = turno
        ? `http://localhost:3000/turnos/${turno.id_turnos}` // Modificar (PUT)
        : "http://localhost:3000/turnos"; // Crear (POST)
      const method = turno ? "PUT" : "POST";

      // Si estamos modificando, solo enviamos estado y observaciones
      // (como pide la consigna del frontend y el backend)
      const bodyPayload = turno ? { estado: formData.estado, observaciones: formData.observaciones } : formData;

      const response = await fetchAuth(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Errores de validación del backend
          setErrores(data.errores || []);
        } else {
          // Otro tipo de error
          throw new Error(data.message || "Error al guardar el turno");
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
          <h2>{turno ? "Modificar Turno" : "Crear Turno"}</h2>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <fieldset>
            {/* Mostramos estos campos SOLO si estamos CREANDO un turno */}
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

            {/* Mostramos estos campos SOLO si estamos MODIFICANDO */}
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

            {/* Este campo se muestra siempre (Crear y Modificar) */}
            <label>
              Observaciones
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} aria-invalid={getError("observaciones") ? "true" : "false"} />
              {getError("observaciones") && <small style={{ color: "red" }}>{getError("observaciones")}</small>}
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
              <button type="submit">{turno ? "Guardar Cambios" : "Crear Turno"}</button>
            </div>
          </footer>
        </form>
      </article>
    </dialog>
  );
};
