//TO DO переименовать функции, избегать объявления функций в функциях
// предумать что-то что бы брать только картинки из файла (const items = fs.readdirSync('img');)

const sizeOf = require('image-size');

//округление до сотых
function rounding(number, order) {
    return number = Math.round(number * order) / order;
}
 
//простая пропорция 
function proportion(a, b) {
    return rounding((a * 100) / b, 100);
}

//задумывалось как генерация флна для бонусника
function layoutToCSS() {
    let items, dataArr;

    items = createFolder();

    items = makeRelative(items, 1024, true);

    dataArr = generateCSS(items);

    return dataArr;
}

//беру все картинки из папки и c помощью  sizeOf беру их размеры
//возвращаю массив объектов 
//в объекте информация о названии картинки и ширина+высота
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

//в эту функцию передаю массив объектов (картинка + ширина и высота)
//второй параметр - это длина главной оси в пиксилях, третий отвечеает какая ось главная - ширина и ли высота
//true - главная width, false - height
//для всех элементов массива функция пересчитает width и height в относительные велечины
function makeRelative(items, mAx, axisFlag) {
    let arr = []; 

    for(var i = 0; i < items.length; i++) {
        items[i] = objRelativeSize(mAx, items[i], axisFlag);

        arr.push(items[i]);
    }
    // в зависимости от главной - оси меняется пропорция + это влияет используем vh или vw
    // mAx - главная ось макета пиксели
    // obj_mAx - главная ось картинки пиксели
    // obj_cAx - поперечная (cross) ось картики пиксели
    // obj_rmAx - главная ось картинки отноительное (relative) значение 
    // obj_rcAx - поперечная (cross) ось картинки отноительное (relative) значение 
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
    // возращает массив объектов
    return arr;
}

// принимает массив объектов и делает для каждого css правило, 
// возвращает массив css правил
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
//генерация стилей 
function createFile() {
    data = layoutToCSS(); 

    for(var i = 0; i < data.length; i++) {

        fs.appendFile('styles/styles.css', data[i], (err) => {
            if(err) throw err;
        });

    }
}

//пример передачи параметра при запуске таска из консоли
// {
//     gulp sprite --name mouse
//     const name = args.name || 'error';
// }