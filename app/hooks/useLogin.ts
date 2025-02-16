import request from '../network/Request';

export const useLogin = () => {
  
  const login = (name: string, phone: string) => {
    return new Promise((resolve, reject) => {
      return request()
          .exec(`user/login`, 'POST', { name, phone })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
              resolve(responseJson)
          })
          .catch(reject)
          })
  }

    const verify = (phone: string, otp: string) => {
      return new Promise((resolve, reject) => {
        return request()
          .exec(`user/verify`, 'POST', { phone, otp })
          .then((response) => response.json())
          .then(async (responseJson: any) => {
            document.cookie = `access-token=${responseJson.accessToken}; path=/; max-age=${60 * 60 * 24 * 365}; secure; samesite=lax`;
            document.cookie = `user-name=${responseJson.name}; path=/; max-age=${60 * 60 * 24 * 365}; secure; samesite=lax`;
            resolve(responseJson)
          })
          .catch(reject)
          })
    };

    return {
        login,
        verify
    }
};