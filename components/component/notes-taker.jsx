'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { PenBox, Check } from 'lucide-react';
import Badge from './Badge'; // Assuming Badge is implemented as a separate component

export function NotesTaker() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('added-items')) || [];
    const filteredTasks = filterOldTasks(storedTasks);
    setTasks(filteredTasks);
    setFilteredTasks(filteredTasks);
    updateCategories(filteredTasks);
  }, []);

  const filterOldTasks = (tasks) => {
    const now = new Date();
    return tasks.filter(task => (now - new Date(task.time)) / (1000 * 60 * 60 * 24) <= 7);
  };

  const updateCategories = (tasks) => {
    const uniqueCategories = tasks.reduce((acc, task) => {
      if (!acc.includes(task.category)) {
        acc.push(task.category);
      }
      return acc;
    }, []);
    setCategories(['All', ...uniqueCategories]);
  };

  const addTask = (task) => {
    try {
      task.time = new Date();
      task._id = Math.random().toString(36).substr(2, 9); // Generate a unique id
      let storedTasks = JSON.parse(localStorage.getItem('added-items')) || [];
      storedTasks.push(task);
      const updatedTasks = filterOldTasks(storedTasks);
      localStorage.setItem('added-items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      updateCategories(updatedTasks);
      toast.success('Task Added Successfully');
      setNewTask({ title: '', description: '', category: '', completed: false }); // Clear newTask state
    } catch (error) {
      toast.error('Error Posting Task');
      console.log(error);
    }
  };

  const updateTask = (id, updatedTask) => {
    try {
      updatedTask.time = new Date();
      let storedTasks = JSON.parse(localStorage.getItem('added-items')) || [];
      const updatedTasks = storedTasks.map(task => (task._id === id ? updatedTask : task));
      localStorage.setItem('added-items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      updateCategories(updatedTasks);
      toast.success('Task Updated Successfully');
      setEditFormOpen(null); // Close edit form
      setEditingTask(null); // Clear editing task state
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Error Updating Task');
    }
  };

  const deleteTask = (id) => {
    try {
      let storedTasks = JSON.parse(localStorage.getItem('added-items')) || [];
      const updatedTasks = storedTasks.filter(task => task._id !== id);
      localStorage.setItem('added-items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      updateCategories(updatedTasks);
      toast.success('Task Deleted Successfully');
      setEditFormOpen(null); // Close edit form if deleting an edited task
      setEditingTask(null); // Clear editing task state
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Error Deleting Task');
    }
  };

  const handleEditClick = (task) => {
    if (editFormOpen === task._id) {
      setEditFormOpen(null);
      setEditingTask(null); // Clear editing task state
    } else {
      setEditFormOpen(task._id);
      setEditingTask(task);
    }
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    updateTask(id, updatedTasks.find(task => task._id === id));
  };

  const handleBadgeClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task => task.category === category);
      setFilteredTasks(filtered);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Do It Ma</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="primary">
              <PenBox className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[400px] p-4 space-y-4">
            {/* Form to add new task */}
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input id="task-title" placeholder="Enter task title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Task Description</Label>
              <Textarea id="task-description" placeholder="Enter task description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-category">Task Category</Label>
              <Input id="task-category" placeholder="Enter task category" value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <div>
                <Button variant="outline">Cancel</Button>
              </div>
              <Button onClick={() => addTask(newTask)}>Add Task</Button>
            </div>
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex space-x-2 mb-4">
          {categories.map(category => (
            <Badge
              key={category}
              variant={category === selectedCategory ? 'full' : 'outline'}
              onClick={() => handleBadgeClick(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Displaying filtered tasks */}
          {filteredTasks.map(task => (
            <Card
              key={task._id}
              className={`p-4 border border-gray-200 rounded-lg dark:border-gray-800 ${task.completed ? 'bg-green-100 dark:bg-green-900' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(task.time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}{' '}
                  {new Date(task.time).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-1">{task.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-900 dark:text-blue-100">
                  {task.category}
                </span>
                <div className="flex gap-2">
                  {editFormOpen === task._id && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                          Edit
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] md:w-[400px] p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-task-title">Task Title</Label>
                          <Input
                            id="edit-task-title"
                            placeholder="Enter task title"
                            value={editingTask.title}
                            onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-task-description">Task Description</Label>
                          <Textarea
                            id="edit-task-description"
                            placeholder="Enter task description"
                            value={editingTask.description}
                            onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-task-category">Task Category</Label>
                          <Input
                            id="edit-task-category"
                            placeholder="Enter task category"
                            value={editingTask.category}
                            onChange={e => setEditingTask({ ...editingTask, category: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => handleEditClick(task)}>
                            Cancel
                          </Button>
                          <Button onClick={() => updateTask(task._id, editingTask)}>
                            Update Task
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleEditClick(task)}>
                    <PenBox className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteTask(task._id)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => toggleCompletion(task._id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14M5 12h14" />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19l9-7-9-7-9 7 9 7z" />
      <path d="M12 19V5M5 12h14" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default NotesTaker;
