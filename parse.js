
const fs = require('fs');

function readJSON() {
    let data = fs.readFileSync('output/mouse.json');
    let parseData = JSON.parse(data);
    showProps(parseData)
}

function showProps(obj) {
    const spriteArgs = {
        width: 0,
        height: 0,
        total_width: 0,
        offset_x: 0
    }

    let arr = [];

    for (let prop in obj) {
        arr.push(obj[prop]);
    }

    function argFromFirst(arr, spriteArgs) {
        let arg = spriteArgs;
        let firstobj = arr[arr.length - 1];

        for (let prop in arg) {
            arg[prop] = firstobj[prop];
        }

        return arg;
    }

    console.log(argFromFirst(arr, spriteArgs));
}

readJSON();