const gulp = require('gulp');
const sizeOf = require('image-size');
const fs = require('fs');

function build(mainAxis, mainAxisSize) {
    let images = [];
    let folderCollection = readFolder();

    for (var i = 0; i < folderCollection.length; i++) {
        obj = {
            name: folderCollection[i].name,
            relativeScale: relativeSize(mainAxisSize, folderCollection[i].width, folderCollection[i].height)
        }

        makeCSSrule(obj, mainAxis);
    }

    return images;
}

function readFolder() {
    fs.readdir('img', function(err, items) {
        let collection = [];

        let itemObj = {
            name,
            width,
            height
        };

        for (var i = 0; i < items.length; i++) {
            let dimensions = sizeOf(`img/${items[i]}`);

            itemObj = {
                name: items[i], 
                width: dimensions.width,
                height: dimensions.height
            }

            collection.push(itemObj);
        }
    });

    return collection;
}

function relativeSize(mainAxis, mainAxisSize, item) {
    let units; // 'vw'/'vh'
    let layoutWidth;
    let layoutHeight;
    let relativeWidth, relativeHeight;
    let itemRelativeWidth, itemRelativeHeight;

    switch(mainAxis) {
        case 'width':
            units = 'vw';
            relativeWidth = 100;
            layoutWidth = mainAxisSize;

            break;
      
        case 'height':
            units = 'vh'
            relativeHeight = 100;
            layoutHeight = mainAxisSize;

            break;
    }

    let widthCSSrule = 'width: ' + Math.floor(itemRelativeWidth * 100) / 100 + 'vw';
    let heightCSSrule = 'height: ' + Math.floor(itemRelativeHeight * 100) / 100 + 'vw';

    let image = {
        name: itemName,
        width: widthCSSrule,
        height: heightCSSrule
    }

    return image;
}

function relativeSize(mainAxisSize, a, b) {
    let x, y;
    x = a * 100 / mainAxisSize;
    y = x * b / a;

    return [x, y];
}

function makeCSSrule(obj, mainAxis) {
    let backgroundCSSrule = `background-image: url("../img/episode/@{bonusName}/islands/${obj.name}.png"`;
    let widthCSSrule = 'width: ' + Math.floor(obj.relativeScale[0] * 100) / 100 + 'vw';
    let heightCSSrule = 'height: ' + Math.floor(obj.relativeScale[1] * 100) / 100 + 'vw';
    // &.left_15 {
    //     background-image: url("../img/episode/@{bonusName}/islands/left_15.png");
    //     width: 17.67vw;
    //     height: 38.18vw;
    // }
}

gulp.task('taskname', function(cb){
    fs.writeFile('filename.css', build(), cb);
});
  
exports.build = build;