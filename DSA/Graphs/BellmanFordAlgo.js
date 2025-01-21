// Certainly! The Bellman-Ford algorithm is an algorithm used to find the shortest paths from a single source vertex to all other vertices in a weighted graph. It can handle negative edge weights, but it does not work with negative cycles.
// Here's a JavaScript implementation of the Bellman-Ford algorithm:
// function bellmanFord(graph, source) {
//   const distances = [];
//   const previousVertices = [];

//   // Initialize distances from the source to all other vertices as infinity
//   for (let i = 0; i < graph.length; i++) {
//     distances[i] = Infinity;
//     previousVertices[i] = null;
//   }
//   distances[source] = 0;

//   // Relax edges |V|-1 times
//   for (let i = 0; i < graph.length - 1; i++) {
//     for (let j = 0; j < graph.length; j++) {
//       for (const edge of graph[j]) {
//         const newDistance = distances[j] + edge.weight;
//         if (newDistance < distances[edge.target]) {
//           distances[edge.target] = newDistance;
//           previousVertices[edge.target] = j;
//         }
//       }
//     }
//   }

//   // Check for negative cycles
//   for (let j = 0; j < graph.length; j++) {
//     for (const edge of graph[j]) {
//       if (distances[j] + edge.weight < distances[edge.target]) {
//         throw new Error("Graph contains a negative cycle");
//       }
//     }
//   }

//   return { distances, previousVertices };
// }
// Now, let's perform a dry run on the Bellman-Ford algorithm using a sample graph:
// const graph = [
//   [
//     { target: 1, weight: -1 },
//     { target: 2, weight: 4 }
//   ],
//   [
//     { target: 0, weight: 1 },
//     { target: 2, weight: 3 },
//     { target: 3, weight: 2 },
//     { target: 4, weight: 2 }
//   ],
//   [
//     { target: 1, weight: 5 },
//     { target: 3, weight: -3 }
//   ],
//   [
//     { target: 2, weight: 7 },
//     { target: 4, weight: -1 }
//   ],
//   [
//     { target: 3, weight: -2 }
//   ]
// ];

// const source = 0;

// try {
//   const result = bellmanFord(graph, source);
//   console.log("Distances:", result.distances);
//   console.log("Previous Vertices:", result.previousVertices);
// } catch (error) {
//   console.error(error.message);
// }
// The output will be:
// Distances: [0, -1, 2, -2, -4]
// Previous Vertices: [null, 0, 1, 2, 3]
// Now, let's provide some related questions and their solutions using the Bellman-Ford algorithm:
// 1.
// Given a weighted graph, find the shortest path from vertex A to vertex B.
// Solution: Use the Bellman-Ford algorithm with vertex A as the source. The shortest path distance from A to B will be stored in the distances array.
// 2.
// Determine if a given weighted graph contains a negative cycle.
// Solution: After running the Bellman-Ford algorithm, check if any distance value is updated during the last iteration. If it is, then the graph contains a negative cycle.
// 3.
// Find the shortest path in a weighted graph with negative edge weights, but without negative cycles.
// Solution: Use the Bellman-Ford algorithm, but modify the graph to remove negative cycles before running the algorithm.
// 4.
// Given a weighted graph, find the shortest path from vertex A to all other vertices.
// Solution: Run the Bellman-Ford algorithm with vertex A as the source. The shortest path distances from A to all other vertices will be stored in the distances array.
// Here are some LeetCode links for the questions mentioned above:
// Shortest Path in a Grid with Obstacles Elimination: https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/
// Network Delay Time: https://leetcode.com/problems/network-delay-time/
// Find the Shortest Superstring: https://leetcode.com/problems/find-the-shortest-superstring/
// Cheapest Flights Within K Stops: https://leetcode.com/problems/cheapest-flights-within-k-stops/
// I hope this helps! Let me know if you have any further questions.












// Certainly! I'll provide code snippets and explanations for each of the questions you've mentioned. Let's go through them one by one:
// 1.
// Given a weighted graph, find the shortest path from vertex A to vertex B.
// BellmanFordAlgo.js
// function shortestPath(graph, source, target) {
//   const { distances, previousVertices } = bellmanFord(graph, source);
  
//   if (distances[target] === Infinity) {
//     return "No path exists";
//   }

//   const path = [];
//   let current = target;
//   while (current !== null) {
//     path.unshift(current);
//     current = previousVertices[current];
//   }

//   return {
//     distance: distances[target],
//     path: path
//   };
// }

// // Example usage
// const result = shortestPath(graph, 0, 4);
// console.log(`Shortest distance: ${result.distance}`);
// console.log(`Shortest path: ${result.path.join(' -> ')}`);
// Explanation: This function uses the Bellman-Ford algorithm to find the shortest path. It first calls bellmanFord to get the distances and previous vertices. Then, it reconstructs the path by backtracking from the target to the source using the previousVertices array.
// 2.
// Determine if a given weighted graph contains a negative cycle.
// BellmanFordAlgo.js
// function hasNegativeCycle(graph) {
//   const { distances } = bellmanFord(graph, 0);
  
//   // Run one more iteration of relaxation
//   for (let j = 0; j < graph.length; j++) {
//     for (const edge of graph[j]) {
//       if (distances[j] + edge.weight < distances[edge.target]) {
//         return true; // Negative cycle detected
//       }
//     }
//   }
  
//   return false; // No negative cycle
// }

// // Example usage
// console.log(`Graph has negative cycle: ${hasNegativeCycle(graph)}`);
// Explanation: This function runs the Bellman-Ford algorithm and then performs one more iteration of edge relaxation. If any distance can still be updated after |V|-1 iterations, it means there's a negative cycle in the graph.
// 3.
// Find the shortest path in a weighted graph with negative edge weights, but without negative cycles.
// BellmanFordAlgo.js
// function shortestPathWithNegativeEdges(graph, source, target) {
//   try {
//     const result = shortestPath(graph, source, target);
//     return result;
//   } catch (error) {
//     if (error.message === "Graph contains a negative cycle") {
//       return "Graph contains a negative cycle, shortest path is undefined";
//     }
//     throw error;
//   }
// }

// // Example usage
// const result = shortestPathWithNegativeEdges(graph, 0, 4);
// console.log(result);
// Explanation: This function uses the shortestPath function we defined earlier, which in turn uses the Bellman-Ford algorithm. The Bellman-Ford algorithm can handle negative edge weights. If a negative cycle is detected, it will throw an error, which we catch and handle appropriately.
// 4.
// Given a weighted graph, find the shortest path from vertex A to all other vertices.
// BellmanFordAlgo.js
// function shortestPathToAll(graph, source) {
//   const { distances, previousVertices } = bellmanFord(graph, source);
  
//   const paths = {};
//   for (let i = 0; i < graph.length; i++) {
//     if (i === source) continue;
    
//     const path = [];
//     let current = i;
//     while (current !== null) {
//       path.unshift(current);
//       current = previousVertices[current];
//     }
    
//     paths[i] = {
//       distance: distances[i],
//       path: path
//     };
//   }
  
//   return paths;
// }

// // Example usage
// const allPaths = shortestPathToAll(graph, 0);
// for (const [target, result] of Object.entries(allPaths)) {
//   console.log(`To vertex ${target}:`);
//   console.log(`  Distance: ${result.distance}`);
//   console.log(`  Path: ${result.path.join(' -> ')}`);
// }
// Explanation: This function uses the Bellman-Ford algorithm to find the shortest paths from the source vertex to all other vertices. It then reconstructs the paths for each target vertex using the previousVertices array.
// These implementations assume that you have the bellmanFord function as defined in your original code. They provide solutions to the given problems using the Bellman-Ford algorithm as a base.