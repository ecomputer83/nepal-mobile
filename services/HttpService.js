const baseUrl = 'https://nepalog.azurewebsites.net/';
const GetAsync = (resourceUrl, token) => {
    return fetch(
        baseUrl + resourceUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+token
          }
        }
      )
}

const PostAsync = (resourceUrl, data, token) => {
    return fetch(
        baseUrl + resourceUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+token
          },
          body: JSON.stringify(data)
        }
      );
}

const PutAsync = (resourceUrl, data, token) => {
    return fetch(
        baseUrl + resourceUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+token
          },
          body: JSON.stringify(data)
        }
      );
}

const DeleteAsync = (resourceUrl, token) => {
    return fetch(
        baseUrl + resourceUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+token
          }
        }
      )
}

export default {GetAsync, PostAsync, PutAsync, DeleteAsync}