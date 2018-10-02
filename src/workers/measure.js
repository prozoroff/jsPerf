const workercode = () => {

    let onmessage = function (e) {
        let start, end;
        const tasks = e.data.tasks,
            generalFunc = new Function(e.data.generalCode),
            iterations = e.data.iterations || 100,
            funcs = tasks.map(task => new Function(task.code)),
            result = [];

        for (let i = 0, l = funcs.length; i < l; i++) {
            const func = funcs[i];
            try {
                generalFunc();
                start = performance.now();
                for (let i = 0; i < iterations; ++i) {
                    func();
                }
                end = performance.now();
                const duration = end - start;
                result.push(duration);
            } catch (err) {
                console.error(tasks[i].name + ': ' + err);
                result.push(null);
            }
        }
        postMessage(result);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const measure_script = URL.createObjectURL(blob);

module.exports = measure_script;