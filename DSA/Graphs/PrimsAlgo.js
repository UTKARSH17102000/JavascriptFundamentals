// Tabnine
// Claude 3.5 Sonnet
// Certainly! I'll explain Prim's Algorithm as if it were asked in an interview, provide a JavaScript implementation, perform a dry run, and then give you some related questions with solutions and LeetCode links.
// Prim's Algorithm Explanation:
// Prim's algorithm is a greedy algorithm used to find the minimum spanning tree (MST) of a weighted, undirected graph. The MST is a subset of the edges that connects all vertices together with the minimum total edge weight, without creating any cycles.
// Here's how Prim's algorithm works:
// 1.
// Start with an arbitrary vertex as the initial MST.
// 2.
// Find the minimum weight edge that connects the MST to a vertex not in the MST.
// 3.
// Add this edge and the new vertex to the MST.
// 4.
// Repeat steps 2-3 until all vertices are included in the MST.
// JavaScript Implementation:
// PrimsAlgo.js
// function prim(graph) {
//     const n = graph.length;
//     const parent = new Array(n).fill(-1);
//     const key = new Array(n).fill(Infinity);
//     const mstSet = new Array(n).fill(false);

//     key[0] = 0;

//     for (let count = 0; count < n - 1; count++) {
//         const u = minKey(key, mstSet);
//         mstSet[u] = true;

//         for (let v = 0; v < n; v++) {
//             if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
//                 parent[v] = u;
//                 key[v] = graph[u][v];
//             }
//         }
//     }

//     return parent;
// }

// function minKey(key, mstSet) {
//     let min = Infinity;
//     let minIndex = -1;

//     for (let v = 0; v < key.length; v++) {
//         if (!mstSet[v] && key[v] < min) {
//             min = key[v];
//             minIndex = v;
//         }
//     }

//     return minIndex;
// }
// Dry Run:
// Let's consider the following graph:
//     2    3
// (0)---(1)---(2)
//  | \     \   |
//  |  \     \  |
//  6   8     5 7
//  |    \     \|
//  |     \    |
// (3)-----(4)
//     9
// Represented as an adjacency matrix:
// const graph = [
//     [0, 2, 0, 6, 0],
//     [2, 0, 3, 8, 5],
//     [0, 3, 0, 0, 7],
//     [6, 8, 0, 0, 9],
//     [0, 5, 7, 9, 0]
// ];

// const mst = prim(graph);
// console.log(mst);  // Output: [-1, 0, 1, 0, 1]
// Dry run steps:
// 1.
// Start with vertex 0. key[0] = 0, all others Infinity.
// 2.
// Add edge (0,1) with weight 2. Update key[1] = 2, parent[1] = 0.
// 3.
// Add edge (0,3) with weight 6. Update key[3] = 6, parent[3] = 0.
// 4.
// Add edge (1,4) with weight 5. Update key[4] = 5, parent[4] = 1.
// 5.
// Add edge (1,2) with weight 3. Update key[2] = 3, parent[2] = 1.
// The resulting MST is: [-1, 0, 1, 0, 1], where each index represents a vertex and the value represents its parent in the MST.
// Related Questions and Solutions:
// 1.
// Find the total weight of the Minimum Spanning Tree.
// PrimsAlgo.js
// function mstWeight(graph) {
//     const parent = prim(graph);
//     let totalWeight = 0;
//     for (let i = 1; i < parent.length; i++) {
//         totalWeight += graph[i][parent[i]];
//     }
//     return totalWeight;
// }

// console.log(mstWeight(graph));  // Output: 16
// 2.
// Detect if a graph is connected using Prim's algorithm.
// PrimsAlgo.js
// function isConnected(graph) {
//     const parent = prim(graph);
//     return !parent.includes(-1, 1);  // Check if all vertices except the first one have a parent
// }

// console.log(isConnected(graph));  // Output: true
// 3.
// Find the maximum edge weight in the Minimum Spanning Tree.
// PrimsAlgo.js
// function maxEdgeInMST(graph) {
//     const parent = prim(graph);
//     let maxWeight = -Infinity;
//     for (let i = 1; i < parent.length; i++) {
//         maxWeight = Math.max(maxWeight, graph[i][parent[i]]);
//     }
//     return maxWeight;
// }

// console.log(maxEdgeInMST(graph));  // Output: 6
// LeetCode Problems Related to Minimum Spanning Tree:
// 1.
// Min Cost to Connect All Points: https://leetcode.com/problems/min-cost-to-connect-all-points/
// 2.
// Optimize Water Distribution in a Village: https://leetcode.com/problems/optimize-water-distribution-in-a-village/
// 3.
// Connecting Cities With Minimum Cost: https://leetcode.com/problems/connecting-cities-with-minimum-cost/
// 4.
// Minimum Cost to Reach City With Discounts: https://leetcode.com/problems/minimum-cost-to-reach-city-with-discounts/
// These problems can be solved using variations of Prim's algorithm or other minimum spanning tree algorithms like Kruskal's algorithm. The core concept of finding a minimum spanning tree is crucial in solving these problems efficiently.
