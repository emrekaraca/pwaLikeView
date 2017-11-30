import auth0 from 'auth0-js'
import EventEmitter from 'EventEmitter'
import router from './../router'

export default class AuthService {
  authenticated = this.isAuthenticated()
  userAccess = this.hasAccess()
  userMin = this.getMin()
  userMax = this.getMax()
  authNotifier = new EventEmitter()

  constructor () {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  auth0 = new auth0.WebAuth({
    domain: 'likeview.eu.auth0.com',
    clientID: 'OeJrwyt845PVN55aG347IlAH1YEOPLGV',
    // redirectUri: 'http://localhost:8080/callback',
    redirectUri: 'https://likeview2.surge.sh/callback',
    audience: 'https://likeview.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid app_metadata'
  })

  login () {
    this.auth0.authorize()
  }

  handleAuthentication () {
    let self = this
    self.auth0.parseHash(function (err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        self.auth0.client.userInfo(authResult.accessToken, function (err, user) {
          if (user) {
            console.log('user1:', user)
            self.setSession(authResult, user['https://likeview.surge.sh/app_metadata'].components, user['https://likeview.surge.sh/app_metadata'].userMin, user['https://likeview.surge.sh/app_metadata'].userMax)
            router.replace('/')
          } else if (err) {
            router.replace('/')
            console.log(err)
          }
        })
      } else if (err) {
        router.replace('/')
        console.log(err)
      }
    })
  }

  setSession (authResult, user, userMin, userMax) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    localStorage.setItem('userAccess', JSON.stringify(user))
    localStorage.setItem('userMin', JSON.stringify(userMin))
    localStorage.setItem('userMax', JSON.stringify(userMax))
    this.authNotifier.emit('authChange', { 
      authenticated: true,
      userAccess: user,
      userMin: userMin,
      userMax: userMax
    })
    // console.log('user2:', user)
    // this.authNotifier.emit('userChange', user['https://likeview.surge.sh/app_metadata'].components)
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('userAccess')
    localStorage.removeItem('userMin')
    localStorage.removeItem('userMax')
    // localStorage.removeItem('userChange')
    this.userProfile = null
    this.authNotifier.emit('authChange', false)
    // this.authNotifier.emit('userChange', [])
    // navigate to the home route
    router.replace('/')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  hasAccess () {
    let userAccess = JSON.parse(localStorage.getItem('userAccess'))
    return userAccess
  }

  getMin () {
    let userMin = JSON.parse(localStorage.getItem('userMin'))
    return userMin
  }

  getMax () {
    if (JSON.parse(localStorage.getItem('userMax')) !== undefined) {
      let userMax = JSON.parse(localStorage.getItem('userMax'))
      return userMax
    }
  }
}
