function x(){

    var i = 1;
    setTimeout(function(){
        console.log(i); // 1
    }, 3000);
    console.log('Passed set Timeout');
}

x()


function list (){

    for(var i = 0; i <=5;i++){
        setTimeout(function(){
            console.log(i);
        })
    }
}

list(); // Expected list Output : 6,6,6,6,6

// here var points to the same reference of i as it is not blocked scope and due to for loop the same value of i updates it self

// To fix this issue we can use let as it is blocked scope so for every for loop there will be new copy of i in it.



// How to fix with var only, we can use closure to fix it.

function listWithClosure(){

    for(var i = 0; i <=5;i++){
        function close(i){
            setTimeout(function(){
                console.log(i);
            })
        }
        close(i); // now using closure we have everytime supplied a new copy of i .  
    }
}