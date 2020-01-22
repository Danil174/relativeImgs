const fs = require('fs');

function myerror(error) {
    console.log(error)
    return false;
}

function showProps(name) {
    let dataJSON = fs.readFileSync(`output/${name}.json`);
    
    dataJSON = JSON.parse(dataJSON);

    const spriteArgs = {
        width: 0,
        height: 0,
        total_width: 0,
        offset_x: 0
    }

    let arr = [];

    for (let prop in dataJSON) {
        arr.push(dataJSON[prop]);
    }

    arr.sort((a, b) => a.offset_x - b.offset_x);

    function argFromFirst(obj, spriteArgs) {

        for (let prop in obj) {
            spriteArgs[prop] = obj[prop];
        }

        return spriteArgs;
    }

    arr = argFromFirst(arr[0], spriteArgs);
    
    return arr;
}

function generateAnimation(itemName, obj) {
    let offset = -obj.offset_x;
    let width = obj.width;
    let height = obj.height;
    let spriteWidth = obj.total_width;
    let iteration = (offset + obj.width) / obj.width;
    let time = iteration*2/10; // 2 секунды на кадр

    let rule = `.whale1 {`
        + `\n\t.absolute(${width}px, ${height}px, 1px, 1px);`
        + `\n\toverflow: hidden;`
        + `\n\t.animationSprite {`
        + `\n\t\t.sprite(${spriteWidth}px, ${height}px, 0, 0, "episode/episode219/${itemName}.png", 0 0);`
        + `\n\t\t.animation(~"${itemName} ${time}s steps(${iteration}) infinite");\n\t}\n}\n\n`;

    return rule;
}

function createFile(name) {

    let arr = showProps(name);

    let data = generateAnimation(name, arr); 

    fs.appendFile('styles/styles.css', data, (err) => {
        if(err) throw err;
    });

    //удаляем json файла, он нам больше не нужен
    // fs.unlinkSync(`output/${name}.json`);
}

module.exports = {
    createFile: createFile
};
