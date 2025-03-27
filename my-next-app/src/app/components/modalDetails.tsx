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
  priority: Priority; 
  categ: Category;
  user: string;
}

interface DetailTaskModalProps {
  show: boolean;
  handleClose: () => void;
  task: Task | null;
}

const DetailsTaskModal: React.FC<DetailTaskModalProps> = ({
  show,
  handleClose,
  task,
}) => {
  const [data, setData] = useState<Task | null>(task);

  useEffect(() => {
    setData(task);
  }, [task]);


  if(!show || !data) return null
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Details of this task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      <Form>
  <Form.Group className="mb-3">
    <Form.Label>Title</Form.Label>
    <Form.Control
      type="text"
      name="title"
      value={data?.title || ''}
      readOnly 
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Description</Form.Label>
    <Form.Control
      as="textarea"
      name="description"
      rows={3}
      value={data?.description || ''}
      readOnly 
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Date_Start</Form.Label>
    <Form.Control
      type="date"
      name="startDate"
      value={data?.startDate ? data.startDate.toISOString().split('T')[0] : ''}
      readOnly 
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Deadline</Form.Label>
    <Form.Control
      as="textarea"
      name="status"
      rows={3}
      value={data?.status || ''}
      readOnly 
    />
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Label>Category</Form.Label>
    <Form.Control
      as="textarea"
      name="categ"
      rows={3}
      value={data?.categ|| ''}
      readOnly 
    />
  </Form.Group>
 
  <Form.Group className="mb-3">
    <Form.Label>Priority</Form.Label>
    <Form.Control
      as="textarea"
      name="priority"
      rows={3}
      value={data?.priority || ''}
      readOnly 
    />
  </Form.Group>
</Form>

      </Modal.Body>
    
    </Modal>
  );
};

export default DetailsTaskModal;
