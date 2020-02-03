const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');

const findEpisodes = require('./episodeGenerator').findEpisodes;
const createEpisodeFolder = require('./episodeGenerator').createEpisodeFolder;
const generateAnimations = require('./episodeGenerator').generateAnimations;

const args = require('yargs').argv;

const episodesFolder = 'episodes';
const outputFolder = 'output';

function runRenderEpisodes() {
  //получить список эпизодов []
  const episodes = findEpisodes(episodesFolder);

  if (fs.existsSync(outputFolder)) {
    fs.removeSync(outputFolder);
    fs.mkdirSync(outputFolder);
  } else {
    fs.mkdirSync(outputFolder);
  }

  createEpisodeFolder(episodes, outputFolder);

  for (episode of episodes) {
    let pathToAnimation = path.join(episodesFolder, '/', episode, '/', 'animations');
    generateAnimations(pathToAnimation, episode);
  }
}

function build(cd) {
  runRenderEpisodes();
  cd();
}

exports.build = build;
// exports.bonus = bonus;
