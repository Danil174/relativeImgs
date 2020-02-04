const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');

const createEpisode = require('./episodeGenerator').createEpisode;

const args = require('yargs').argv;

const episodesFolder = 'episodes';
const outputFolder = 'output';

function createOutputFolder (folder) {
    if (fs.existsSync(folder)) {
        fs.removeSync(folder);
        fs.mkdirSync(folder);
    } else {
        fs.mkdirSync(folder);
    }
}

function runRenderEpisodes() {
    createOutputFolder(outputFolder);
    //получить список эпизодов []
    const episodes = fs.readdirSync(episodesFolder);

    for (episode of episodes) {
        createEpisode(episode, episodesFolder, outputFolder);
    }
}

function build(cd) {
  runRenderEpisodes();
  cd();
}

exports.build = build;
// exports.bonus = bonus;
