const fs = require('fs');
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

function generateAnimations (episodeName) {
    const pathToAnimation = path.join(folderPath, '/', episodeName, '/', 'animations');
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    console.log('анимации на ', episodeName, ' : ',  animationsNameArr, '\n');

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[0], i + 1, episodeName); //параметры: название анимации, порядковый номер, эпизод с номером
    }
}

function generateEpisode (episodeName) {

    // createMapTreasure(episodeName);

    // treasureElements(episodeName);

    generateAnimations(episodeName);
}

module.exports = {
    findEpisodes: findEpisodes,
    createEpisodeFolder: createEpisodeFolder
};