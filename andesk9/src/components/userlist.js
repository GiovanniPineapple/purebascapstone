import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'reactstrap';

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Función para obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/usuarios');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Actualiza la lista de usuarios después de eliminar
        setUsers(users.filter(user => user.id_user !== id));
      } else {
        console.error('Error al eliminar el usuario:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <Container>
      <h3 className="text-center mb-4">Lista de Usuarios</h3>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.id_user}</td>
              <td>{user.user_name}</td>
              <td>{user.user_email}</td>
              <td>{user.user_phone}</td>
              <td>{user.user_role}</td>
              <td>
                {user.user_image_path ? (
                  <img
                    src={`http://localhost:5000/${user.user_image_path}`} // URL de la imagen
                    alt={`${user.user_name}'s avatar`}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e0e0e0' }} />
                )}
              </td>
              <td>
                <Button color="danger" onClick={() => deleteUser(user.id_user)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;
