// Here are implementations of Breadth-First Search (BFS) and Depth-First Search (DFS) in JavaScript, along with explanations for each line and guidance on when to use them.
// Breadth-First Search (BFS)
// function bfs(graph, startNode) {
//   const queue = [startNode];
//   const visited = new Set();

//   while (queue.length > 0) {
//     const currentNode = queue.shift(); // Remove the first element from the queue

//     if (!visited.has(currentNode)) {
//       visited.add(currentNode);
//       console.log(currentNode); // Perform desired action on the current node

//       // Add all neighboring nodes to the queue
//       graph[currentNode].forEach((neighbor) => {
//         if (!visited.has(neighbor)) {
//           queue.push(neighbor);
//         }
//       });
//     }
//   }
// }


// // Example usage:
// const graph = {
//   A: ['B', 'C'],
//   B: ['A', 'D', 'E'],
//   C: ['A', 'F'],
//   D: ['B'],
//   E: ['B', 'F'],
//   F: ['C', 'E']
// };

// bfs(graph, 'A');
// Explanation:
// BFS starts at a given node (in this case, startNode) and visits all its neighbors before moving on to the next level of neighbors.
// It uses a queue to keep track of nodes to visit. The queue array is initialized with the startNode.
// The visited set keeps track of nodes that have already been visited to avoid revisiting them.
// The while loop continues until there are no more nodes in the queue.
// Inside the loop, the first node from the queue is removed using queue.shift().
// If the current node has not been visited, it is added to the visited set and its value is printed (or any desired action can be performed).
// All neighboring nodes of the current node are added to the queue, but only if they have not been visited yet.
// Use case:
// BFS is useful when you want to find the shortest path between two nodes in an unweighted graph or when you want to perform level-order traversal of a tree or graph.







// Depth-First Search (DFS)
// function dfs(graph, startNode) {
//   const stack = [startNode];
//   const visited = new Set();

//   while (stack.length > 0) {
//     const currentNode = stack.pop(); // Remove the last element from the stack

//     if (!visited.has(currentNode)) {
//       visited.add(currentNode);
//       console.log(currentNode); // Perform desired action on the current node

//       // Add all neighboring nodes to the stack
//       graph[currentNode].forEach((neighbor) => {
//         if (!visited.has(neighbor)) {
//           stack.push(neighbor);
//         }
//       });
//     }
//   }
// }

// // Example usage:
// const graph = {
//   A: ['B', 'C'],
//   B: ['A', 'D', 'E'],
//   C: ['A', 'F'],
//   D: ['B'],
//   E: ['B', 'F'],
//   F: ['C', 'E']
// };

// dfs(graph, 'A');
// Explanation:
// DFS starts at a given node (in this case, startNode) and explores as far as possible along each branch before backtracking.
// It uses a stack to keep track of nodes to visit. The stack array is initialized with the startNode.
// The visited set keeps track of nodes that have already been visited to avoid revisiting them.
// The while loop continues until there are no more nodes in the stack.
// Inside the loop, the last node from the stack is removed using stack.pop().
// If the current node has not been visited, it is added to the visited set and its value is printed (or any desired action can be performed).
// All neighboring nodes of the current node are added to the stack, but only if they have not been visited yet.
// Use case:
// DFS is useful when you want to explore all possible paths in a graph or when you want to perform a pre-order traversal of a tree or graph. It can also be used to detect cycles in a graph.
// Note: In both implementations, you can replace console.log(currentNode) with any desired action to perform on each node.






// // Breadth-First Search (BFS) using recursion
// function bfsRecursive(graph, startNode, visited = new Set()) {
//     if (!visited.has(startNode)) {
//       visited.add(startNode);
//       console.log(startNode); // Perform desired action on the current node
  
//       // Add all neighboring nodes to the queue and recursively call bfsRecursive
//       graph[startNode].forEach((neighbor) => {
//         bfsRecursive(graph, neighbor, visited);
//       });
//     }
//   }
  
//   // Example usage:
//   const graph = {
//     A: ['B', 'C'],
//     B: ['A', 'D', 'E'],
//     C: ['A', 'F'],
//     D: ['B'],
//     E: ['B', 'F'],
//     F: ['C', 'E']
//   };
  
//   bfsRecursive(graph, 'A');
  
  
//   // Depth-First Search (DFS) using recursion
//   function dfsRecursive(graph, startNode, visited = new Set()) {
//     if (!visited.has(startNode)) {
//       visited.add(startNode);
//       console.log(startNode); // Perform desired action on the current node
  
//       // Add all neighboring nodes to the stack and recursively call dfsRecursive
//       graph[startNode].forEach((neighbor) => {
//         dfsRecursive(graph, neighbor, visited);
//       });
//     }
//   }
  
//   // Example usage:
//   const graph = {
//     A: ['B', 'C'],
//     B: ['A', 'D', 'E'],
//     C: ['A', 'F'],
//     D: ['B'],
//     E: ['B', 'F'],
//     F: ['C', 'E']
//   };
  
//   dfsRecursive(graph, 'A');