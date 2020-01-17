
const fs = require('fs');

function readJSON() {
    // let data = fs.readFileSync('output/mouse.json');
    let dataJSON;

    fs.readFile('output/mouse.json', (err, data) => {
        if (err) throw new myerror(err);
        dataJSON = data;
        let parseData = JSON.parse(dataJSON);

        showProps(parseData)

        fs.unlinkSync('output/mouse.json');
    });
}

function myerror(error) {
    console.log(error)
    return false;
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

    arr = argFromFirst(arr, spriteArgs);
    return arr;
}

readJSON();