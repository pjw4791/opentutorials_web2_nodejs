var v1 = 'v1';
//100000 code
v1 = 'egoing'; //코드가 길어서 버그 찾기가 힘들어짐. 
//근데 객체는 이런 버그를 찾기가 쉽게 해줌. 

var v2 = 'v2';

/*
var o = {
    v1: 'v1',
    v2: 'v2'
}//하나의 하드디스크에 여러 파일 넣고 정리정돈하는 것과 같은 상황

function f1(){
    console.log(o.v1);
}

function f1(){

}//만약 이렇게 중간에 끼어들면 멘붕,,,

function f2(){
    console.log(o.v2);
}

f1();
f2();
*/

//위와 같이 하지 않고 객체 o에 담아서 관리를 해보자!

var o = {
    v1: 'v1',
    v2: 'v2',
    f1: function(){
        console.log(o.v1);
    },
    f2: function(){
        console.log(o.v2);
    }
}//그룹핑되어 있다!, 코드의 복잡성을 매우 낮출 수 있다!
o.f1();
o.f2();

//이런 상황을 가정해보자.
//객체 이름이 o가 아니라 tt로 바뀌면 모든 o를 tt로 바꿔줘야하는 귀찮은 상황이 생김.
//그래서 this.v1이런식으로 한다!

var tt = {
    v1: 'v1',
    v2: 'v2',
    f1: function(){
        console.log(this.v1);
    },
    f2: function(){
        console.log(this.v2);
    }
}
tt.f1();
tt.f2();