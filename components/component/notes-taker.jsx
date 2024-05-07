'use client'
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function NotesTaker({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', time: '', category: '', completed: '' });

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = (task) => {
    try {
      task.completed = false;
      task.time = new Date();
      console.log(task);
      fetch('/api/tasks', {
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
          return fetch('/api/tasks');
        })
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => { console.error('Failed to add task:', error); toast.error('Error Posting Task'); });
    } catch (error) {
      toast.error('Error Posting Task');
      console.log(error);
    }
  };

  const updateTask = (id, updatedTask) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks(oldTasks => oldTasks.map(task => task._id === id ? data : task));
        toast.success('Task Updated Successfully');
      });
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setTasks(oldTasks => oldTasks.filter(task => task._id !== id));
        window.alert('Task deleted successfully');
        toast.success('Task Deleted Successfully');
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <header
        className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task App</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="primary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[400px] p-4 space-y-4">
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
              <div className="flex items-center gap-2">
                <Input className="w-full" id="new-category" placeholder="Add new category" value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })} />
              </div>
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
          {tasks && tasks.map(task => (
            <Card
              key={task._id}
              className="p-4 border border-gray-200 rounded-lg dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <Checkbox id={`task-${task._id}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(task.time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} {new Date(task.time).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-medium mb-1">{task.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-900 dark:text-blue-100">
                  {task.category}
                </span>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-title">Task Title</Label>
                        <Input id="task-title" placeholder="Enter task title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-description">Task Description</Label>
                        <Textarea
                          className="min-h-[100px]"
                          id="task-description"
                          placeholder="Enter task description" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-category">Task Category</Label>
                        <div className="flex items-center gap-2">
                          <Select id="task-category">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="writing">Writing</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input className="w-full" id="new-category" placeholder="Add new category" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <div>
                          <Button variant="outline">Cancel</Button>
                        </div>
                        <Button onClick={() => updateTask(task._id, /* updated task data */)}>Save Changes</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    className="hover:text-red-500 dark:hover:text-red-500"
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTask(task._id)}>
                    <TrashIcon className="w-4 h-4" />
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

function DeleteIcon(props) {
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
      strokeLinejoin="round">
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}

function PlusIcon(props) {
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
      strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
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
      strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
