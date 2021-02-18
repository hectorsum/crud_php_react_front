import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';
import './index.css';

function App() {
  const url = "http://localhost:8081/crud_react_php/";
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalEdit, setModalEdit]= useState(false);
  const [modalDelete, setModalDelete]= useState(false);
  const [taskSelected, setTaskSelected] = useState({
    id:'',
    title:'',
    description : ''
  });
  
  const handleChange = (e) => {
    const {name,value} = e.target;
    setTaskSelected((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleOpenDelete=()=>{
    setModalDelete(!modalDelete);
  }
  const handleOpen = () =>{
    setIsOpen(!isOpen);
  }
  const getTasks = async() =>{
    await axios.get(url)
      .then(res => setData(res.data));
  } 
  const postMethod = async() =>{
    let form = new FormData();
    form.append('title',taskSelected.title);
    form.append('description',taskSelected.description);
    form.append('METHOD','POST');
    await axios.post(url,form)
      .then(res => {
        setData(data.concat(res.data));
        handleOpen();
        getTasks();
      }).catch(error=> console.log(error));
  }
  const putMethod=async()=>{
    var form = new FormData();
    form.append("title", taskSelected.title);
    form.append("description", taskSelected.description);
    form.append("METHOD", "PUT");
    await axios.post(url, form, {params: {id: taskSelected.id}})
    .then(response=>{
      var newData = data;
      newData.map(task => {
        if(task.id===taskSelected.id){
          task.title=taskSelected.title;
          task.description=taskSelected.description;
        }
      });
      setData(newData);
      handleOpenEdit();
    }).catch(error=> console.log(error));
  }
  const deleteTasks=async()=>{
    var form = new FormData();
    form.append("METHOD", "DELETE");
    await axios.post(url, form, {params: {id: taskSelected.id}})
    .then(response=>{
      setData(data.filter(task=>task.id!==taskSelected.id));
      handleOpenDelete();
    }).catch(error=> console.log(error));
  }
  const handleOpenEdit=()=>{
    setModalEdit(!modalEdit);
  }
  const getSelectedTask=(framework, caso)=>{
    setTaskSelected(framework);
    (caso==="Editar") ? handleOpenEdit() : handleOpenDelete();
  }
  useEffect(() =>{
    getTasks();
  },[])
  return (
    <div className="container p-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="display-4" style={{fontWeight:'600'}}>To Do List</h1>
        <a href="#" className="btn btn-success h-100" onClick={handleOpen}>
          <i class="fas fa-plus-circle"></i>
        </a>
      </div>
      <hr/>
      <table className="table table-striped">
        <thead className="table-dark text-center">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.created_at}</td>
              <td>
                <a href="#" class="btn btn-primary mr-2" onClick={()=>getSelectedTask(task, "Editar")}>
                  <i class="fas fa-marker"></i>
                </a>
                <a href="#" class="btn btn-danger" onClick={()=>getSelectedTask(task, "Eliminar")}>
                  <i class="fas fa-trash-alt"></i>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen}>
        <ModalHeader>Add task</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Task Title</label>
            <br/>
            <input type="text" name="title" className="form-control" onChange={handleChange}/>
            <label>Task Description</label>
            <br/>
            <textarea type="text" name="description" className="form-control" style={{resize:'none'}} onChange={handleChange}></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={postMethod}>Insert</button>
          <button className="btn btn-danger" onClick={handleOpen}>Cancel</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEdit}>
        <ModalHeader>Edit task</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Task Name: </label>
            <input type="text" className="form-control" name="title" onChange={handleChange} value={taskSelected && taskSelected.title}/>
            <label>Task Description: </label>
            <input type="text" className="form-control" name="description" onChange={handleChange} value={taskSelected && taskSelected.description}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>putMethod()}>Edit</button>
          <button className="btn btn-danger" onClick={()=>handleOpenEdit()}>Cancel</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalDelete}>
        <ModalBody>
        Are you sure you want to delete {taskSelected && taskSelected.title} task?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>deleteTasks()}>
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>handleOpenDelete()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
