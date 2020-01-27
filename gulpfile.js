const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');

const findEpisodes = require('./episodeGenerator').findEpisodes;
const createEpisodeFolder = require('./episodeGenerator').createEpisodeFolder;
const generateAnimations = require('./episodeGenerator').generateAnimations;

// const { task } = require('gulp');
// const { series } = require('gulp');
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


const through2 = require('through2').obj;
const spritesmith = require('gulp.spritesmith');

gulp.task('test', function () {
    return gulp.src('src/*.png')
    .pipe(through2(function(file, enc, callback) { //параметры: файл, кодировка и колбек
            console.log(file);
            //...
            //this.push(...) что бы передать что-то ещё
            // callback(new Error('...'));
            // просто callback() - для завершения
            // callback(null, file);
            callback(null, file);
        }
    ))
    .pipe(spritesmith({
        algorithm: 'left-right',
        algorithmOpts: {sort: false},
        imgName: `111.png`,
        cssName: `111.json`
    }))
    .pipe(gulp.dest('test'));
});

exports.build = build;
// exports.bonus = bonus;
