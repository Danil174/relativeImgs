const gulp = require('gulp');
const sizeOf = require('image-size');
const fs = require('fs');

function build() {
    let images = [];

    fs.readdir('img', function(err, items) {
    
        for (var i = 0; i < items.length; i++) {
            let dimensions = sizeOf(`img/${items[i]}`);
            images.push(relativeSize(items[i], dimensions.width, dimensions.height));
        }
    });

    return images;
}

function relativeSize(itemName, itemWidth, itemHeight) {
    const layoutMainWidth = 2600; // 2600px
    const layoutRelativeWidth = 100; // 100vw
    let itemRelativeWidth, itemRelativeHeight;

    itemRelativeWidth = layoutRelativeWidth  * itemWidth / layoutMainWidth;
    itemRelativeHeight = itemHeight * itemRelativeWidth / itemWidth;

    itemRelativeWidth = 'width: ' + Math.floor(itemRelativeWidth * 100) / 100 + 'vw';
    itemRelativeHeight = 'height: ' + Math.floor(itemRelativeHeight * 100) / 100 + 'vw';

    let image = {
        name: itemName,
        width: itemRelativeWidth,
        height: itemRelativeHeight
    }

    return image;
}

function makeCSSrule(items) {
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