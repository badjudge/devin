import React, {useContext,useState,useEffect} from "react";
import { UserContext } from "../context/user.context"; // Import the UserContext
import  myimage  from '../assets/link.png'; 
import image2 from '../assets/user-fill.svg'
import { useNavigate } from "react-router-dom"; 
// Adjust the path as necessary

import axios from '../config/axios'; // Import axios for making HTTP requests
import { use } from "react";


const Home = () => {
const navigate = useNavigate();

    //e.preventDefault();
    const {user} = useContext(UserContext)// Access user from UserContext
        const [isModalOpen,setIsModalOpen] = useState(false) 
        const[projectName,setProjectName] = useState(null)
        const[project,setProject] = useState([])

    function createProject(e){
    console.log('create project')
        e.preventDefault();
        console.log({projectName})
        
        axios.post('/projects/create',{
            name:projectName,
        }).then((res)=>{
                console.log(res)
                setIsModalOpen(false) // Close the modal after project creation
                // Optionally, you can refresh the project list or redirect to the new project page
        }).catch((error)=>{
              console.error(error)
        })
    }

    useEffect(() =>{
        axios.get('/projects/all').then((res)=>{
             //console.log(res.data)
            setProject(res.data.projects);
        }).catch(err=>{
            console.error(err)})
            
    },[])
       
    return (
     <main className='p-4'>
        <div className="project mt-10">
  <div className="flex justify-center">
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-transform duration-200 transform hover:scale-105"
    >
      <img
        src={myimage}
        alt="Create Project"
        className="w-6 h-6 opacity-90"
      />
      <span className="text-base">Create New Project</span>
    </button>
  </div>
</div>
          {
         project.map((project) => (
                <div
  key={project._id}
    onClick={()=> 
    {
        navigate(`/project`,{
            state:{project}
        })
    }
    }
  className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200 ease-in-out cursor-pointer"
>
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
      {project.name}
    </h3>
    <img
      src={myimage}
      alt="Project Icon"
      className="w-6 h-6 opacity-80 group-hover:opacity-100 transition"
    />
  </div>

  {/* Optional: Add metadata or action */}
  <div className="mt-2 text-sm text-gray-500">
    Click to view details
  </div>
  <div className="flex gap-2">
        <img src={image2} className="w-4 h-6"/>
        <p>Collaborators</p>
           {project.users.length}
  </div>
</div>
         ))
}

       

            
        
        {/* Modal Trigger Button */}
        

        {/* Modal Overlay */}
        {isModalOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm animate-fadeIn">
                {/* Modal Container */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative animate-slideUp">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 6l12 12M6 18L18 6" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create Project</h2>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={createProject} 
                            
                    >
                        <label className="flex flex-col gap-2">
                            <span className="text-gray-700 font-medium">Project Name</span>
                            <input
                                onChange={(e)=>setProjectName(e.target.value) }
                                type="text"
                                required
                                placeholder="Enter project name"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            Create
                        </button>
                    </form>
                </div>
                {/* Animations */}
                <style>
                    {`
                        .animate-fadeIn {
                            animation: fadeIn 0.2s ease;
                        }
                        .animate-slideUp {
                            animation: slideUp 0.3s cubic-bezier(.4,2,.6,1) both;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0 }
                            to { opacity: 1 }
                        }
                        @keyframes slideUp {
                            from { transform: translateY(40px) scale(0.98); opacity: 0 }
                            to { transform: translateY(0) scale(1); opacity: 1 }
                        }
                    `}
                </style>
            </div>
        )}
     </main>
       
    )
}

export default Home;