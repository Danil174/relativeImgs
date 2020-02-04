const fs = require('fs-extra');
const path = require('path');
const spritesmith = require('spritesmith');
const generateAnimation = require('./animationGenerator').generateAnimation;


function createEpisode(episodeName, rootFolder, outputFolder) {
        console.log(fs.readdirSync(pathToAnimation));
//     createEpisodeFolder(episodeName, outputFolder);

//     generateAnimations(rootFolder, episodeName);

//     let pathToTreasure = path.join(rootFolder, '/', episodeName, '/', 'mapTreasure/');
//     renderEpisodeitem('mapTreasure', pathToTreasure, outputFolder);

//     let pathToElements = path.join(rootFolder, '/', episodeName, '/', 'treasureElements/');
//     renderEpisodeitem('treasureElements', pathToElements, outputFolder);
//
};

function createEpisodeFolder (episodeName, outputFolder) {
    let newFolder = path.join(outputFolder, '/', episodeName);
    fs.mkdirSync(newFolder);
};

function renderEpisodeitem (type, folder, outputFolder) {
    let imageArray = [];
    let imgPath = folder

    fs.readdir(folder, function(err, items) {
        for (let i = 0; i < items.length; i++) {
            imageArray.push(folder + items[i]);
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
    let pathToAnimation = path.join(currentPath, '/', episodeName, '/', 'animations');
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[i], i + 1, episodeName); //параметры: название анимации, порядковый номер, эпизод с номером
    }
};

module.exports = {
    createEpisode: createEpisode
};
