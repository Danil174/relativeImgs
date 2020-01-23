const fs = require('fs');
const path = require('path');
const folderPath = './episodes';

function findEpisodes () {
    // let relativePath = folderPath;
    const episodeNamesArr = fs.readdirSync(folderPath);
    // let animationNames = [];

    // for (let i = 0; i < episodes.length; i++) {
    //     let episodePath = path.join(relativePath, '/', episodes[i], '/', 'animations');
    //     animationNames = fs.readdirSync(episodePath)
    // }
    console.log('массив имен эпизодов', episodeNamesArr);

    return episodeNamesArr;
}

function searchEpFolders (episodeName) {
    const pathToEpisode = path.join(folderPath, '/', episodeName);
    const episodeFolders = fs.readdirSync(pathToEpisode);
    console.log('Папки эпизода ', episodeName, ' : ', episodeFolders);
}

function createMapTreasure (episodeName) {
    console.log(episodeName, 'MapTreasure created');
}

function treasureElements (episodeName) {
    console.log(episodeName, 'treasureElements created');
}

function generateAnimations (episodeName) {
    const pathToAnimation = path.join(folderPath, '/', episodeName, '/', 'animations');
    const animationsFolders = fs.readdirSync(pathToAnimation);
    console.log('анимации на ', episodeName, ' : ', animationsFolders);
}

function generateEpisode () {
    let episodeArr;

    episodeArr = findEpisodes();

    for (let i = 0; i < episodeArr.length; i++) {
        searchEpFolders(episodeArr[i]);

        createMapTreasure(episodeArr[i]);

        treasureElements(episodeArr[i]);

        generateAnimations(episodeArr[i]);
    }
}

generateEpisode();
