// // import { readFileSync } from "fs";

// // readFileSync('./test.txt',(err,data)=>{
// //     if(err) console.log(err);;
// //     console.log(data);
// // });

// var fs = require('fs');
// // import { readFileSync,readFile } from "fs";


// const text = () => console.log('text');

// function resolveAfter2Seconds() {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve('resolved');
//         }, 2000);
//     });
// }


// const a =  () => {
//     const result = resolveAfter2Seconds();
//     // console.log(1);
//     result.then(resolve => console.log(resolve)).then(console.log(1)).then(console.log(123));
//     // console.log(123);
// }

// const b = async () =>{
    
//     console.log(1);
//     const result = await resolveAfter2Seconds();
//     console.log(result);
//     console.log(123);
// }
// async function hello() { return "Hello" };
// console.log(hello());
// // b();

// const arr = ['a','b','c']

// for(const element of arr ){
//     console.log(element);
// }

// arr.forEach(element=>{console.log(element);})

const jsonArr = {
    a:'1',
    b:'2',
    c:'3'
}

const newd =new Map(Object.keys(jsonArr),Object.values(jsonArr).map(x=>x*2));
console.log(newd);

// console.log(Object.keys(jsonArr).map());

// let myMap = new Map([
//     [1, 'one'],
//     [2, 'two'],
//     [3, 'three'],
//   ])

// console.log(myMap);

// const array1 = [1, 4, 9, 16];

// pass a function to map
// const map1 = array1.map(x => x * 3);

// console.log(map1);
// expected output: Array [2, 8, 18, 32]

