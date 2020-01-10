

const { createCanvas, Image, loadImage } = require('canvas');
const fs = require('fs');
const base64ToImage = require('base64-to-image');
const path = require('path');
const eachMaxWidth = 50;
const eachMaxHeight = 50;
const PREFIX_BASE64 = 'data:image/png;base64,';
let resizeResultUrl = [];



const draw = (base64Data) => {

    const canvas = createCanvas(eachMaxWidth, eachMaxHeight);
    const ctx = canvas.getContext('2d');
    const img = new Image()
  
    img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(25, 25, 25, 0, Math.PI * 2, true);    //x, y, radius, startAngle, endAngle, counterColckwish
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, eachMaxWidth, eachMaxHeight);

        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();

        resizeResultUrl.push(canvas.toDataURL());
        resizeResultUrl.push(canvas.toDataURL());

        roomThumb();
    }

    img.src = PREFIX_BASE64 + base64Data;
}

const roomThumb = () => {

    const maxWidth = 200;
    const maxHeight = 200;
    const roomThumb = createCanvas(maxWidth, maxHeight);
    const roomThumbCtx = roomThumb.getContext('2d');


    for (let ix = 0, ixLen = resizeResultUrl.length; ix < ixLen; ix++){
       
        loadImage(resizeResultUrl[ix]).then((image) => {
            
            const x = (ix * eachMaxWidth);
            const y = (ix * eachMaxHeight);

            roomThumbCtx.drawImage(image, x, y, eachMaxWidth, eachMaxHeight);
            
            if( ix == (ixLen - 1) ){
                let resultData = roomThumb.toDataURL();

                resultData = resultData.split(PREFIX_BASE64).pop();
                fs.writeFile('image.png', resultData, {encoding: 'base64'}, function(err) {
                    console.log('File created');
                });
            }
          
        })
    }
}

fs.readFile('1.png', (err, buffer) => {
    if (err) {
        console.log(err);
    }
    
    draw(buffer.toString('base64'));

})




// loadImage('2.png').then((image) => {


//     draw(image);

    

// })
  
