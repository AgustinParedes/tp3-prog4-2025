import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth.jsx";
import { TurnoForm } from "./TurnoForm.jsx";

export const Turnos = () => {
  const { fetchAuth } = useAuth();
  const [turnos, setTurnos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedTurno, setSelectedTurno] = useState(null);

  const fetchTurnos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/turnos");
      const data = await response.json();

      if (response.ok && data.success) {
        setTurnos(data.turnos);
      } else {
        throw new Error(data.message || "Error al obtener los turnos");
      }
    } catch (error) {
      alert(error.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este turno?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          fetchTurnos();
        } else {
          throw new Error(data.message || "Error al eliminar el turno");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleShowCreateModal = () => {
    setSelectedTurno(null);
    setShowModal(true);
  };

  const handleShowEditModal = (turno) => {
    setSelectedTurno(turno);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    fetchTurnos();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(date);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  };

  return (
    <article>
      <h2>Gestión de Turnos</h2>
      <button onClick={handleShowCreateModal}>Crear Nuevo Turno</button>

      {/* La tabla de turnos */}
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id_turnos}>
                <td>{turno.id_turnos}</td>
                <td>{formatDate(turno.fecha)}</td>
                <td>{formatTime(turno.hora)}</td>

                <td>
                  {turno.paciente_nombre} {turno.paciente_apellido}
                </td>
                <td>
                  {turno.medico_nombre} {turno.medico_apellido}
                </td>
                <td>{turno.estado}</td>
                <td>{turno.observaciones}</td>
                <td>
                  <div className="grid">
                    <button onClick={() => handleShowEditModal(turno)}>Modificar Estado</button>
                    <button className="secondary" onClick={() => handleDelete(turno.id_turnos)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <TurnoForm turno={selectedTurno} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </article>
  );
};
