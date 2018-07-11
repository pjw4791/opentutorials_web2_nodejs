var members = ['asdf', 'ddd', 'sdfsdf'];//배열
console.log(members[1]); //ddd

console.log()
var i =0;
while(i<members.length){
    console.log(members[i]);
    i += 1;
}

console.log()
var roles = {
    'programmer': 'egoing', //key, value
    'designer': 'k8805', 
    'manager': 'hoya'}//객체

console.log(roles.designer); //k8805

console.log()
for(var n in roles){ //in을 꼭 쓰셔야 합니다!
    console.log('object =>', n, 'value =>', roles[n])
}