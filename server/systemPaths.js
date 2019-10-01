const path = require('path')
const os = require('os');


let sysPaths = [`${path.join(os.homedir(), 'Desktop')}`]

module.exports = {
    sysPaths
}