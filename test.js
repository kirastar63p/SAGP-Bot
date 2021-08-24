const MakeSeed = (QQNumber) =>{
    
    const seed = parseInt(Math.random()*10,10)*9;
    return seed;
}

console.log(MakeSeed(756202013));