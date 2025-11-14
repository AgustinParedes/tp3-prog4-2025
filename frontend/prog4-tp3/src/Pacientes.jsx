import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth.jsx";
import { PacienteForm } from "./PacienteForm.jsx"; // Importamos el formulario

export const Pacientes = () => {
  const { fetchAuth } = useAuth();
  const [pacientes, setPacientes] = useState([]);

  // Estados para manejar el modal
  const [showModal, setShowModal] = useState(false);
  // 'null' para "Crear", o un objeto paciente para "Modificar"
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  // Función para obtener la lista de pacientes
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

  // Cargar los pacientes al iniciar el componente
  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // Función para eliminar un paciente
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este paciente?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          fetchPacientes(); // Refrescamos la lista
        } else {
          throw new Error(data.message || "Error al eliminar el paciente");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Funciones para abrir los modales
  const handleShowCreateModal = () => {
    setSelectedPaciente(null); // 'null' significa "Crear"
    setShowModal(true);
  };

  const handleShowEditModal = (paciente) => {
    setSelectedPaciente(paciente); // Pasamos el objeto paciente
    setShowModal(true);
  };

  // Función que se pasa al formulario para cerrar y refrescar
  const handleSuccess = () => {
    setShowModal(false);
    fetchPacientes();
  };

  // Función simple para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(date);
  };

  return (
    <article>
      <h2>Gestión de Pacientes</h2>
      <button onClick={handleShowCreateModal}>Crear Nuevo Paciente</button>

      {/* La tabla de pacientes */}
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

      {/* Renderizamos el modal (formulario) solo si showModal es true */}
      {showModal && <PacienteForm paciente={selectedPaciente} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </article>
  );
};
