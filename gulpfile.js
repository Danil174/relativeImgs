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

const imageResize = require('gulp-image-resize');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');

//массив массивов [шириа, высота, имя картинки]
const mobileWaybg = [[440, 575, 320], [650, 850, 480], [805, 1053, 600], [2600, 3400, 1500]];

function mobile () {
    mobileWaybg.forEach(function (item) {
        gulp.src('test/test.jpg')
            .pipe(imageResize({
                imageMagick: true,
                width: item[0],
                height: item[1],
                upscale : false,
            }))
            .pipe(gulpif(
                !(item[2] === 1500),
                imagemin([
                    imagemin.mozjpeg({quality: 90, progressive: true})
                ])
            ))
            .pipe(gulpif(
                (item[2] === 1500),
                imagemin([
                    imagemin.mozjpeg({quality: 60, progressive: true})
                ])
            ))
            // .pipe(imagemin([
            //     imagemin.mozjpeg({quality: 60, progressive: true}),
            //     imagemin.optipng({optimizationLevel: 5}),
            // ]))
            .pipe(rename(item[2] + '.jpg'))
            .pipe(gulp.dest('dist'));
    });
};

function test(cd) {
    mobile();
    cd();
}

exports.test = test;

gulp.task('png', function() {
    return gulp.src('output/episode295/*.png')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 7}),
        ]))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('jpg', function() {
    return gulp.src('output/episode295/*.jpg')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 85, progressive: true}),
        ]))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('work', function(){
    const quality = args.quality || 100;

    return gulp.src('./work/*.jpg')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: quality, progressive: true}),
        ]))
        .pipe(gulp.dest('./work/output'));
});

// gulp sprite --quality 85
// const quality = args.quality || 100;
