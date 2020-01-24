const spritesmith = require('gulp.spritesmith');
const gulp = require('gulp');
const fs = require('fs');

//TODO name -> animationName где это нужно, что бы не путаться 
function sprite(name, episodeName) {
    var spriteData = gulp.src(`episodes/${episodeName}/animations/${name}/${name}*.png`)
        .pipe(spritesmith({
            algorithm: 'left-right',
            algorithmOpts: {sort: false},
            imgName: `${name}.png`,
            cssName: `${name}.json`
        })
    );
    return spriteData.pipe(gulp.dest(`output/${episodeName}/`));
};

function showProps(name, episodeName) {
    let dataJSON = fs.readFileSync(`output/${episodeName}/${name}.json`);
    
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

    

    //удаляем json файла, он нам больше не нужен
    // fs.unlinkSync(`output/${name}.json`);
    
    return arr;
}

function generateAnimation (name, order, episodeName) {
    sprite(name, episodeName);
    let obj = showProps(name, episodeName);

    let offset = -obj.offset_x;
    let width = obj.width;
    let height = obj.height;
    let spriteWidth = obj.total_width;
    let iteration = (offset + obj.width) / obj.width;
    let time = iteration*2/10; // 2 секунды на кадр

    let lessRule;
    let episodePrefix = parseInt(episodeName.match(/^[a-zA-Z]+(\d+)$/)[1]);

    // let obj = {

    // }

    lessRule = `.${episodeName} .whale${order} {`
        + `\n\t.absolute(${width}, ${height}, 1px, 1px);`
        + `\n\toverflow: hidden;`
        + `\n\t.animationSprite {`
        + `\n\t\t.sprite(${spriteWidth}, ${height}, 0, 0, "episode/${episodeName}/${name}_${episodePrefix}.png", 0 0);`
        + `\n\t\t.animation(~"${name}_${episodePrefix} ${time}s steps(${iteration}) infinite");\n\t}\n}\n\n`
        + `.animBgFromTo2Pause(${name}_${episodePrefix}, 0, -${iteration}*${width}px, 30%);\n`;

    console.log(lessRule);

    // fs.appendFile('styles/styles.less', data, (err) => {
    //     if(err) throw err;
    // });

    return lessRule;
}

// function generateSprite () {
    
// }

// function generateLess (obj) {

// }

module.exports = {
    generateAnimation: generateAnimation
};