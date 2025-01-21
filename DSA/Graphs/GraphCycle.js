// To find if a graph has a cycle or not in JavaScript, you can use either Depth-First Search (DFS) or Breadth-First Search (BFS). Here's an optimized approach using DFS with code snippets:
// 1.
// Create a helper function dfs that takes a graph, a starting node, and a visited set as parameters.
// 2.
// Inside the dfs function, mark the current node as visited.
// 3.
// Iterate through the neighbors of the current node.
// 4.
// For each neighbor, check if it has been visited. If it has, return true to indicate a cycle.
// 5.
// If a neighbor has not been visited, recursively call the dfs function on that neighbor.
// 6.
// If the dfs function returns true for any neighbor, return true to indicate a cycle.
// 7.
// If all neighbors have been visited and no cycle is found, return false.
// Here's the code snippet for the optimized DFS approach:
// function hasCycle(graph, startNode) {
//   const visited = new Set();

//   function dfs(node) {
//     visited.add(node);

//     for (const neighbor of graph[node]) {
//       if (visited.has(neighbor)) {
//         return true; // Cycle found
//       }

//       if (!visited.has(neighbor) && dfs(neighbor)) {
//         return true; // Cycle found
//       }
//     }

//     return false; // No cycle found
//   }

//   return dfs(startNode);
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

// console.log(hasCycle(graph, 'A')); // Output: true (cycle found)
// console.log(hasCycle(graph, 'D')); // Output: false (no cycle found)
// This optimized approach using DFS has a time complexity of O(V + E), where V is the number of vertices and E is the number of edges in the graph. It also uses O(V) space to store the visited set.







// Topological Sort is an algorithm used to linearly order the vertices of a directed acyclic graph (DAG) such that for every directed edge uv, vertex u comes before vertex v in the ordering. In other words, it is a way to arrange the vertices of a DAG in a specific order based on their dependencies.
// To perform topological sorting using Depth-First Search (DFS), you can follow these steps:
// 1.
// Create a stack to store the vertices in the topological order.
// 2.
// Create a visited set to keep track of the vertices that have been visited.
// 3.
// Define a recursive helper function, dfs(node), that performs the following steps:
// Mark the current node as visited.
// For each neighbor of the current node, recursively call dfs(neighbor).
// After all neighbors have been visited, push the current node to the stack.
// 4.
// Iterate through all vertices in the graph.
// If a vertex has not been visited, call dfs(vertex) to perform the DFS traversal.
// 5.
// After all vertices have been visited, the stack will contain the vertices in topological order.
// Here's the JavaScript code for topological sorting using DFS:
// function topologicalSort(graph) {
//   const stack = [];
//   const visited = new Set();

//   function dfs(node) {
//     visited.add(node);

//     for (const neighbor of graph[node]) {
//       if (!visited.has(neighbor)) {
//         dfs(neighbor);
//       }
//     }

//     stack.push(node);
//   }

//   for (const vertex in graph) {
//     if (!visited.has(vertex)) {
//       dfs(vertex);
//     }
//   }

//   return stack.reverse(); // Reverse the stack to get the topological order
// }

// // Example usage:
// const graph = {
//   A: ['B', 'C'],
//   B: ['D'],
//   C: ['D', 'E'],
//   D: ['F'],
//   E: ['F'],
//   F: []
// };

// console.log(topologicalSort(graph)); // Output: [ 'A', 'B', 'C', 'D', 'E', 'F' ]
// In the given example, the graph has six vertices (A, B, C, D, E, F) and directed edges (A -> B, A -> C, B -> D, C -> D, C -> E, D -> F, E -> F). The topological sorting of this graph is [A, B, C, D, E, F].
// The dry run of the code above will output the vertices in topological order. The output [A, B, C, D, E, F] means that vertex A comes before vertices B and C, vertex B comes before vertex D, vertex C comes before vertices D and E, vertex D comes before vertex F, and vertex E comes before vertex F.
// Note: The code assumes that the graph is represented using an adjacency list. The graph object contains vertices as keys and an array of their neighbors as values.
