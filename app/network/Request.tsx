export default function Request(options) {
  return Http.getInstance(options)
}

class Http {
  static instance = null
  private middlewares: Array<(headers: any) => void> = []

  static getInstance(options) {
    let ins = Http.instance
    if (ins == null) {
      ins = new Http()
      ins.init(options)
      Http.instance = ins
    }

    return ins
  }

  init(options = {}) {
    this.headers = {
      'Content-Type': 'application/json'
    }
    
    const params = options.params
    if (params?.accessToken) {
      this.setAuthorization(params.accessToken)
    }
  }

  setAuthorization(token) {
    if (this.headers.Authorization) {
      delete this.headers.Authorization
    }

    if (token) {
      this.headers.Authorization = `Bearer ${token}`
    }
  }

  setErrorHandler(handler) {
    this.errorHandler = handler
  }

  addHeader(name, header) {
    if (name && header) {
      this.headers[name] = header
    }
  }

  addMiddleware(middleware: (headers: any) => void) {
    this.middlewares.push(middleware)
  }

  private applyMiddlewares() {
    this.middlewares.forEach(middleware => {
      middleware(this.headers)
    })
  }

  async exec(url, method, body) {
    console.log('Headers:', this.headers)
    const root = '/api/'

    this.applyMiddlewares()

    return new Promise((resolve, reject) => {
        fetch(root + url, {
          method,
          headers: this.headers,
          body: body ? JSON.stringify(body) : null,
        })
          .then((response) => {
            if (response.status === 401) {
              window.location.href = '/';
            }
            if (!response.ok) {
              return response.json().then((err) => {
                reject(err)
              })
            } else {
              resolve(response)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
  }
}
