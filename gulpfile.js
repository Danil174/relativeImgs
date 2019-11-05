const gulp = require('gulp');
const sizeOf = require('image-size');
const fs = require('fs');

function build() {
    // let dimensions = sizeOf('img/cat.png');
    // console.log(dimensions.width, dimensions.height);

    fs.readdir('img', function(err, items) {
        console.log(items);
    
        for (var i=0; i<items.length; i++) {
            let dimensions = sizeOf(`img/${items[i]}`);
            console.log(items[i]);
            console.log(dimensions.width, dimensions.height)
        }
    });
}
  
exports.build = build;