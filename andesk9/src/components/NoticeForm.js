import React, { useState } from 'react';
import { Button, FormGroup, Input, Label, Container, Col, Row, Form } from 'reactstrap';
import axios from 'axios';

const NoticeForm = ({ notice, onSuccess }) => {
  const [formData, setFormData] = useState(
    notice || {
      tipe_notice: '',
      name_notice: '',
      desct_notice: '',
      noticeImage: null, // Almacena el archivo de imagen
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      noticeImage: file, // Actualiza el archivo
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id_user = localStorage.getItem('UserId'); // Obtén el ID del usuario del localStorage
    if (!id_user) {
      alert('El usuario no está autenticado.');
      return;
    }

    const dataToSend = new FormData(); // Crea un objeto FormData
    dataToSend.append('tipe_notice', formData.tipe_notice);
    dataToSend.append('name_notice', formData.name_notice);
    dataToSend.append('desct_notice', formData.desct_notice);
    dataToSend.append('id_user', id_user); // Añade el id_user
    if (formData.noticeImage) {
      dataToSend.append('noticeImage', formData.noticeImage); // Añade la imagen si existe
    }

    try {
      if (notice) {
        // Actualizar noticia existente
        await axios.put(`http://localhost:5000/notice/${notice.id_notice}`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Crear una nueva noticia
        await axios.post('http://localhost:5000/notice', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      alert('Noticia guardada con éxito.');
      if (onSuccess) onSuccess(); // Ejecuta el callback tras el éxito
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
      alert('Hubo un error al guardar la noticia. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="8">
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">
              {notice ? 'Actualizar Noticia o Actividad' : 'Crear Nueva Noticia o Actividad'}
            </h3>

            <FormGroup>
              <Label for="tipe_notice">Tipo</Label>
              <Input
                type="select"
                name="tipe_notice"
                id="tipe_notice"
                value={formData.tipe_notice}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                <option value="noticia">Noticia</option>
                <option value="actividad">Actividad</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="name_notice">Nombre</Label>
              <Input
                type="text"
                name="name_notice"
                id="name_notice"
                placeholder="Ingresa el nombre"
                value={formData.name_notice}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="desct_notice">Descripción</Label>
              <Input
                type="textarea"
                name="desct_notice"
                id="desct_notice"
                placeholder="Ingresa la descripción"
                value={formData.desct_notice}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="noticeImage">Imagen</Label>
              <Input
                type="file"
                id="noticeImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormGroup>

            <Button type="submit" color="primary" block>
              {notice ? 'Actualizar' : 'Crear'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NoticeForm;
