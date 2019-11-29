const path = require('path')
const os = require('os');
const fs = require('fs')

function fetchPaths() {
    let paths = fs.readFileSync('paths.json').toString();
    paths = JSON.parse(paths);
    return paths.sysPaths;
}


module.exports = {
    fetchPaths
}