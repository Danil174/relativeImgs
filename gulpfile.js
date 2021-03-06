const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');
const imageResize = require('gulp-image-resize');
const ncp = require('ncp').ncp;

const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');


const createEpisode = require('./episodeCreater/episodeGenerator').createEpisode;
const createOutputFolder = require('./episodeCreater/episodeGenerator').createOutputFolder;

const args = require('yargs').argv;

const paths = {
    sourceFolder: './episodeCreater/episodes',
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
            imagemin.mozjpeg({quality: 90, progressive: true}),
            imageminPngquant({
                speed: 1,
                strip: true,
                quality: [0.7, 0.85],
                dithering: 0.7
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

function runMobile(cd) {
    const episodes = fs.readdirSync(paths.sourceFolder);
    mobile(episodes);

    episodes.forEach(function(episode){
        createOutputFolder(`${paths.mobilePath}/${episode}`);
        ['mapTreasure.png', 'treasureElements.png'].forEach(function (item) {
            ncp(`${paths.socPath}/${episode}/${item}`, `${paths.mobilePath}/${episode}/${item}`, function (err) {
                if (err) { return console.error(err); }
            });
        });
    });
    cd();
}

exports.runMobile = runMobile;

//TODO нормально оформить - временное решение
gulp.task('jpgMinify', function(){
    const quality = args.quality || 90;
    const pathToFile = args.path || '.';

    return gulp.src(pathToFile + '**/*.jpg')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: quality, progressive: true}),
        ]))
        .pipe(gulp.dest('./output'));
});

gulp.task('pngMinify', function() {
    const pathToFile = args.path || '.';

    return gulp.src(pathToFile + '**/*.png')
        .pipe(imagemin([
            imageminPngquant({
                speed: 1,
                strip: true,
                quality: [0.6, 0.8],
                dithering: 0.8
            })
        ]))
        .pipe(gulp.dest('./output'));
});

gulp.task('minify', gulp.parallel('pngMinify', 'jpgMinify'), function (cd) {
    cd();
});

// gulp jpgMinify --quality 85
// gulp minify --quality 85 --path ./candyvalley/site/img/

// const quality = args.quality || 100;

// const sizeOf = require('image-size')
// const pathToSocBw = './bonusworld/social/';

// function socialBW () {
//     // 1) зайти в папку item прочитать все картинки
//     const items = fs.readdirSync(`${pathToSocBw}/items`);
//     // 1.1) взять размеры и название картинок
//     function getItemsSize (collection) {
//         let itemsSize;

//         for (let item of collection) {

//             console.log(item);

//             const dimensions = sizeOf(`./bonusworld/social/items/${item}`);

//             const itemInfo = {
//                 name: item.slice(0, -4),
//                 width: dimensions.width,
//                 height: dimensions.height
//             }

//             itemsSize.push(itemInfo);
//         }

//         return itemsSize;
//     }

//     console.log(items);

//     const itemsData = getItemsSize(items);

//     console.log(itemsData);

//     // function itemsCSStemplate (data) {

//     //     for (let prop in spriteProp) {
//     //         const itemObj = {
//     //             name: items[i].slice(0, -4),
//     //             width: dimensions.width,
//     //             height: dimensions.height
//     //         }

//     //         collection.push(itemObj);
//     //     }

//     //     return CSSRules;
//     // }
//     // 2) сгенерировать шаблоны для картинок
//     // 2) зайти в папку animation сгенерировать анимации и файл анимаций
//     // 4) скукожить все картинки
//     // 5) положить в папку бонусника
// }

// function bonusSoc(cd) {
//     socialBW();
//     cd();
// }

// exports.bonusSoc = bonusSoc;

function rounding(number, order) {
    return number = Math.round(number * order) / order;
}

var less = require('gulp-less');

const forLess = '@import "./base/site/less/commonFunctions.less"; @import "./candyvalley/site/css/commonFunctions.less";';

gulp.task('less', function () {
    fs.appendFileSync('./episodeCreater/convert/toConvert.less', forLess,);
    return gulp.src('./episodeCreater/convert/toConvert.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ],
            javascriptEnabled: true
        }))
        .pipe(gulp.dest('./episodeCreater/convert'));
});

const DntlyCssJson = require('dntly-cssjson');

function testCss () {
    const code = fs.readFileSync('./episodeCreater/convert/toConvert.css', "utf8");
    const css = DntlyCssJson.cssToJson(code);

    let height = args.height,
        width = args.width,
        heightR = args.heightR,
        widthR = args.widthR,
        horizontal = true;

    if (!height || !width || !(heightR === 100 || widthR === 100)) {
        console.error('Для работы скрипта нужны параметры height, width; heightR или widthR должны быть равны 100');
    }

    if (heightR === 100) {
        widthR = width * heightR / height;
    } else {
        heightR = widthR * height /  width;
        horizontal = false
    }

    function toRelative (obj, flag) {
        let units = 'vh';
        if (!flag) {
            units = 'vw';
        }

        const propertiesToChange = ['left', 'top', 'right', 'bottom', 'width', 'height'];

        for (let property in obj) {
            if (propertiesToChange.includes(property)) {
                if (obj[property].split("px").length > 1) {
                    obj[property] = obj[property].split("px")[0];

                    if (property === 'left' || property === 'width' || property === 'right') {
                        obj[property] = calculateRelativeSize(width, widthR, obj[property]);
                        obj[property] = obj[property] + units;
                    } else {
                        obj[property] = calculateRelativeSize(height, heightR, obj[property]);
                        obj[property] = obj[property] + units;
                    }
                }
            }
        }
    }

    function calculateRelativeSize (main, mainR, size) {
        let relativeSize = size * mainR / main;
        return rounding(relativeSize, 100);
    }

    for (let prop in css) {
        toRelative(css[prop], horizontal);
    }

    const convertedCss = DntlyCssJson.jsonToCss(css);
    fs.writeFileSync("./episodeCreater/convert/convertedCss.css", convertedCss)
    fs.unlinkSync("./episodeCreater/convert/toConvert.css")
}

gulp.task('toMobile', function () {
    return testCss();
});

gulp.task('css', gulp.series('less', 'toMobile'), function (cd) {
    cd();
});

// gulp css --width 660 --height 760 --heightR 100

const episodesStructure = ['animations', 'mapTreasure', 'treasureElements', 'social', 'waybg'];

// gulp runFolders --episode 294 --amount 5

function runFolders (cd) {
    createOutputFolder(paths.sourceFolder);
    const arr = episodesStructure;
    const beginEpisode = args.episode || 500;
    const episodeAmount = args.amount || 1;

    for (let i = 0; i < episodeAmount ; i++) {
        let episode = beginEpisode + i;
        createOutputFolder(`${paths.sourceFolder}/episode${episode}`);
        arr.forEach(function (folder) {
            fs.mkdirSync(`${paths.sourceFolder}/episode${episode}/${folder}`);
        });
    }

    cd();
}

exports.runFolders = runFolders;
