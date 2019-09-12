const {parse} = require('url')
const { BrowserWindow, session } = require('electron');
const axios = require('axios');
const qs = require('querystring');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

const proxyUrl = 'http://localhost:3000'
const cookieUrl = 'http://localhost/'
async function login() {

    try {
        const secret = await axios.get(`${proxyUrl}/getClientSecrets`);
        const code = await loginPopup(secret.data);
        console.log('sending request')
        const tokens = await axios.post(`${proxyUrl}/fetchAccessTokens`, {code});
        await session.defaultSession.cookies.set({
          url: `${cookieUrl}`,
          name: 'access_token',
          value: tokens.data.access_token,
          domain: 'localhost',
          path: '/',
          expirationDate: Number(Date.now())/1000 + 3600,
          httpOnly: true,
          secure: false
        });

        var aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

        await session.defaultSession.cookies.set({
          url: `${cookieUrl}`,
          name: 'refresh_token',
          value: tokens.data.refresh_token,
          domain: 'localhost',
          path: '/',
          expirationDate: Number(aYearFromNow.getTime())/1000,
          httpOnly: true,
          secure: false
        });
        await session.defaultSession.cookies.flushStore();
        console.log('flushed cookies')
        
    } catch (error) {
      console.log(error)
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

async function checkLogin() {
  console.log('here')
  let cookie = await session.defaultSession.cookies.get({name: 'refresh_token', url:`${proxyUrl}`});
  //console.log(cookie)
  if(cookie.length !== 0) {
    return cookie[0];
  } else {
    throw new Error('not logged in');
  }
}

async function checkAndGenerateToken(refresh_token) {
  let cookie = await session.defaultSession.cookies.get({name: 'access_token', url: `${proxyUrl}`});
  console.log(cookie)
  if(cookie.length === 0) {

    const newAccessToken = await axios.get(`${proxyUrl}/fetchNewAccessToken`, {
      headers: {Cookie: `refresh_token=${refresh_token.value};`}
    }).catch(e => {
      console.log(e);
      throw new Error(false);
    })
    await session.defaultSession.cookies.set({
      url: `${cookieUrl}`,
      name: 'access_token',
      value: newAccessToken.data.access_token,
      domain: 'localhost',
      path: '/',
      expirationDate: Number(Date.now())/1000 + 3600,
      httpOnly: true,
      secure: false
    });
  }

  return true;
}

module.exports = {
    login,
    checkAndGenerateToken,
    checkLogin
}