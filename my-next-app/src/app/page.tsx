"use client"
import Layout from './components/layout';
import { FaCheckCircle, FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import EditTaskModal from './components/modalEdit';
import { GiSandsOfTime } from 'react-icons/gi';
import { MdOutlineAccessTime, MdTimerOff } from 'react-icons/md';
export enum Status {
  Pending = "pending",
  Completed = "completed",
}
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high"
}
export enum Category {
  WORK = "Work",
  PERSONAL = "Personal",
  STUDY = "Study",
  OTHER = "Other"
}

interface Task {
  title: string;
  description: string;
  startDate: Date | null;
  deadline: Date | null;
  status: Status;
  priority: Priority;
  categ: Category;
  user: string;
}
interface TaskUpdate {
  _id: string;
  title: string;
  description: string;
  startDate: Date | null;
  deadline: Date | null;
  status: Status;
  priority: Priority;
  categ: Category;
  user: string;
}
export default function Home() {

  const [data, setData] = useState<Task>({
    title: "",
    description: "",
    startDate: null,
    deadline: null,
    status: Status.Pending,
    priority: Priority.Medium,
    categ: Category.WORK,
    user: "",
  });
  const [task, setTask] = useState<Task[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, deadline] = dateRange;
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setData({
      ...data,
      startDate: dates[0],
      deadline: dates[1],
    });
  };

  const addTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const localStorageData = localStorage.getItem('user')
      const userData = localStorageData ? JSON.parse(localStorageData) : null
      //console.log('userData',userData)
      // const userId=userData.user._id
      // console.log("userId",userId)
      const taskData = {
        ...data,
        user: userData.user._id,

        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      };
      const response = await fetch('http://localhost:3000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Task added successfully!');
        console.log(result);
        fetchTask(userData.user._id)
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Task creation error:', err);
      alert('An error occurred while adding the task.');
    }
  };

  //fetch tasks

  const fetchTask = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/user/${id}`)
      if (!response.ok) {
        throw new Error('error');
      }
      const data = await response.json();
      console.log("data", data.data.task)
      const formattedTasks = data.data.task?.map((t: any) => ({
        ...t,
        status: t.status,
        startDate: t.startDate ? new Date(t.startDate) : null,
        deadline: t.deadline ? new Date(t.deadline) : null,
      })) || [];
      setTask(formattedTasks)
      setFilteredTasks(formattedTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tasks:", error);

    }
  }
  useEffect(() => {
    const localStorageData = localStorage.getItem('user')
    if (localStorageData) {
      if (localStorageData) {
        const userData = JSON.parse(localStorageData);
        if (userData?.user?._id) {
          fetchTask(userData.user._id);
          statusType(userData.user._id)
        }
      }
    }

  }, [])
  //Status Type count(completed or pending)
  const statusType = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/user/${id}`);
      if (!response.ok) {
        throw new Error("error");
      }

      const data = await response.json();
      if (Array.isArray(data.data.task)) {
        const completedTasks = data.data.task.filter((task: Task) => task.status === "completed");
        console.log("Completed tasks:", completedTasks.length);

        const pendingTasks = data.data.task.filter((task: Task) => task.status === "pending");
        console.log("Pending tasks:", pendingTasks.length);
        setCompletedCount(completedTasks.length);
        setPendingCount(pendingTasks.length);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des tasks:", error);
    }
  };

  //search avec title

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryStatus, setSearchQueryStatus] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  //search by title
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  //filter by status(pending or completed)
  const handleSearchChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryStatus(event.target.value);
  };

  useEffect(() => {
    let filtered = task;

    // Filtrage par titre
    if (searchQuery) {
      filtered = filtered.filter((t: any) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrage par statut
    if (searchQueryStatus) {
      filtered = filtered.filter((t: any) =>
        t.status.toLowerCase().includes(searchQueryStatus.toLowerCase())
      );
    }

    setFilteredTasks(filtered); // Met à jour les tâches filtrées
  }, [searchQuery, searchQueryStatus, task]);


  //updateData avec open modal qui existe dans componenent
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const openModal = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };
  const updateTask = async (updatedTask: TaskUpdate): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/task/${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),


      });
      if (response.ok) {

        console.log("task updated successfully");
        alert("task updated successfully");
        const localStorageData = localStorage.getItem('user')
        if (localStorageData) {
          const userData = JSON.parse(localStorageData);
          fetchTask(userData.user._id)
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('update task error:', error);
      alert('An error occurred while update the task.');
    }
  }

  //delete task 


  const deleteTask = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/task/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) {
        alert('task not deleted')
      }
      const localStorageData = localStorage.getItem('user')
      if (localStorageData) {
        const userData = JSON.parse(localStorageData);
        fetchTask(userData.user._id)
      }
      console.log("task deleted", response)
    } catch (error) {
      console.error('deleted task error:', error);
      alert('An error occurred while delete the task.');
    }
  }




  return (
    <div>
      <div className="container text-center mt-5 pt-5" >
        <h1 id='title' className='mt-5'>Hello, Aqeel, Start planing today</h1>
      </div>
      <div className='bg-warning-subtle container p-5 rounded-5 mt-5 mb-5'>
        <div className='container mt-5 '>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-5'>
              <p><strong>Start Date:</strong> {startDate ? startDate.toDateString() : ""}</p>
              <p><strong>Deadline:</strong> {deadline ? deadline.toDateString() : ""}</p>
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={deadline}
                selectsRange
                inline
              />

            </div>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-7'>
              <div className='row'>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-3'>
                  <input type="text" className='bg-primary-subtle p-3 rounded-2' name='title' placeholder='Type Title of Task' onChange={handleChange} />
                </div>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-7'>
                  <input type="text" className='bg-primary-subtle p-3 rounded-2' name='description' placeholder='Detail of Your Task' onChange={handleChange} />
                </div>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-2'>
                  <button onClick={addTask} className='bg-success p-3 d-flex align-items-center'>
                    <FaPlus className="me-2 text-white" />

                  </button>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-2'>
                  <select name="categ" className='form-control mb-2' value={data.categ} onChange={handleChange}>
                    {Object.values(Category).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-2'>
                  <select name="priority" className='form-control mb-2' value={data.priority} onChange={handleChange}>
                    {Object.values(Priority).map((prio) => <option key={prio} value={prio}>{prio}</option>)}
                  </select>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-2'>
                  <select name="status" className='form-control mb-2' value={data.status} onChange={handleChange}>
                    {Object.values(Status).map((stat) => <option key={stat} value={stat}>{stat}</option>)}
                  </select>
                </div>
                <div className="position-relative col-xs-12 col-sm-12 col-md-6 col-lg-3">
                  <input
                    type="search"
                    className="form-control ps-2"
                    placeholder="Filter by status"
                    value={searchQueryStatus}
                    onChange={handleSearchChangeStatus}
                  />
                  <FaSearch className="position-absolute top-3 end-5 text-light-emphasis" />
                </div>
                <div className="position-relative col-xs-12 col-sm-12 col-md-6 col-lg-3">
                  <input
                    type="search"
                    className="form-control ps-2"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <FaSearch className="position-absolute top-3 end-5 text-light-emphasis" />
                </div>


              </div>
              <div className="container mt-5">
                <div className="row ">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => {
                      const today = new Date().getTime()
                      const deadlineDate = new Date(task.deadline).getTime()
                      let urgencyIcon;
                      if (deadlineDate < today) {
                        urgencyIcon = <MdTimerOff style={{ color: 'red', fontSize: '25px' }} />; // 🚨 Rouge (Urgent)
                      } else if ((deadlineDate - today) / (1000 * 60 * 60 * 24) <= 3) {
                        urgencyIcon = <GiSandsOfTime style={{ color: 'orange', fontSize: '25px' }} />; // ⏳ Orange (À venir)
                      } else {
                        urgencyIcon = <MdOutlineAccessTime style={{ color: 'green', fontSize: '25px' }} />; // ✅ Vert (Ok)
                      }
                      return (
                        <div
                          key={index}
                          className="col-md-6 mb-3"
                          style={{
                            backgroundColor: '#cf9043',
                            padding: '10px',
                            borderRadius: '5px',
                          }}
                        >
                          <div className='d-flex justify-content-between'>
                            <h5>{task.title}</h5>{urgencyIcon}<FaCheckCircle
                              style={{
                                color: task.status === 'pending' ? 'rgb(153, 59, 59)' : 'green',
                                cursor: 'pointer',
                                fontSize: "25px"
                              }}
                            /></div>
                          <div className='d-flex justify-content-between'>


                            <p>{task.description}</p><FaPen
                              style={{
                                color: 'black', // Couleur de l'icône de modification
                                cursor: 'pointer',
                                fontSize: '20px',
                              }}
                              onClick={() => openModal(task)}
                            />
                            <EditTaskModal show={showModal} handleClose={closeModal} task={selectedTask} onSave={(updatedTask) => updateTask(updatedTask)} />
                          </div>
                          <div className='d-flex justify-content-between'>
                            <div>
                              <h6>Start Date: {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</h6>
                              <h6>Due Date: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</h6>
                              <p>Status: {task.status}</p>
                            </div>
                            <FaTrash onClick={() => deleteTask(task._id)} />
                          </div>

                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center">Aucune tâche disponible</p>
                  )}
                </div>

              </div>
            </div>


          </div>


        </div>
        <div className='row mt-5 g-3'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-3 text-center' style={{ backgroundColor: "#cf9043" }}>
            <h5>completed tasks</h5>
            <h3>{completedCount}</h3>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-3 text-center' style={{ backgroundColor: "rgba(121, 26, 26, 0.53);" }}>
            <h5>pending tasks</h5>
            <h3>{pendingCount}</h3>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 bg-light-subtle p-3 text-center' style={{ width: "50%" }}>
            <h3><span className='text-info'>tasks created</span> {task.length} </h3>
          </div>
        </div>

      </div>
    </div>


  );
}
