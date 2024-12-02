import React, { useState } from 'react'; // Importar React y useState
import axios from 'axios'; // Importar axios

const FeedbackForm = () => {
    const [comment, setComment] = useState('');
    const id_user = localStorage.getItem('UserId'); // ID del cliente autenticado

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const userId = localStorage.getItem('UserId'); // Obtén el ID del usuario autenticado
        if (!userId) {
          alert('No se ha encontrado el usuario autenticado.');
          return;
        }
      
        try {
          const response = await axios.post('http://localhost:5000/feedback', { id_user: userId, comment });
          alert(response.data.message);
          setComment('');
        } catch (err) {
          console.error('Error al enviar comentario:', err.response?.data || err.message);
          alert(err.response?.data?.error || 'Hubo un error al enviar tu comentario.');
        }
      };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                className="form-control"
                placeholder="Deja tu comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <button type="submit" className="btn btn-primary mt-2">Enviar</button>
        </form>
    );
};

export default FeedbackForm;
