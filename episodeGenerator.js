const fs = require('fs');
const path = require('path');
const generateAnimation = require('./animationGenerator').generateAnimation;


const folderPath = './episodes';

function findEpisodes () {
    const episodeNamesArr = fs.readdirSync(folderPath);

    console.log('массив имен эпизодов', episodeNamesArr, '\n');

    return episodeNamesArr;
}

function createMapTreasure (episodeName) {
    console.log(episodeName, 'MapTreasure created\n');
}

function treasureElements (episodeName) {
    console.log(episodeName, 'treasureElements created\n');
}

function generateAnimations (episodeName) {
    const pathToAnimation = path.join(folderPath, '/', episodeName, '/', 'animations');
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    console.log('анимации на ', episodeName, ' : ',  animationsNameArr, '\n');

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[0], i + 1, episodeName); //параметры: название анимации, порядковый номер, эпизод с номером
    }
}

function generateEpisode (episodeName) {
  
    // searchEpFolders(episodeName);

    createMapTreasure(episodeName);

    treasureElements(episodeName);

    generateAnimations(episodeName);
}

function generateAllEpisodes () {
    let episodeArr;

    episodeArr = findEpisodes();

    for (let i = 0; i < episodeArr.length; i++) {
        generateEpisode(episodeArr[i]);
    }
}

generateAllEpisodes();
