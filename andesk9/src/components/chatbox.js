// components/ChatBox.js
import React, { useState } from 'react';

const ChatBox = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button className="chat-toggle" onClick={toggleChat}>
        {isChatOpen ? 'Cerrar Chat' : 'Abrir Chat'}
      </button>
      {isChatOpen && (
        <div className="chatbox" id="chatbox">
          <div className="chat-header">
            <h5>Chat en Vivo</h5>
          </div>
          <div id="chat-messages" className="chat-messages">
            {/* Los mensajes se añadirán dinámicamente aquí */}
          </div>
          <div className="chat-footer">
            <input type="text" id="chat-input" placeholder="Escribe un mensaje..." />
            <button id="send-button">Enviar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
