const fs = require('fs');
const path = require('path');
const { sysPaths } = require('./systemPaths');
const word2pdf = require("word2pdf");
const pdf = require('pdf-poppler')
const wsl_path = require("wsl-path");

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

async function getPreview(filePath) {
    
    try {
        const fileName = filePath.slice(filePath.lastIndexOf(path.sep) + 1);
        let data = await word2pdf(filePath);
        console.log(data)
        let pdfPath = path.join(__dirname, '../src/assets', `${fileName.replace(/\.[^/.]+$/, "")}.pdf`);
        let imgPath = `${pdfPath.replace(/\.pdf$/, '')}-1.jpg`;
        fs.writeFileSync(pdfPath, data);
        let opts = {
            format: 'jpeg',
            out_dir: path.dirname(pdfPath),
            out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
            page: 1
        }
        
        let d = await pdf.convert(pdfPath, opts)
        if(!fs.existsSync(imgPath))
            imgPath = `${imgPath.replace(/\-1.jpg$/, '')}-01.jpg`;
        let buffer = createBuffer(pdfPath, imgPath);
        return buffer;
    } catch (error) {
        throw error;
    }

}

module.exports = {
    findFiles,
    getPreview
}
