const path = require('path')
const os = require('os');
const fs = require('fs')

let paths = fs.readFileSync('paths.json').toString();
paths = JSON.parse(paths);

module.exports = {
    sysPaths: paths.sysPaths
}