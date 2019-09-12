const {parse} = require('url')
const { BrowserWindow, session } = require('electron');
const axios = require('axios');
const qs = require('querystring');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

const proxyUrl = 'http://localhost:3000'

async function login() {

    try {
        const secret = await axios.get(`${proxyUrl}/getClientSecrets`);
        const code = await loginPopup(secret.data);
        console.log('sending request')
        const tokens = await axios.post(`${proxyUrl}/fetchAccessTokens`, {code});
        session.defaultSession.cookies.set({
          url: `${proxyUrl}`,
          name: 'access_token',
          value: tokens.data.access_token,
          httpOnly: true,
          expirationDate: Number(Date.now()) + 3600000
        });

        var aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

        session.defaultSession.cookies.set({
          url: `${proxyUrl}`,
          name: 'refresh_token',
          value: tokens.data.refresh_token,
          httpOnly: true,
          expirationDate: Number(aYearFromNow.getTime())
        });
        
        
    } catch (error) {
        throw new Error('login failed', error);
    }
}

async function loginPopup(secret) {
    return new Promise((resolve, reject) => {
        const authWindow = new BrowserWindow({
            width: 500,
            height: 600,
            show: true
        })

        const urlParams = {
            response_type: 'code',
            redirect_uri: secret.redirect_url,
            client_id: secret.id,
            scope: secret.scopes,
          }
        
        const authURL = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`

        authWindow.on('closed', () => {
            reject(new Error('window closed by user'));
          })
      
          authWindow.webContents.on('will-navigate', (event, url) => {
              console.log('will-navigate')
              handleNavigation(url)
          })
      
          authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
              console.log('kjf');
            handleNavigation(newUrl)
          })
      
          authWindow.loadURL(authURL)


          function handleNavigation (url) {
            const query = parse(url, true).query
            if (query) {
              if (query.error) {
                reject(new Error(`There was an error: ${query.error}`))
              } else if (query.code) {
                // Login is complete
                authWindow.removeAllListeners('closed')
                setImmediate(() => authWindow.close())
      
                // This is the authorization code we need to request tokens
                resolve(query.code)
              }
            }
          }


     })
}



module.exports = {
    login
}