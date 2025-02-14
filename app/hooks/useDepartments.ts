import request from '../network/Request';

export const useDepartment = () => {
  
  const getDepartments = () => {
    return new Promise((resolve, reject) => {
        return request()
        .exec(`department`, 'GET')
        .then((response) => response.json())
        .then(resolve)
        .catch(reject)
        })
    }

    return {
        getDepartments
      }
};