const spritesmith = require('spritesmith');
const fs = require('fs-extra');

//TODO name -> animationName где это нужно, что бы не путаться
function sprite(name, episodeName, paths) {
    let imageArray = [];
    let animationPath = `${paths.sourceFolder}/animations/${name}/`;
    let episodePrefix = parseInt(episodeName.match(/^[a-zA-Z]+(\d+)$/)[1]);


    return new Promise((resolve, reject) => {
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

                if (name.lastIndexOf('_') + 1) {
                    name =  name.substring(0, name.lastIndexOf('_'));
                }

                // Output the image
                fs.writeFile(`${paths.socPath}/${name}_${episodePrefix}.png`, result.image, function (err) {
                    if (err) throw err;
                });

                  resolve(result.coordinates);
            });
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

async function generateLess (name, order, episodeName, paths) {
    let spriteProp = await sprite(name, episodeName, paths);
    let obj = showProps(spriteProp);

    let offset = obj.offset_x;
    let width = obj.width;
    let height = obj.height;
    let spriteWidth = obj.total_width;
    let iteration = (offset + obj.width) / obj.width;
    let time = iteration * 2 / 10; // 2 секунды на кадр

    let lessRule, animationStr;
    let episodePrefix = parseInt(episodeName.match(/^[a-zA-Z]+(\d+)$/)[1]);


    let indUnderscore = name.lastIndexOf('_');
    let indDash = name.lastIndexOf('-');
    let animationType = indDash + 1 ? name.substring(indUnderscore + 1, indDash) : name.substring(indUnderscore + 1);
    let animationDuration = indDash + 1 ? name.substring(indDash + 1) : '30%';
    name = indUnderscore + 1 ? name.substring(0, indUnderscore) : name;

    switch (animationType) {
        case 'pause':
            time = time * 2;
            iteration = iteration - 1; //особенность реализации css анимаций
            animationStr =  `.animBgFromTo2Pause(${name}_${episodePrefix}, 0, -${iteration * width}px, ${animationDuration});\n\n`;
            break;
        case 'alt':
            time = time * 2;
            iteration = iteration - 1;
            animationStr =  `.animBgFromTo2PauseAlternate(${name}_${episodePrefix}, 0, -${iteration * width}px, ${animationDuration});\n\n`;
            break;
        case 'unusual':
            animationStr = `${name}_${episodePrefix}Less() {\n\t0%{tranform: translateX(0);}\n\t100%{tranform: translateX(100%);}\n}`
                            + `\n@keyframes ${name}_${episodePrefix} {\n\t ${name}_${episodePrefix}Less;\n}`
                            + `\n@-webkit-keyframes ${name}_${episodePrefix} {\n\t ${name}_${episodePrefix}Less;\n}`
                            + `\n@-moz-keyframes ${name}_${episodePrefix} {\n\t ${name}_${episodePrefix}Less;\n}`
                            + `\n@-o-keyframes ${name}_${episodePrefix} {\n\t ${name}_${episodePrefix}Less;\n}`;
            break;

        default:
            animationStr =  `.animBgFromTo2(${name}_${episodePrefix}, 0, -${iteration * width}px);\n\n`;
    }

    lessRule = `.episode_${episodePrefix} .whale${order} {`
        + `\n\t.absolute(${width}px, ${height}px, 1px, 1px);`
        + `\n\toverflow: hidden;`
        + `\n\t.animationSprite {`
        + `\n\t\t.sprite(${spriteWidth}px, ${height}px, 0, 0, "episode/${episodeName}/${name}_${episodePrefix}.png", 0 0);`
        + `\n\t\t.animation(~"${name}_${episodePrefix} ${time}s steps(${iteration}) ${order / 10}s infinite");\n\t}\n}\n\n`
        + animationStr;


    return lessRule;
}

async function generateAnimation (name, order, episodeName, paths) {
    let lessRule = await generateLess (name, order, episodeName, paths);
    fs.appendFile(paths.cssPath, lessRule, (err) => {
        if(err) throw err;
    });
}

module.exports = {
    generateAnimation: generateAnimation
};
