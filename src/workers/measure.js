const workercode = () => {

  let onmessage = function(e) { 
    let start, end;
  const task = e.data.task,
    iterations = e.data.iterations || 100,
    func = new Function(task.code);

    try {
        start = performance.now();
        for (let i = 0; i < iterations; ++i) {
            func();
        }
        end = performance.now();
        const duration = end - start;
        postMessage({
            status: 'ok',
            result: duration
        });
    } catch (err) {
        postMessage({
            status: 'error',
            result: task.name + ' ' + err
        });
    }
  }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const measure_script = URL.createObjectURL(blob);

module.exports = measure_script;