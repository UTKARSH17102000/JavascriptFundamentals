const processorFn = (task, callback) => { 
    setTimeout(() => { 
        console.log('Processing task: ' + task.name); 
        callback(`${task.name} data is computed`); 
    }, 500); 
}

const onCompleteFn = (task, data) => { 
    console.log('Task has completed processing:', task.name, '| Result:', data); 
}

class TaskQueue {
    constructor(processorFn, onCompleteFn, concurrency) {
        this.processorFn = processorFn;
        this.onCompleteFn = onCompleteFn;
        this.concurrency = concurrency;
        this.running = 0;
        this.tasks = [];
        this.drainCallback = null;
    }

    push(input) {
        // Handle both single tasks and arrays of tasks
        const newTasks = Array.isArray(input) ? input : [input];
        this.tasks.push(...newTasks);
        
        // Start processing
        this.run();
    }

    run() {
        // While we have tasks and haven't hit the concurrency limit
        while (this.running < this.concurrency && this.tasks.length > 0) {
            const task = this.tasks.shift();
            this.running++;

            this.processorFn(task, (data) => {
                this.onCompleteFn(task, data);
                this.running--;
                
                // Once a task finishes, try to run the next one
                this.run();
                
                // Check if the queue is empty and all tasks are done
                if (this.tasks.length === 0 && this.running === 0 && this.drainCallback) {
                    this.drainCallback();
                    this.drainCallback = null; // Reset so it doesn't fire twice
                }
            });
        }
    }

    drain(callbackFn) {
        if (this.tasks.length === 0 && this.running === 0) {
            callbackFn();
        } else {
            this.drainCallback = callbackFn;
        }
    }
}

// --- Execution ---

const myQueue = new TaskQueue(processorFn, onCompleteFn, 2);

// Add items to the queue
myQueue.push({name: 'foo'});
myQueue.push([{name: 'baz 1'}, {name: 'bay 2'}, {name: 'bax 3'}]);

myQueue.drain(() => {
    console.log('All tasks finished! The queue is now empty.');
});




// Work on my project explantion know more about future perspect.
// Work on DSA and Graphs and Arrays.

// Chalanging tech task at making Audit Platform.