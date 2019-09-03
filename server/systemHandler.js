const fs = require('fs');
const path = require('path');
const { sysPaths } = require('./systemPaths');

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

module.exports = {
    findFiles
}
