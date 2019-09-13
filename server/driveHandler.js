const googleLoginHandler = require('./googleLoginHandler');

function getDriveFiles() {
    try {
        let accessTokenFound = await googleLoginHandler.checkToken();
        if(cookie) {

        } else {
            throw
        }
    } catch (error) {
        
    }
}