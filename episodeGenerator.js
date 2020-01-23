const fs = require('fs');
const path = require('path');
const folderPath = './episodes';

function findEpisodes () {
    const episodeNamesArr = fs.readdirSync(folderPath);

    console.log('массив имен эпизодов', episodeNamesArr, '\n');

    return episodeNamesArr;
}

// function searchEpFolders (episodeName) {
//     const pathToEpisode = path.join(folderPath, '/', episodeName);
//     const episodeFolders = fs.readdirSync(pathToEpisode);
// }

function createMapTreasure (episodeName) {
    console.log(episodeName, 'MapTreasure created\n');
}

function treasureElements (episodeName) {
    console.log(episodeName, 'treasureElements created\n');
}

function generateAnimation (name, order, episodePrefix) {
    let lessRule;

    lessRule = `.whale${order} {`
        + `\n\t.absolute(50px, 50px, 1px, 1px);`
        + `\n\toverflow: hidden;`
        + `\n\t.animationSprite {`
        + `\n\t\t.sprite(250px, 50px, 0, 0, "episode/${episodePrefix}/${name}_${episodePrefix}.png", 0 0);`
        + `\n\t\t.animation(~"${name}_${episodePrefix} 1.6s steps(5) infinite");\n\t}\n}\n\n`;

    console.log(lessRule);

    return lessRule;
}

function generateAnimations (episodeName) {
    const pathToAnimation = path.join(folderPath, '/', episodeName, '/', 'animations');
    const animationsNameArr = fs.readdirSync(pathToAnimation);

    console.log('анимации на ', episodeName, ' : ',  animationsNameArr, '\n');

    for (let i = 0; i <  animationsNameArr.length; i++) {
        generateAnimation (animationsNameArr[0], i + 1, episodeName); //параметры: название анимации, порядковый номер, префикс эпизода
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
