// src/components/UserForm.js
import React, { useState } from 'react';
import { Button, FormGroup, Input, Label, Container, Col, Row, Form } from 'reactstrap';

const UserForm = () => {
  const [form, setForm] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userPassword: '',
    confirmPassword: '',
    userRole: '',
    userImage: null, // Cambia a null para manejar archivos
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prevForm) => ({
      ...prevForm,
      userImage: file, // Almacena el archivo directamente
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.userPassword !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const dataToSend = new FormData(); // Crea un nuevo objeto FormData
    dataToSend.append('userName', form.userName);
    dataToSend.append('userEmail', form.userEmail);
    dataToSend.append('userPhone', form.userPhone);
    dataToSend.append('userPassword', form.userPassword);
    dataToSend.append('userRole', form.userRole);
    if (form.userImage) {
      dataToSend.append('userImage', form.userImage); // Añade el archivo de imagen
    }

    try {
      const response = await fetch('http://localhost:5000/usuarios', {
        method: 'POST',
        body: dataToSend, // Envía el FormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Usuario creado con éxito:', result);
        alert('Usuario creado con éxito');

        // Reiniciar el formulario
        setForm({
          userName: '',
          userEmail: '',
          userPhone: '',
          userPassword: '',
          confirmPassword: '',
          userRole: '',
          userImage: null, // Reiniciar a null
        });
      } else {
        console.error('Error al crear usuario:', response.statusText);
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Hubo un problema al conectar con la API');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="8">
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Crear Nuevo Usuario</h3>

            <FormGroup>
              <Label for="userName">Nombre Completo</Label>
              <Input
                type="text"
                name="userName"
                id="userName"
                placeholder="Ingresa tu nombre completo"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="userEmail">Correo Electrónico</Label>
              <Input
                type="email"
                name="userEmail"
                id="userEmail"
                placeholder="Ingresa tu correo electrónico"
                value={form.userEmail}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="userPhone">Teléfono</Label>
              <Input
                type="tel"
                name="userPhone"
                id="userPhone"
                placeholder="Ingresa tu número de teléfono"
                value={form.userPhone}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="userPassword">Contraseña</Label>
              <Input
                type="password"
                name="userPassword"
                id="userPassword"
                placeholder="Ingresa una contraseña"
                value={form.userPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="confirmPassword">Confirmar Contraseña</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirma tu contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="userRole">Rol</Label>
              <Input
                type="select"
                name="userRole"
                id="userRole"
                value={form.userRole}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="Admin">Administrador</option>
                <option value="Cliente">Cliente</option>
                <option value="Entrenador">Entrenador</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="userImage">Imagen de Usuario</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} required />
            </FormGroup>

            <Button type="submit" color="info" block>
              Crear Usuario
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserForm;
