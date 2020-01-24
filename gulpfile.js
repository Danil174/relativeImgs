const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');

const findEpisodes = require('./episodeGenerator').findEpisodes;
const createEpisodeFolder = require('./episodeGenerator').createEpisodeFolder;

// const { task } = require('gulp');
// const { series } = require('gulp');
const args = require('yargs').argv;
const parse = require('./parse').createFile;

const episodesFolder = 'episodes';
const outputFolder = 'output';

function sprite() {
    var spriteData = gulp.src(`sprites/${name}*.png`)
        .pipe(spritesmith({
            algorithm: 'left-right',
            algorithmOpts: {sort: false},
            imgName: `${name}.png`,
            cssName: `${name}.json`
        })
    );

    return spriteData.pipe(gulp.dest('output/'));
};

function runRenderEpisodes () {
    //получить список эпизодов []
    const episodes = findEpisodes(episodesFolder);

    if (fs.existsSync(outputFolder)) {
        fs.removeSync(outputFolder);
        fs.mkdirSync(outputFolder);
    }  else {
        fs.mkdirSync(outputFolder);
    }

    createEpisodeFolder(episodes, outputFolder);

    for (episode of episodes) {
        console.log(`generateAnimation${episode}`);
    }
}

function build(cd) {
    runRenderEpisodes();
    cd();
}

exports.build = build;
// exports.bonus = bonus;