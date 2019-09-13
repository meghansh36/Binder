const googleLoginHandler = require('./googleLoginHandler');
const axios = require('axios');

async function getDriveFiles() {
    try {
        await googleLoginHandler.checkAndGenerateToken();

        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);
        console.log('ACT', access_token);
        let driveFiles = await axios.get(`${googleLoginHandler.proxyUrl}/getDriveFiles`, {
            headers: {Cookie: `access_token=${access_token.value};`}
        })
        console.log('fetched files');
        return driveFiles;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getDriveFiles,

}