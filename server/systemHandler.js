const fs = require('fs');
const path = require('path');
const { sysPaths } = require('./systemPaths');
const mammoth = require('mammoth');
const trash = require('trash');


function getFiles(basePath, filter, ignore) {
    if (!fs.existsSync(basePath)) {
        console.log('no dir', basePath);
        return;
    }
    let results = [];
    var files = fs.readdirSync(basePath);

    for (var i = 0; i < files.length; i++) {
        var filename = path.join(basePath, files[i]);
        if (ignore.indexOf(files[i]) >= 0)
            continue;
        var stat = fs.statSync(filename);
        if (stat.isDirectory()) {
            results = results.concat(getFiles(filename, filter, ignore));
        } else {
            var extIndex = filename.lastIndexOf('.');
            var ext = filename.slice(extIndex);
            if (filter.indexOf(ext) >= 0) {
                results.push({
                    filename, stat
                })
            }
        }
    }

    return results;
}

function findFiles() {
    const filter = ['.docx', 'doc'];
    const ignore = ['node_modules', '$RECYCLE.BIN', 'System Volume Information', '.git'];
    let results = [];
    sysPaths.forEach(val => {
        console.log(val);
        results = results.concat(getFiles(val, filter, ignore));
    });

    return results;
}

function createBuffer(pdfPath, thumbnailPath) {
    let buffer = fs.readFileSync(thumbnailPath);
    fs.unlinkSync(pdfPath);
    fs.unlinkSync(thumbnailPath);

    return buffer;
}

// function NodeCanvasFactory() {}
// NodeCanvasFactory.prototype = {
//   create: function NodeCanvasFactory_create(width, height) {
//     assert(width > 0 && height > 0, 'Invalid canvas size');
//     var canvas = Canvas.createCanvas(width, height);
//     var context = canvas.getContext('2d');
//     return {
//       canvas: canvas,
//       context: context,
//     };
//   },

//   reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
//     assert(canvasAndContext.canvas, 'Canvas is not specified');
//     assert(width > 0 && height > 0, 'Invalid canvas size');
//     canvasAndContext.canvas.width = width;
//     canvasAndContext.canvas.height = height;
//   },

//   destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
//     assert(canvasAndContext.canvas, 'Canvas is not specified');

//     // Zeroing the width and height cause Firefox to release graphics
//     // resources immediately, which can greatly reduce memory consumption.
//     canvasAndContext.canvas.width = 0;
//     canvasAndContext.canvas.height = 0;
//     canvasAndContext.canvas = null;
//     canvasAndContext.context = null;
//   },
// };


async function getPreview(filePath, puppeteerBrowser) {
    
    try {
        const fileName = filePath.slice(filePath.lastIndexOf(path.sep) + 1);
        // let pdfPath = path.join(__dirname, '../../tmp', `${fileName.replace(/\.[^/.]+$/, "")}.pdf`);

        let results = await mammoth.convertToHtml({path: filePath});
        let html = results.value;
        // let imgPath = `${pdfPath.replace(/\.pdf$/, '')}-1.jpg`;
        
        // var canvas = document.createElement('canvas')
        // var ctx = canvas.getContext('2d')
        const page = await puppeteerBrowser.newPage();
        await page.setViewport({width: 595, height: 842});
        await page.setContent(html, {waitUntil: "load"})
        // await page.pdf({path: pdfPath, format: 'A4'});

        let buffer = await page.screenshot({});
        return buffer;
        
        // var rawData = new Uint8Array(fs.readFileSync(pdfPath));
        // let pdfDoc = await pdfjsLib.getDocument(rawData);
        // console.log('# pdf document loaded');
        // let pg = await pdfDoc.getPage(1);

        // var viewport = pg.getViewport({ scale: 1.0, });
        // canvas.height = viewport.height
        // canvas.width = viewport.width
  
        // var renderer = {
        //   canvasContext: ctx,
        //   viewport: viewport
        // }

        // await pg.render(renderer)
        // ctx.globalCompositeOperation = 'destination-over'
        // ctx.fillStyle = '#ffffff'
        // ctx.fillRect(0, 0, canvas.width, canvas.height)
        // var img = canvas.toDataURL('image/png')
        // console.log(img);



        // fs.writeFileSync(pdfPath, data);
        // let opts = {
        //     format: 'jpeg',
        //     out_dir: path.dirname(pdfPath),
        //     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        //     page: 1
        // }
        
        // let d = await pdf.convert(pdfPath, opts)
        // if(!fs.existsSync(imgPath))
        //     imgPath = `${imgPath.replace(/\-1.jpg$/, '')}-01.jpg`;
        // let buffer = createBuffer(pdfPath, imgPath);
        // return buffer;
    } catch (error) {
        throw error;
    }

}

async function deleteFile(filePath) {
    try { 
        if(!fs.existsSync(filePath))
            throw new Error();
        
        await trash(filePath);
    } catch (error) {
        console.log("throwing error")
        throw new Error();
    }
}

module.exports = {
    findFiles,
    getPreview,
    deleteFile
}
