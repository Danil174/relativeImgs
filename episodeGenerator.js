const fs = require('fs-extra');
const path = require('path');
const generateAnimation = require('./animationGenerator').generateAnimation;

function findEpisodes (sourceFolder) {
    const episodeNamesArr = fs.readdirSync(sourceFolder);
    return episodeNamesArr;
}

function createEpisodeFolder (episodes, outputFolder) {
    for (episode of episodes) {
        let newFolder = path.join(outputFolder, '/', episode);
        fs.mkdirSync(newFolder);
    }
}

// function createMapTreasure (episodeName) {
//     console.log(episodeName, 'MapTreasure created\n');
// }

// function treasureElements (episodeName) {
//     console.log(episodeName, 'treasureElements created\n');
// }

function generateAnimations (currentPath, episodeName) {
    const animationsNameArr = fs.readdirSync(currentPath);

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[i], i + 1, episodeName); //параметры: название анимации, порядковый номер, эпизод с номером
    }
}

module.exports = {
    findEpisodes: findEpisodes,
    createEpisodeFolder: createEpisodeFolder,
    generateAnimations: generateAnimations
};
