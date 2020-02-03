const spritesmith = require('spritesmith');
const fs = require('fs-extra');

//TODO name -> animationName где это нужно, что бы не путаться
function sprite(name, episodeName) {
    let imageArray = [];
    let animationPath = `episodes/${episodeName}/animations/${name}/`;

    fs.readdir(animationPath, function(err, items) {
        for (let i = 0; i < items.length; i++) {
            imageArray.push(animationPath + items[i]);
        }

        spritesmith.run({
            src: imageArray,
            algorithm: 'left-right',
            algorithmOpts: {sort: false},
        }, function handleResult (err, result) {
          // If there was an error, throw it
          if (err) {
            throw err;
          }

          // Output the image
          fs.writeFile(`output/${episodeName}/${name}.png`, result.image, function (err) {
            if (err) throw err;
          });

            return result.coordinates;
        });
    });
};

function showProps(spriteProp) {

    let arr = [];

    for (let prop in spriteProp) {
        arr.push(spriteProp[prop]);
    }

    arr.sort((a, b) => b.x - a.x);

    return {width: arr[0].width, height: arr[0].height, total_width: arr[0].width * arr.length, offset_x: arr[0].x};
}

async function generateAnimation (name, order, episodeName) {
    let spriteProp = await sprite(name, episodeName);
    console.log(spriteProp);
    // let obj = showProps(spriteProp);

    // let offset = obj.offset_x;
    // let width = obj.width;
    // let height = obj.height;
    // let spriteWidth = obj.total_width;
    // let iteration = (offset + obj.width) / obj.width;
    // let time = iteration*2/10; // 2 секунды на кадр

    // let lessRule;
    // let episodePrefix = parseInt(episodeName.match(/^[a-zA-Z]+(\d+)$/)[1]);

    // lessRule = `.${episodeName} .whale${order} {`
    //     + `\n\t.absolute(${width}, ${height}, 1px, 1px);`
    //     + `\n\toverflow: hidden;`
    //     + `\n\t.animationSprite {`
    //     + `\n\t\t.sprite(${spriteWidth}, ${height}, 0, 0, "episode/${episodeName}/${name}_${episodePrefix}.png", 0 0);`
    //     + `\n\t\t.animation(~"${name}_${episodePrefix} ${time}s steps(${iteration}) infinite");\n\t}\n}\n\n`
    //     + `.animBgFromTo2Pause(${name}_${episodePrefix}, 0, -${iteration}*${width}px, 30%);\n`;

    // console.log(lessRule);

    // fs.appendFile('styles/styles.less', data, (err) => {
    //     if(err) throw err;
    // });

    // return lessRule;
}

// function generateSprite () {

// }

// function generateLess (obj) {

// }

module.exports = {
    generateAnimation: generateAnimation
};
