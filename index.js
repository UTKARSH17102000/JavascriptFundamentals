function memoOne(fn) {
    const cache = {};
    return function(...args) {
        const key = args.join('_');
          
    }
}


const a= [1,2,3,[4,[5,6,7],8,[9,10]]]


const result = [];

function flatten(arr){
    arr.forEach((item) =>{
     if(Array.isArray(item)){
         flatten(item);
     }else {
         result.push(item);
     }
    })
    return result;
}

console.log('flatten', flatten(a));



console.log('chunk');

function chunk(arr, size) {
    const result = [];
    let minAns =[];
    for(let i=0; i<arr.length; i=i+1){
        minAns.push(arr[i]);
        if(minAns.length === size){
            result.push([...minAns]);
            minAns = []; // minAns.length = 0
        }
    }
    return result;
}

console.log('chunk', chunk([1,2,3,4,5,5], 3));




function count()
{
 const value = function outer(){
    var count = 0;
    return function inner(){
        count++;
        return inner;
    }
   }();

   return value;
}

console.log('count', count());
console.log('count', count());
console.log('count', count());




// Learn About Array splice and slice and there use cases and some examples.



/**
 * Returns a memoized version of the provided function.
 *
 * @param {Function} func - The function to be memoized.
 * @returns {Function} A memoized version of the input function.
 */
function memoize(func) {
    // Implement memoization logic here
    const cache = {};
    return function memoizedFunc(...args){
      const key = args.join('_');
      if(cache.hasOwnProperty(key)){
        return cache[key];
      }
      cache[key] = func.apply(this, [...args]);
      return cache[key];
    }
  }
  module.exports = memoize;
  
  
  // Example usage
  const expensiveCalculation = (param1, param2) => {
    // Complex and time-consuming calculations here
    return param1 + param2;  // Example calculation
  };
  
  const memoizedCalculation = memoize(expensiveCalculation);
  
  // Calling the memoized function
  const result1 = memoizedCalculation(10, 20);  // First call
  console.log(result1);
  const result2 = memoizedCalculation(10, 20);  // Cached result
  console.log(result2);
  