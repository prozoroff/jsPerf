import React, { Component } from 'react';
import TaskList from './TaskList';
import Code from './Code';
import logo from './logo.svg';
import './App.css';
var nanoid = require('nanoid')

class App extends Component {

  constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            newName: '',
            iterations: 1000,
            generalCode: ''
        }
        this.removeTask = this.removeTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.changeTask = this.changeTask.bind(this);

        this.changeName = this.changeName.bind(this);
        this.changeGeneralCode = this.changeGeneralCode.bind(this);
        this.iterationsChange = this.iterationsChange.bind(this);
        this.runTasks = this.runTasks.bind(this);
    }

  removeTask(id) {
      this.setState(prevState => ({
        tasks: prevState.tasks.filter(tasks => tasks.id !== id)
      }));
  };

  addTask() {
      const {tasks, newName} = this.state;
        tasks.push({
          name: newName || 'Anonymous task',
          id: nanoid(),
          code: ''
        });
      this.setState({tasks,newName:''});
  };

  changeTask(taskId, code) {
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task =>
                (task.id !== taskId) ?
                    task :
                    {
                        ...task,
                        code
                    }
            )
      }))
  }

  changeName(event){
    this.setState({newName: event.target.value});
  }

  changeGeneralCode(code){
    this.setState({generalCode: code});
  }

  iterationsChange(event){
    this.setState({iterations: parseInt(event.target.value)});
  }

  runTasks() {
    const { tasks, generalCode, iterations } = this.state;
    //TODO Measure tasks
  }

  render() {
    const { tasks, generalCode } = this.state;
    const { removeTask, addTask, changeTask, changeName, changeGeneralCode, iterationsChange, runTasks } = this;
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">JsPerf</h1>
          </div>
        </header>
        <div className="App-body">
        <div className="context">
          <p>General Code</p>
          <Code value={generalCode} onChange={changeGeneralCode}/>
        </div>
        <div className="add-task">
          <input value={this.state.newName} onChange={changeName} type="text" placeholder="Task name"/>
          <button onClick={addTask}>+</button>
        </div>
        <div className="tasks">
          <TaskList tasks={tasks} onChange={changeTask} onRemove={removeTask}/>
        </div>
         {(tasks.length) ?
        <div className="run-tasks">
          <span>Iterations </span>
          <input value={this.state.iterations} onChange={iterationsChange} type="number"/>
          <button onClick={runTasks}>Evaluate</button>
        </div> :
        <div></div>
      }
        </div>
      </div>
    );
  }
}

export default App;
