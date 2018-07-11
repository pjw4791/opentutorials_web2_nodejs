//Object Oriented Programming; OOP
//array, object
//function
function f1(){
    console.log(1+1);
    console.log(1+2);
}//statement면서 동시에 값임.
//함수를 변수에 넣을 수 있으면, 값임. 

//조건문이 값이 아니기 때문
//var i = if(true){console.log(1+1)};

//while문 값이 아니기 때문
//var w = while(true){console.log(1)};

//function은 값이 될 수 있다!!
var f = function(){
    console.log("ㅇㅇㅇ")
}
console.log(f);
f();

var a = [f]; //배열의 원소로서 함수가 들어갈 수 있다. 이건 잘 안 씀
a[0]();

var o = {
    func: f //이건 이름으로 부를 수 있어서 사용함. 
}
o.func();

