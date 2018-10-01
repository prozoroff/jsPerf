onmessage = function(e) {
  let start, end;
  const iterations = e.iterations || 100;

    try {
        start = performance.now();
        for (let i = 0; i < iterations; ++i) {
            e.task.func();
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

module.exports = measure_script;