const googleLoginHandler = require('./googleLoginHandler');
const axios = require('axios');

async function getDriveFiles() {
    try {
        await googleLoginHandler.checkAndGenerateToken();

        let access_token = googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.proxyUrl);
        
        let driveFiles = await axios.get(`${googleLoginHandler.proxyUrl}/getDriveFiles`, {
            headers: {Cookie: `access_token=${access_token.value};`}
        })

    } catch (error) {
        throw error;
    }
}


module.exports = {
    getDriveFiles,

}