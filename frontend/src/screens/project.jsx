
// ...existing imports and code...
import React, { useState,useEffect ,useContext} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import grpimage from '../assets/group-2-fill.svg';
import imgsend from '../assets/send-plane-fill.svg';
import axios from "../config/axios.js";
import { UserContext} from '../context/user.context.jsx';
import { initializeSocket,receiveMessage,sendMessage } from "../config/socket.js";
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Message array state
  const { user } = useContext(UserContext);

  const handleUserSelect = (id) => {
    if (selectedUserId.includes(id)) {
      setSelectedUserId(selectedUserId.filter(userId => userId !== id));
    } else {
      setSelectedUserId([...selectedUserId, id]);
    }
  };

  function send() {
    if (!message.trim()) return;
    const messageObject = {
      message,
      sender: user,
    };
    sendMessage('project-message', messageObject);
    appendOutgoingMessage(messageObject);
    setMessage('');
  }

  function appendIncomingMessage(messageObject) {
    setMessages(prev => [...prev, { ...messageObject, incoming: true }]);
  }

  function appendOutgoingMessage(messageObject) {
    setMessages(prev => [...prev, { ...messageObject, incoming: false }]);
  }

  function addCollaborators() {
    axios.put('/projects/add-user', {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    }).then(res => {
      setIsModalOpen(false);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage('project-message', (data) => {
  

      appendIncomingMessage(data);
    });

    axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
      setProject(res.data.project);
    });
    axios.get('/users/all').then(res => {
      setUsers(res.data.allUsers);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-full min-w-72 bg-red-300 flex flex-col">
        <header className='flex justify-between items-center p-4 w-full bg-slate-200'>
          <button
            className="flex gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className='p-2 rounded-full bg-slate-300 hover:bg-slate-400 '
          >
            <img src={grpimage} alt="logo" className='w-10 h-10 rounded-full' />
          </button>
        </header>

        <div className="conversation-area overflow-hidden flex-grow flex flex-col w-[30rem]">
          <div className="message-box overflow-y-auto flex-grow flex flex-col gap-1 ">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender._id === 'AI'? 'max-w-80' : 'ml-auto max-w-54'} max-w-100 flex ${msg.incoming ? 'self-start bg-slate-200' : 'self-end bg-blue-200'} flex-col p-2 rounded-md w-fit`}
              >
                <small className='opacity-65 text-xs'>{msg?.sender?.email || (msg.incoming ? 'Unknown sender' : 'You')}</small>
                <Markdown class="w-100"
  options={{
    overrides: {
      code: {
        component: ({ children, className }) => {
          const language = className?.replace('lang-', '') || 'javascript';
          return (
            <SyntaxHighlighter language={language} style={oneDark}>
              {children}
            </SyntaxHighlighter>
          );
        }
      }
    }
  }}
>
  {msg?.message || ''}
</Markdown>
              </div>
            ))}
          </div>
          <div className="inputField w-full flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="    Enter Message"
              className="p-2 flex-grow px-4 bg-white border-none outline-none"
            />
            <button onClick={send} className="px-5"><i className="ri-send-plane-fill"></i></button>
          </div>
        </div>

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? '-translate-x-0' : '-translate-x-full'}`}>
          <header className='flex justify-end bg-slate-200 px-4 p-4 h-10 w-full'>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {project.users && project.users.map(user => (
              <div key={user._id} className="user flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border hover:bg-slate-200">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  <i className="ri-user-fill text-xl"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for user list */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="ri-close-fill text-2xl"></i>
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Select a User</h2>
              <ul className="space-y-3 max-h-60 flex flex-col overflow-auto">
                {users.map(user => (
                  <li
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border ${selectedUserId.indexOf(user._id) !== -1 ? "bg-slate-200" : ""}`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      <i className="ri-user-fill text-xl"></i>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={addCollaborators}
              >
                Add Collaborators
              </button>
              {selectedUserId && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                  Selected User ID: {selectedUserId.length}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Project;