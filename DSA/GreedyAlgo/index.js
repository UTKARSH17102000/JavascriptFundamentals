

// Activity Selection Problem 
// Basic Version: Select the maximum number of activities that don't overlap.

// Variation: Activities have different profits, select the activities to maximize profit without overlapping.


const start = [10,12,20];
const end = [20,25,30];

// here both arrays are sorted based on the end time 
// return the number of max activities can be done at a time without overlapping. and also return the index of activities choosen in the selected activities

function a(start, end){
    let n = start.length;
    let i = 0;
    let j = 0;
    let selected = [0]; // Adding 0 index as it is sorted based on the end time so first selection will have the least blocking time hence most optimal selection

    for(i = 1;i< n;i++){
        if(start[i]>= end[j]){
            selected.push(i);
            j = i;
        }
    }
    return [selected.length, selected]
}

console.log(a(start, end));


//Next Question Fractional Knapsack with Greedy Algorithms

const v = [60,100,120];
const w = [10,20,30];

const capacity = 50;

function findTotalVal(v, w, capacity){
    const ratio = [];
    let c = capacity;
    let result = 0;

    for (let i =0;i< v.length;i++){
        ratio[i] =[];
        ratio[i][0] = v[i]/w[i];
        ratio[i][1] = i;
    }
    console.log(ratio);
    ratio.sort((a, b) => b[0] - a[0]); // sort the ratios in descending order 

    for (let i =0;i<ratio.length;i++){
        if(c>= w[i]){
            c -= w[i];
            result = result + v[i];
            console.log(`Selected Item ${ratio[i][1]} with weight ${w[i]} and value ${v[i]} and remaining capacity is ${c}`);
        }else{
            result += ratio[i][0]*c;
            console.log(`Selected Item ${ratio[i][1]} with weight ${w[i]} and value ${ratio[i][0]*c} and remaining capacity is ${0}`);
        }
    }
    return result;
}


console.log(findTotalVal(v, w, capacity)); // should return 240




// Greedy algorithms are a type of algorithm that make the locally optimal choice at each step with the hope of finding a global optimum. In other words, they make decisions based on the immediate benefit they provide rather than considering the overall impact.
// Here are some key characteristics of greedy algorithms:
// 1.
// Optimal substructure: The problem can be divided into smaller subproblems, and the optimal solution to the original problem can be constructed from optimal solutions to the subproblems.
// 2.
// Greedy choice property: At each step, the algorithm makes the choice that appears to be the best at that moment, without considering future consequences.
// 3.
// Independence: The choices made by the algorithm do not depend on the choices made by other parts of the algorithm.
// Now, let's look at some tricky and most asked questions based on greedy algorithms:
// 1.
// Coin Change Problem: Given a set of coin denominations and a total amount of money, find the minimum number of coins needed to make up that amount.
// Solution: Use a greedy algorithm to select the largest denomination coin that is less than or equal to the remaining amount. Repeat this process until the remaining amount is zero.
// Dry run: Let's say we have coin denominations [1, 2, 5, 10] and a total amount of 13. The greedy algorithm would select the coin denomination 10 first, then 2 coins of denomination 1, and finally 1 coin of denomination 2. This results in a total of 4 coins.
// 2.
// Job Scheduling Problem: Given a set of jobs with their respective deadlines and profits, find an optimal schedule to maximize the total profit while meeting the deadlines.
// Solution: Use a greedy algorithm to select the job with the highest profit-to-deadline ratio (profit divided by deadline) that is not yet scheduled. Repeat this process until all jobs are scheduled.
// Dry run: Let's say we have the following jobs with their respective deadlines and profits: [(A, 10, 50), (B, 5, 20), (C, 8, 30), (D, 2, 10)]. The greedy algorithm would select job C first, then job A, and finally jobs B and D. This results in a total profit of 110.
// 3.
// Fractional Knapsack Problem: Given a set of items with their respective weights and values, find an optimal fractional solution to maximize the total value while keeping the total weight within a given capacity.
// Solution: Use a greedy algorithm to select the item with the highest value-to-weight ratio (value divided by weight) that is not yet fully packed. Repeat this process until the capacity is reached.
// Dry run: Let's say we have the following items with their respective weights and values: [(A, 10, 60), (B, 20, 100), (C, 30, 120)]. The greedy algorithm would select item B first, then a fraction of item A, and finally a fraction of item C. This results in a total value of 180.
// These examples demonstrate how greedy algorithms can be applied to solve various real-world problems. It's important to note that greedy algorithms may not always provide the optimal solution, but they can be efficient in terms of time complexity.||










// Sure, here's the JavaScript code for each problem using a greedy algorithm approach:
// 1.
// Coin Change Problem:
// function coinChange(coins, amount) {
//   const dp = new Array(amount + 1).fill(Infinity);
//   dp[0] = 0;

//   for (let i = 1; i <= amount; i++) {
//     for (const coin of coins) {
//       if (i >= coin) {
//         dp[i] = Math.min(dp[i], dp[i - coin] + 1);
//       }
//     }
//   }

//   return dp[amount] === Infinity ? -1 : dp[amount];
// }

// // Example usage:
// const coins = [1, 2, 5];
// const amount = 11;
// console.log(coinChange(coins, amount)); // Output: 3
// 2.
// Job Scheduling Problem:
// function jobScheduling(jobs) {
//   jobs.sort((a, b) => b.profit / b.deadline - a.profit / a.deadline);

//   const result = [];
//   let time = 0;

//   for (const job of jobs) {
//     if (time + job.deadline <= job.deadline) {
//       result.push(job);
//       time += job.deadline;
//     }
//   }

//   return result;
// }

// // Example usage:
// const jobs = [
//   { id: 1, deadline: 4, profit: 20 },
//   { id: 2, deadline: 1, profit: 10 },
//   { id: 3, deadline: 1, profit: 40 },
//   { id: 4, deadline: 1, profit: 30 }
// ];
// console.log(jobScheduling(jobs)); // Output: [ { id: 3, deadline: 1, profit: 40 }, { id: 4, deadline: 1, profit: 30 }, { id: 1, deadline: 4, profit: 20 } ]
// 3.
// Fractional Knapsack Problem:
// function fractionalKnapsack(items, capacity) {
//   items.sort((a, b) => b.value / b.weight - a.value / a.weight);

//   let totalValue = 0;

//   for (const item of items) {
//     if (capacity >= item.weight) {
//       capacity -= item.weight;
//       totalValue += item.value;
//     } else {
//       totalValue += (item.value / item.weight) * capacity;
//       capacity = 0;
//       break;
//     }
//   }

//   return totalValue;
// }

// // Example usage:
// const items = [
//   { weight: 10, value: 60 },
//   { weight: 20, value: 100 },
//   { weight: 30, value: 120 }
// ];
// const capacity = 50;
// console.log(fractionalKnapsack(items, capacity)); // Output: 180
// In each problem, the greedy algorithm is applied based on the specific criteria mentioned in the problem description. The code follows the pattern of sorting the input data, iterating through the sorted data, and making decisions based on the immediate benefit provided by each step. The final solution is then returned.
