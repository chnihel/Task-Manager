import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
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
  _id: string;
  title: string;
  description: string;
  startDate: Date | null;
  deadline: Date | null;
  status: Status;
  priority: Priority;  // Ajout des champs manquants
  categ: Category;
  user: string;
}

interface EditTaskModalProps {
  show: boolean;
  handleClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  show,
  handleClose,
  task,
  onSave
}) => {
  const [data, setData] = useState<Task | null>(task);

  useEffect(() => {
    setData(task);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (data) {
      const { name, value, type } = e.target;
  
      if (type === "date") {
        setData({
          ...data,
          [name]: value ? new Date(value) : null,  
        });
      } else {
        setData({ ...data, [name]: value });
      }
    }
  };

  const onSubmitHandler = (e:React.FormEvent) => {
    e.preventDefault()
    if (data) {
    onSave(data); 

      handleClose();
    }
  };
  if(!show || !data) return null
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la tâche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      <Form onSubmit={onSubmitHandler}>
  <Form.Group className="mb-3">
    <Form.Label>Titre</Form.Label>
    <Form.Control
      type="text"
      name="title"
      value={data?.title || ''}
      onChange={handleChange}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Description</Form.Label>
    <Form.Control
      as="textarea"
      name="description"
      rows={3}
      value={data?.description || ''}
      onChange={handleChange}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Date de début</Form.Label>
    <Form.Control
      type="date"
      name="startDate"
      value={data?.startDate ? data.startDate.toISOString().split('T')[0] : ''}
      onChange={handleChange}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Date limite</Form.Label>
    <Form.Control
      type="date"
      name="deadline"
      value={data?.deadline ? data.deadline.toISOString().split('T')[0] : ''}
      onChange={handleChange}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Statut</Form.Label>
    <Form.Select name="status" value={data?.status} onChange={handleChange}>
      <option value="pending">En attente</option>
      <option value="completed">Complétée</option>
    </Form.Select>
  </Form.Group>

  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Annuler
    </Button>
    <Button variant="primary" type="submit">
      Enregistrer
    </Button>
  </Modal.Footer>
</Form>

    
      </Modal.Body>
    
    </Modal>
  );
};

export default EditTaskModal;
