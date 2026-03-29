/**
 * Soni Frontend — Hard — DAG task order + parallel execution with limit (Rippling, Uber, Amazon)
 * Topological sort by dependencies; run tasks with concurrency cap.
 */

function resolveDependencies(graph) {
  const graphNodes = Object.keys(graph);
  const adjList = new Map();
  const inDegree = new Map();

  for (const node of graphNodes) {
    const { dependency } = graph[node] || {};
    for (const dep of dependency || []) {
      const neighbors = adjList.get(dep) || [];
      neighbors.push(node);
      adjList.set(dep, neighbors);
    }
    inDegree.set(node, dependency ? dependency.length : 0);
  }

  const topologicalOrder = [];
  const queue = [];
  for (const node of graphNodes) {
    if (inDegree.get(node) === 0) {
      queue.push(node);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift();
    topologicalOrder.push(current);
    const neighbors = adjList.get(current) || [];
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return topologicalOrder;
}

function executeTasksInParallel(order, graph, limit = 2) {
  let activeTasks = 0;
  let index = 0;
  return new Promise((resolve) => {
    function executeNext() {
      if (index >= order.length && activeTasks === 0) {
        resolve();
        return;
      }
      while (index < order.length && activeTasks < limit) {
        const currentTask = order[index];
        index++;
        activeTasks++;
        graph[currentTask].task(() => {
          console.log(`${currentTask} completed.`);
          activeTasks--;
          executeNext();
        });
      }
    }
    executeNext();
  });
}

function taskA(done) {
  console.log("Task A Completed");
  done();
}

function taskB(done) {
  setTimeout(() => {
    console.log("Task B Completed");
    done();
  }, 2000);
}

function taskC(done) {
  setTimeout(() => {
    console.log("Task C Completed");
    done();
  }, 200);
}

function taskD(done) {
  console.log("Task D Completed");
  done();
}

function taskE(done) {
  console.log("Task E Completed");
  done();
}

const asyncGraph = {
  e: {
    dependency: ["c", "d"],
    task: taskE,
  },
  c: {
    task: taskC,
  },
  d: {
    dependency: ["a", "b"],
    task: taskD,
  },
  a: {
    task: taskA,
  },
  b: {
    task: taskB,
  },
};

const taskOrder = resolveDependencies(asyncGraph);
executeTasksInParallel(taskOrder, asyncGraph, 2).then(() => {
  console.log("All tasks completed.");
});
