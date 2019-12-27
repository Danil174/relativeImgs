const gulp = require('gulp');
const sizeOf = require('image-size');
const fs = require('fs');

function layoutToCSS() {
    let items, dataArr;

    items = createFolder();

    items = makeRelative(items, 1024, true);

    dataArr = generateCSS(items);

    return dataArr;
}

////

function generateCSS(items) {
    let stylesheet = [];

    for(var i = 0; i < items.length; i++) {
        let rule = `.${items[i].name} {`
            + `\n\tbackground-image: url("../img/episode/@{bonusName}/${items[i].name}");` 
            + `\n\twidth: ${items[i].width};`
            + `\n\theight: ${items[i].height};\n}\n\n`; 

        stylesheet.push(rule);
    }

    return stylesheet;
}

function makeRelative(items, mAx, axisFlag) {
    let arr = []; 

    for(var i = 0; i < items.length; i++) {
        items[i] = objRelativeSize(mAx, items[i], axisFlag);

        arr.push(items[i]);
    }

    function objRelativeSize(mAx, obj, axisFlag) {
        let obj_mAx = axisFlag ? obj.width : obj.height;
        let obj_cAx = axisFlag ? obj.height : obj.width;

        obj_rmAx = proportion(obj_mAx, mAx);
        obj_rcAx = obj_rmAx * obj_cAx / obj_mAx;

        obj_rmAx = rounding(obj_rmAx, 100);
        obj_rcAx = rounding(obj_rcAx, 100);

        obj.width = axisFlag ? obj_rmAx : obj_rcAx;
        obj.height = axisFlag ? obj_rcAx : obj_rmAx;

        return obj;
    }

    return arr;
}

function createFolder() {
    let collection = [];

    const items = fs.readdirSync('img');

    for (var i = 0; i < items.length; i++) {

        let dimensions = sizeOf(`img/${items[i]}`);

        const itemObj = {
            name: items[i].slice(0, -4), 
            width: dimensions.width,
            height: dimensions.height
        }

        collection.push(itemObj);
    }

    return collection;
}

function rounding(number, order) {
   return number = Math.round(number * order) / order;
}

function proportion(a, b) {
    return rounding((a * 100) / b, 100);
}

function styleGenerator(mainAxis, layoutWidth = 1 ,layoutHeight = 1) {
    let mAx, rmAx, cAx, rcAx, mainRule;
    // rcAx = (cAx * rmAx) / mAx
    
    rcAx = proportion(layoutHeight, layoutWidth);

    switch (mainAxis) {
        case true: //width
            mainRule = `.bonusWorldBg {\n \twidth: 100vw;\n \theight: ${rcAx}vw;\n}\n\n`;
          break;
        case false: //height
            mainRule = `.bonusWorldBg {\n \twidth: ${rcAx}vh;\n \theight: 100vh;\n}\n\n`;
          break;

        default:
            console.error('error!');
            return;
    }

    return mainRule;
}

function createFile() {
    let data = styleGenerator(true, 2048, 2678);

    fs.writeFile('styles/styles.css', data, (err) => {
        if(err) throw err;
    });

    data = layoutToCSS(); 

    for(var i = 0; i < data.length; i++) {

        fs.appendFile('styles/styles.css', data[i], (err) => {
            if(err) throw err;
        });

    }
}

function build(cb) {
    createFile();
    cb();
}
  
exports.build = build;