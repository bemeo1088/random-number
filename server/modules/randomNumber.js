function randomNum(min, max){
        //var x = Math.floor(Math.random() * (1 + max - min) + min);
        return String(Math.floor(Math.random() * (max - min) + min))
        //creturn x;
}

module.exports = randomNum;