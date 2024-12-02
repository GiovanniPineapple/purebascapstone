import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackList = () => {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:5000/feedback');
                setFeedback(response.data.feedback); // Actualizamos el estado con los comentarios obtenidos
            } catch (err) {
                console.error('Error al obtener comentarios:', err.message);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Comentarios de Clientes</h3>
            {feedback.length > 0 ? (
                <div className="list-group">
                    {feedback.map((item, index) => (
                        <div key={index} className="list-group-item mb-3">
                            <h5 className="mb-1">
                                <strong>{item.user_name}</strong>
                            </h5>
                            <p className="mb-1">{item.comment}</p>
                            <small className="text-muted">{new Date(item.created_at).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay comentarios aún.</p>
            )}
        </div>
    );
};

export default FeedbackList;
