const fs = require('fs-extra');
const path = require('path');
const spritesmith = require('spritesmith');
const ncp = require('ncp').ncp;
const generateAnimation = require('./animationGenerator').generateAnimation;


function createEpisode(episodeName, pathsObj) {
    let episodePaths = {
        sourceFolder: `${pathsObj.sourceFolder}/${episodeName}`,
        socPath: `${pathsObj.socPath}/${episodeName}`,
        cssPath: `${pathsObj.socCSSPath}/${episodeName}.css`
    }

    const episodeItems = fs.readdirSync(episodePaths.sourceFolder);

    createOutputFolder(episodePaths.socPath);

    for (let item of episodeItems) {
        switch(item) {
            case 'animations':
                generateAnimations(episodeName, episodePaths);
                break;

            case 'mapTreasure':
                renderEpisodeitem(item, episodePaths.sourceFolder, episodePaths.socPath);
                break;

            case 'treasureElements':
                renderEpisodeitem(item, episodePaths.sourceFolder, episodePaths.socPath);
                break;

            case 'social':
                moveSocialBG(episodePaths.sourceFolder, episodePaths.socPath);
                break;

            default: break;
        }
    }
};

function moveSocialBG (source, destination) {
    ncp(`${source}/social`, destination, function (err) {
        if (err) { return console.error(err); }
    });
}

function createOutputFolder (folder) {
    if (fs.existsSync(folder)) {
        fs.removeSync(folder);
        fs.mkdirSync(folder);
    } else {
        fs.mkdirSync(folder);
    }
}

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

function generateAnimations (episodeName, paths) {
    let pathToAnimation = `${paths.sourceFolder}/animations`;
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[i], i + 1, episodeName, paths); //параметры: название анимации, порядковый номер, эпизод с номером
    }
};

module.exports = {
    createEpisode: createEpisode,
    createOutputFolder: createOutputFolder
};
