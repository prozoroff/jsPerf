import React, { Component } from 'react';
import TaskList from './TaskList';
import Code from './Code';
import logo from './logo.svg';
import './App.css';

import measure_script from "../workers/measure.js";

const nanoid = require('nanoid');
const replaceSeq = '<$>!';

class App extends Component {

  constructor(props) {
    super(props)

    var data = this.getUriData();

    this.state = {
      tasks: data && data.tasks || [],
      newName: '',
      iterations: data && data.iterations || 1000,
      generalCode: data && data.generalCode || ''
    }

    this.removeTask = this.removeTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.changeTask = this.changeTask.bind(this);

    this.changeName = this.changeName.bind(this);
    this.changeGeneralCode = this.changeGeneralCode.bind(this);
    this.iterationsChange = this.iterationsChange.bind(this);
    this.setUriData = this.setUriData.bind(this);
  }

  getUriData(){
    const uriDataString = decodeURIComponent(window.location.href).split("?").slice(1).join('?');
    return uriDataString && uriDataString.length ? JSON.parse(uriDataString.replace(replaceSeq,'?')) : null;
  }

  setUriData(){
    const { tasks, generalCode, iterations } = this.state,
      strData = JSON.stringify({generalCode, iterations, tasks}),
      data = encodeURIComponent(strData);

    window.location.href = window.location.href.split("?")[0] + "?" + data.replace('?', replaceSeq);
  }

  componentDidMount() {
    this.worker = new Worker(measure_script);
    this.state.tasks.length && this.runTasks();
  };

  removeTask(id) {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(tasks => tasks.id !== id)
    }));
  };

  addTask() {
    const { tasks, newName } = this.state;
    tasks.push({
      name: newName || 'Anonymous task',
      id: nanoid(),
      code: ''
    });
    this.setState({ tasks, newName: '' });
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

  changeName(event) {
    this.setState({ newName: event.target.value });
  }

  changeGeneralCode(code) {
    this.setState({ generalCode: code });
  }

  iterationsChange(event) {
    this.setState({ iterations: parseInt(event.target.value) });
  }

  resultStyle(max, min, value) {
    const weight = max === min ? 0 : (value - min) / (max - min),
      red = Math.round(220 * (weight < .5 ? 0 : weight)),
      green = Math.round(220 * (weight < .5 ? 1 : (1 - weight)))
    return { color: `rgb(${red},${green},0)` };
  }

  updateTasksResults(results) {

    const correctResults = results.filter(r => r !== null),
      max = Math.max(...correctResults),
      min = Math.min(...correctResults);

    this.setState(prevState => ({
      tasks: prevState.tasks.map((task, index) => {
        const result = results[index],
          isCorrect = result !== null;
        task.result = isCorrect ? result.toFixed(2) + ' ms' : 'error';
        task.colorStyle = isCorrect ? this.resultStyle(max, min, results[index]) : {color: 'grey'};
        return task;
      }
      )
    }));
  }

  runTasks() {
    const { tasks, generalCode, iterations } = this.state,
      updateTasksResults = this.updateTasksResults.bind(this);

    this.worker.onmessage = function (e) {
      updateTasksResults(e.data);
    }

    this.worker.postMessage({ tasks, iterations, generalCode });
  }

  render() {
    const { tasks, generalCode } = this.state;
    const { removeTask, addTask, changeTask, changeName, changeGeneralCode, iterationsChange, setUriData } = this;
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
            <Code value={generalCode} onChange={changeGeneralCode} />
          </div>
          <div className="add-task">
            <input value={this.state.newName} onChange={changeName} type="text" placeholder="Task name" />
            <button onClick={addTask}>+</button>
          </div>
          <div className="tasks">
            <TaskList tasks={tasks} onChange={changeTask} onRemove={removeTask} />
          </div>
          {(tasks.length) ?
            <div className="run-tasks">
              <span>Iterations </span>
              <input value={this.state.iterations} onChange={iterationsChange} type="number" />
              <button onClick={setUriData}>Evaluate</button>
            </div> :
            <div></div>
          }
        </div>
      </div>
    );
  }
}

export default App;
