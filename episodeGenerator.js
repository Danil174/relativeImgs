const fs = require('fs-extra');
const path = require('path');
const spritesmith = require('spritesmith');
const generateAnimation = require('./animationGenerator').generateAnimation;


function createEpisode(episodeName, sourceFolder, outputFolder) {
    const episodeSourceFolder = path.join(sourceFolder, '/', episodeName);
    const episodeOutputFolder = path.join(outputFolder, '/', episodeName);
    const episodeItems = fs.readdirSync(episodeSourceFolder);

    createEpisodeFolder(episodeOutputFolder);

    for (let item of episodeItems) {
        if (item !== 'animations') {
            renderEpisodeitem(item, episodeSourceFolder, episodeOutputFolder);
        } else {
            generateAnimations(episodeSourceFolder, episodeName);
        }
    }
};

function createEpisodeFolder (episodeOutputFolder) {
    fs.mkdirSync(episodeOutputFolder);
};

function renderEpisodeitem (type, sourceFolder, outputFolder) {
    let imageArray = [];
    let folder = path.join(sourceFolder, '/', type);

    fs.readdir(folder, function(err, items) {
        for (let i = 0; i < items.length; i++) {
            imageArray.push(folder + '/' + items[i]);
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
            fs.writeFile(`${outputFolder}/${type}.png`, result.image, function (err) {
                if (err) throw err;
            });
        });
    });
};

function generateAnimations (currentPath, episodeName) {
    let pathToAnimation = path.join(currentPath, '/', 'animations');
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[i], i + 1, episodeName); //параметры: название анимации, порядковый номер, эпизод с номером
    }
};

module.exports = {
    createEpisode: createEpisode
};
