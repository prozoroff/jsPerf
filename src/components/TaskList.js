import PropTypes from 'prop-types'
import React from 'react'
import Task from './Task'
import './TaskList.css';

const TaskList = ({ tasks = [], onRemove = f => f, onChange = f => f }) =>
    <div className="task-list">
        {(tasks.length === 0) ?
            <p>No Tasks Listed. (Add a Task)</p> :
            tasks.map(task =>
                <Task key={task.id}
                    {...task}
                    onChange={(code) => onChange(task.id, code)}
                    onRemove={() => onRemove(task.id)} />
            )
        }
    </div>

TaskList.propTypes = {
    tasks: PropTypes.array,
    onRemove: PropTypes.func,
    onChange: PropTypes.func
}

export default TaskList
