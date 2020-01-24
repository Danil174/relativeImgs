const gulp = require('gulp');
// const { task } = require('gulp');
// const { series } = require('gulp');
const fs = require('fs');
const args = require('yargs').argv;
const parse = require('./parse').createFile;

var spritesmith = require('gulp.spritesmith');

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

function testP(cd) {
    // gulp sprite --name mouse
    const name = args.name || 'error';
    parse(name);
    cd();
};

function build(cd) {
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }
    cd();
}

exports.build = build;
// exports.bonus = bonus;