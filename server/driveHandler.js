const googleLoginHandler = require('./googleLoginHandler');
const axios = require('axios');

async function getDriveFiles() {
    try {
        await googleLoginHandler.checkAndGenerateToken();

        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);
        let driveFiles = await axios.get(`${googleLoginHandler.proxyUrl}/getDriveFiles`, {
            headers: {Cookie: `access_token=${access_token.value};`}
        })
        console.log('fetched files');
        return driveFiles;
    } catch (error) {
        throw error;
    }
}

async function fetchPreview(url) {
    try {
        await googleLoginHandler.checkAndGenerateToken();

        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);
        let preview = await axios.post(`${googleLoginHandler.proxyUrl}/fetchPreview`, {url}, {
            headers: {Cookie: `access_token=${access_token.value};`}
        });
        return preview;
    } catch(e) {
        throw e;
    }
}

async function rename(id, newName) {
    try {
        await googleLoginHandler.checkAndGenerateToken();

        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);

        let res = await axios.post(`${googleLoginHandler.proxyUrl}/renameFile`, {id, newName}, {
            headers: {Cookie: `access_token=${access_token.value};`}
        })
    } catch(e) {
        throw e;    
    }
}

async function deleteFile(id) {
    try {
        await googleLoginHandler.checkAndGenerateToken();
        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);

        let res = await axios.post(`${googleLoginHandler.proxyUrl}/deleteFile`, {id}, {
            headers: {Cookie: `access_token=${access_token.value};`}
        })
    } catch(e) {
        throw e;
    }
}

async function downloadFile(exportLink, path, browser) {
    try {
        // const page = await browser.newPage();
        // await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: path});
  	    // await page.goto(exportLink);
        await googleLoginHandler.checkAndGenerateToken();
        let access_token = await googleLoginHandler.getTokenCookie('access_token', googleLoginHandler.cookieUrl);

        let {data} = await axios.post(`${googleLoginHandler.proxyUrl}/downloadFile`, {exportLink}, {
            responseType: 'arraybuffer',
            headers: {Cookie: `access_token=${access_token.value};`}
        });
        return data;
    } catch (error) {
        throw error
    }
}


module.exports = {
    getDriveFiles,
    fetchPreview,
    rename,
    deleteFile,
    downloadFile
}