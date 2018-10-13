import React, { Component } from 'react';
import TaskList from './TaskList';
import Code from './Code';
import logo from './logo.svg';
import './App.css';

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
    this.worker = new Worker('measure.js');
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
          <div className="samples">
           <h2>Samples</h2>
          <a href="https://prozoroff.github.io/jsPerf/?%7B%22generalCode%22%3A%22arr%20%3D%20%5B%5D%3B%5Cnvar%20str%20%3D%20%27%27%3B%5Cnfor(var%20i%20%3D%200%3B%20i%20%3C%2010%3B%20i%2B%2B)%7B%5Cn%20%20%20%20str%20%2B%3D%20i%3B%5Cn%20%20%20%20arr.push(str)%5Cn%7D%22%2C%22iterations%22%3A1000%2C%22tasks%22%3A%5B%7B%22name%22%3A%22array%20join%22%2C%22id%22%3A%22JvguKtR5CW8rOw2fHPCyK%22%2C%22code%22%3A%22var%20result%20%3D%20%27%27%3B%5Cr%5Cnresult%20%2B%3D%20arr.join(%27%27)%3B%22%2C%22result%22%3A%225.60%20ms%22%2C%22colorStyle%22%3A%7B%22color%22%3A%22rgb(220%2C0%2C0)%22%7D%7D%2C%7B%22name%22%3A%22manual%20concatenation%22%2C%22id%22%3A%22L_9xPhrs5Te9LqAopWnb8%22%2C%22code%22%3A%22var%20result%20%3D%20%27%27%3B%5Cr%5Cnfor%20(var%20i%20%3D%200%2C%20l%20%3D%20arr.length%3B%20i%20%3C%20l%3B%20i%2B%2B)%20%7B%5Cr%5Cn%20%20%20%20result%20%2B%3D%20arr%5Bi%5D%3B%5Cr%5Cn%7D%22%2C%22result%22%3A%221.60%20ms%22%2C%22colorStyle%22%3A%7B%22color%22%3A%22rgb(0%2C220%2C0)%22%7D%7D%2C%7B%22name%22%3A%22String.ptototype.concat%22%2C%22id%22%3A%22epBuR5L6iFlBE3ugHtUZF%22%2C%22code%22%3A%22var%20result%20%3D%20%27%27%3B%5Cr%5Cnfor%20(var%20i%20%3D%200%2C%20l%20%3D%20arr.length%3B%20i%20%3C%20l%3B%20i%2B%2B)%20%7B%5Cr%5Cn%20%20%20%20result%20%3D%20result.concat(arr%5Bi%5D)%3B%5Cr%5Cn%7D%22%2C%22result%22%3A%221.50%20ms%22%2C%22colorStyle%22%3A%7B%22color%22%3A%22rgb(0%2C220%2C0)%22%7D%7D%5D%7D">String Concatenation</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
