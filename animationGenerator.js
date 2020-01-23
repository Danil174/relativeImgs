function generateAnimation (name, order, episodeName) {
    let lessRule;
    let episodePrefix = parseInt(episodeName.match(/^[a-zA-Z]+(\d+)$/)[1]);

    let obj = {

    }

    lessRule = `.${episodeName} .whale${order} {`
        + `\n\t.absolute(50px, 50px, 1px, 1px);`
        + `\n\toverflow: hidden;`
        + `\n\t.animationSprite {`
        + `\n\t\t.sprite(250px, 50px, 0, 0, "episode/${episodePrefix}/${name}_${episodePrefix}.png", 0 0);`
        + `\n\t\t.animation(~"${name}_${episodePrefix} 1.6s steps(5) infinite");\n\t}\n}\n\n`
        + `.animBgFromTo2PauseAlternate(${name}_${episodePrefix}, 0, -4*47px, 30%);\n`;

    console.log(lessRule);

    lessRule = generateLess ();

    return lessRule;
}

function generateSprite () {
    
}

function generateLess (obj) {

}

module.exports = {
    generateAnimation: generateAnimation
};