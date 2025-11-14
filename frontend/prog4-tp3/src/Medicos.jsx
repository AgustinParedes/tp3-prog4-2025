import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth.jsx";
import { MedicoForm } from "./MedicoForm.jsx"; // Importamos el formulario

export const Medicos = () => {
  const { fetchAuth } = useAuth();
  const [medicos, setMedicos] = useState([]);

  // Estados para manejar el modal
  const [showModal, setShowModal] = useState(false);
  // 'null' para "Crear", o un objeto médico para "Modificar"
  const [selectedMedico, setSelectedMedico] = useState(null);

  // Función para obtener la lista de médicos (estilo profesor)
  const fetchMedicos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/medicos");
      const data = await response.json();

      if (response.ok && data.success) {
        setMedicos(data.medicos);
      } else {
        throw new Error(data.message || "Error al obtener los médicos");
      }
    } catch (error) {
      alert(error.message);
    }
  }, [fetchAuth]);

  // Cargar los médicos al iniciar el componente
  useEffect(() => {
    fetchMedicos();
  }, [fetchMedicos]);

  // Función para eliminar un médico
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este médico?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/medicos/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          fetchMedicos(); // Refrescamos la lista
        } else {
          throw new Error(data.message || "Error al eliminar el médico");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Funciones para abrir los modales
  const handleShowCreateModal = () => {
    setSelectedMedico(null); // 'null' significa "Crear"
    setShowModal(true);
  };

  const handleShowEditModal = (medico) => {
    setSelectedMedico(medico); // Pasamos el objeto médico
    setShowModal(true);
  };

  // Función que se pasa al formulario para cerrar y refrescar
  const handleSuccess = () => {
    setShowModal(false);
    fetchMedicos();
  };

  return (
    <article>
      <h2>Gestión de Médicos</h2>
      <button onClick={handleShowCreateModal}>Crear Nuevo Médico</button>

      {/* La tabla de médicos */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Matrícula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((medico) => (
            <tr key={medico.id_medicos}>
              <td>{medico.id_medicos}</td>
              <td>{medico.nombre}</td>
              <td>{medico.apellido}</td>
              <td>{medico.especialidad}</td>
              <td>{medico.matricula}</td>
              <td>
                <div className="grid">
                  <button onClick={() => handleShowEditModal(medico)}>Modificar</button>
                  <button className="secondary" onClick={() => handleDelete(medico.id_medicos)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderizamos el modal (formulario) solo si showModal es true */}
      {showModal && <MedicoForm medico={selectedMedico} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </article>
  );
};
