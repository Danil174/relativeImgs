const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');
const imageResize = require('gulp-image-resize');
const ncp = require('ncp').ncp;

const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');


const createEpisode = require('./episodeGenerator').createEpisode;

const args = require('yargs').argv;

const paths = {
    sourceFolder: './episodes',
    socPath: './candyvalley/site/img/episode',
    socCSSPath: './candyvalley/site/csssnowball',
    mobilePath: './candyvalley-mobile/site/img/episode'
}

function runRenderEpisodes() {
    //получить список эпизодов []
    const episodes = fs.readdirSync(paths.sourceFolder);

    for (episode of episodes) {
        createEpisode(episode, paths);
    }
}

function renderSoc(cd) {
  runRenderEpisodes();
  cd();
}

function runOptimize () {
    const episodes = fs.readdirSync(paths.sourceFolder);

    episodes.forEach(function (episode) {
        let folderPath = `${paths.socPath}/${episode}/`;

        gulp.src(folderPath + '*{jpg,png}')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 7}),
            imageminPngquant({
                speed: 1,
                strip: true,
                quality: [0.6, 0.8],
                dithering: 0.8
            })
        ]))
        .pipe(gulp.dest(folderPath));
    });
}
//да, костыль. Буду переделывать
function optimize(cd) {
    setTimeout(crutch, 1000);
    cd();
}

function crutch() {
    runOptimize();
}

exports.renderSoc = renderSoc;
exports.optimize = optimize;
exports.build = gulp.series(renderSoc, optimize);

//массив массивов [шириа, высота, имя картинки]
const mobileWaybg = [[440, 575, 320], [650, 850, 480], [805, 1053, 600], [2600, 3400, 1500]];

function mobile (episodes) {
    episodes.forEach(function(episode) {
        mobileWaybg.forEach(function (item) {
            console.log(`${paths.mobilePath}/${episode}/waybg`);
            gulp.src(`${paths.sourceFolder}/${episode}/waybg/*.jpg`)
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
                .pipe(rename(item[2] + '.jpg'))
                .pipe(gulp.dest(`${paths.mobilePath}/${episode}/waybg`));
        });
    });
};

function run(cd) {
    const episodes = fs.readdirSync(paths.sourceFolder);
    mobile(episodes);
    episodes.forEach(function(episode){
        ['mapTreasure.png', 'treasureElements.png'].forEach(function (item) {
            ncp(`${paths.socPath}/${episode}/${item}`, `${paths.mobilePath}/${episode}/${item}`, function (err) {
                if (err) { return console.error(err); }
            });
        });
    });
    cd();
}

exports.run = run;

//TODO нормально оформить - временное решение
gulp.task('work', function(){
    const quality = args.quality || 100;

    return gulp.src('./work/*.jpg')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: quality, progressive: true}),
        ]))
        .pipe(gulp.dest('./work/output'));
});

gulp.task('png', function(){

    return gulp.src('./work/*.png')
        .pipe(imagemin([
            imageminPngquant({
                speed: 1,
                strip: true,
                quality: [0.6, 0.8],
                dithering: 0.8
            })
        ]))
        .pipe(gulp.dest('./work/output'));
});

// gulp work --quality 85
// const quality = args.quality || 100;

const bonusworldFolder = './bonusworld';

function runRenderBonusWorld () {
    const bonusworlds = fs.readdirSync(bonusworldFolder);

    for (bonusworld of bonusworlds) {
        createBonus(episode);
    }
}

function createBonus () {
    renderItems();
    renderAnimations();
    optimizeBg();
}

function renderBonus(cd) {
    runRenderBonusWorld();
    cd();
}

exports.renderBonus = renderBonus;
