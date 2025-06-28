// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Try programiz.pro"); 



function fetchWithRetry(url, retries){
let retry = 0;
   function innerFetch (){
       try{
         const value =  fetch(url);
         return value
       }catch (error){
           if(retry>=retries){
               return error; 
           }
           retry++;
           innerFetch();
       }
   }
   return innerFetch();
}


// set(key, value, expiryTime){
//     const time = new Date();
//     const currentTime = time.now();
//     const expiry = currentTime*10000 + expiryTime;
    
//     const valueWithExpiry={value: value, expiry:expiry }
    
    
//     window.localStorage.set(key,Json.Stringfy(valueWithExpiry));
    
// }


// get(key){
//   const value = window.localStorage.get(key)
//   const parsedValue = json.parse(value);
//   const time = new Date();
//   const currentTime = time.now()*10000;
//   if(parsedValue.expiry< currentTime){
//       window.localStorage.removeItem(key);
//       return null;
//   }
//   return window.localStorage.get(key)
// }
