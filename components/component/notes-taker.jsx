'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { PenBox, Check } from 'lucide-react';

export function NotesTaker() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', completed: false });
  const [editingTask, setEditingTask] = useState(null); // State to track the task being edited
  const [editFormOpen, setEditFormOpen] = useState(null); // State to track which edit form is open

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${process.env.API_ROUTE}/api/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Failed to fetch tasks:', error));
  };

  const addTask = (task) => {
    try {
      task.time = new Date();
      fetch(`${process.env.API_ROUTE}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
        .then(response => response.json())
        .then(data => {
          setTasks(oldTasks => [...oldTasks, data]);
          toast.success('Task Added Successfully');
          fetchTasks(); // Fetch tasks again to update the list
        })
        .catch(error => {
          console.error('Failed to add task:', error);
          toast.error('Error Posting Task');
        });
    } catch (error) {
      toast.error('Error Posting Task');
      console.log(error);
    }
  };

  const updateTask = (id, updatedTask) => {
    fetch(`${process.env.API_ROUTE}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then(data => {
        // Update the tasks list and reset editing state
        setTasks(tasks.map(task => (task._id === id ? data : task)));
        setEditingTask(null);
        setEditFormOpen(null); // Close the edit form
        toast.success('Task Updated Successfully');
      })
      .catch(error => {
        console.error('Failed to update task:', error);
        toast.error('Error Updating Task');
      });
  };

  const deleteTask = (id) => {
    fetch(`${process.env.API_ROUTE}/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(oldTasks => oldTasks.filter(task => task._id !== id));
        toast.success('Task Deleted Successfully');
      })
      .catch(error => {
        console.error('Failed to delete task:', error);
        toast.error('Error Deleting Task');
      });
  };

  const handleEditClick = (task) => {
    // Toggle edit form visibility for the clicked task
    if (editFormOpen === task._id) {
      setEditFormOpen(null); // Close edit form if already open
    } else {
      setEditFormOpen(task._id); // Open edit form for the clicked task
      setEditingTask(task);
      setNewTask({ ...task }); // Populate form fields with task details
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
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Displaying tasks */}
          {tasks.map(task => (
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
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-task-description">Task Description</Label>
                          <Textarea
                            id="edit-task-description"
                            placeholder="Enter task description"
                            value={newTask.description}
                            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-task-category">Task Category</Label>
                          <Input
                            id="edit-task-category"
                            placeholder="Enter task category"
                            value={newTask.category}
                            onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <div>
                            <Button variant="outline">Cancel</Button>
                          </div>
                          <Button onClick={() => updateTask(editingTask._id, newTask)}>
                            Save Changes
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {/* Edit button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditClick(task)}
                  >
                    <PenBox className="w-4 h-4" />
                  </Button>
                  {/* Delete button */}
                  <Button
                    className="hover:text-red-500 dark:hover:text-red-500"
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTask(task._id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  {/* Mark as complete/incomplete button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleCompletion(task._id)}
                  >
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
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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