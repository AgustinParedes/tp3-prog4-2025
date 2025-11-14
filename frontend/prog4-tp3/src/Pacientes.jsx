import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth.jsx";
import { PacienteForm } from "./PacienteForm.jsx";

export const Pacientes = () => {
  const { fetchAuth } = useAuth();
  const [pacientes, setPacientes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/pacientes");
      const data = await response.json();

      if (response.ok && data.success) {
        setPacientes(data.pacientes);
      } else {
        throw new Error(data.message || "Error al obtener los pacientes");
      }
    } catch (error) {
      alert(error.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este paciente?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          fetchPacientes();
        } else {
          throw new Error(data.message || "Error al eliminar el paciente");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleShowCreateModal = () => {
    setSelectedPaciente(null);
    setShowModal(true);
  };

  const handleShowEditModal = (paciente) => {
    setSelectedPaciente(paciente);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    fetchPacientes();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(date);
  };

  return (
    <article>
      <h2>Gestión de Pacientes</h2>
      <button onClick={handleShowCreateModal}>Crear Nuevo Paciente</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Fecha Nac.</th>
            <th>Obra Social</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id_pacientes}>
              <td>{paciente.id_pacientes}</td>
              <td>{paciente.nombre}</td>
              <td>{paciente.apellido}</td>
              <td>{paciente.dni}</td>
              <td>{formatDate(paciente.fecha_nacimiento)}</td>
              <td>{paciente.obra_social}</td>
              <td>
                <div className="grid">
                  <button onClick={() => handleShowEditModal(paciente)}>Modificar</button>
                  <button className="secondary" onClick={() => handleDelete(paciente.id_pacientes)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && <PacienteForm paciente={selectedPaciente} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </article>
  );
};
