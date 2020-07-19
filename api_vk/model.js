let Auth = {
  login: function (appId) {
    return new Promise(function (resolve, reject) {
      VK.init({
        apiId: appId,
      });

      VK.Auth.login(function (response) {
        if (response.session) {
          resolve(response);
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      });
    });
  },
};
