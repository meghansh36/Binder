const fs = require('fs');
const path = require('path');
const { sysPaths } = require('./systemPaths');
const filePreview = require('filepreview-es6');

function getFiles(basePath, filter, ignore) {
    if(!fs.existsSync(basePath)) {
        console.log('no dir', basePath);
        return;
    }
    let results = [];
    var files = fs.readdirSync(basePath);
    for(var i=0; i<files.length; i++) {
        var filename = path.join(basePath, files[i]);
        var stat = fs.statSync(filename);
        if(stat.isDirectory()) {
            if( ignore.indexOf(files[i]) >= 0 ) 
                continue;
            results = results.concat(getFiles(filename, filter, ignore));
        } else {
            var extIndex = filename.lastIndexOf('.');
            var ext = filename.slice(extIndex);
            if(filter.indexOf(ext) >= 0) {
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
    const ignore = ['node_modules'];
    let results = [];
    sysPaths.forEach(val => {
        results = results.concat(getFiles(val, filter, ignore));
    });

    return results;
}

function createBuffer(thumbnailPath) {
    let buffer =  fs.readFileSync(thumbnailPath);

    fs.unlinkSync(thumbnailPath);

    return buffer;
}

async function getPreview(filePath) {

        const fileName = filePath.slice(filePath.lastIndexOf('/')+1);
        const options = {
        width: 200,
        height: 200,
        quality: 80,
        background: '#fff',
        pdf_path: '/tmp/'
        }
    
        const outputPath = path.join(__dirname + '/../src/assets', `${fileName.replace(/\.[^/.]+$/, "")}.jpg`);
        console.log('generating file preview', filePath, fileName);
        let response = await filePreview.generateAsync(filePath, outputPath, options);
        
        let buffer = createBuffer(response.thumbnail);

        return buffer;
}

module.exports = {
    findFiles,
    getPreview
}
