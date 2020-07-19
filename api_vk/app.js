const loginBtn = document.getElementById('login');
const friendsBtn = document.getElementById('getFriends');
const photosBtn = document.getElementById('getPhotos');
const newsBtn = document.getElementById('getNews');
const switchesBlock = document.querySelector('.switches-block');
const switchFriendsOnline = document.querySelector('.switch-friends-online');

loginBtn.addEventListener('click', () => {
  const greetingsText = document.querySelector('.greetings_text');
  Auth.login(7535975);
  VK.Api.call('users.get', { v: '5.120' }, function (r) {
    if (r.response) {
      greetingsText.textContent = `Привет, ${r.response[0].first_name} ${r.response[0].last_name}`;
      greetingsText.style.display = 'BLOCK';
      loginBtn.style.display = 'NONE';
    }
  });
});

friendsBtn.addEventListener('click', () => {
  getFriends(friendsFilterAll);
});

newsBtn.addEventListener('click', () => {
  console.log('Новости');
  getNews(newsFilterText);
});

switchFriendsOnline.addEventListener('click', (event) => {
  if (switchFriendsOnline.classList.contains('switch-off')) {
    switchFriendsOnline.classList.toggle('switch-off');
    getFriends(friendsFilterOnline);
  } else {
    switchFriendsOnline.classList.toggle('switch-off');
    getFriends(friendsFilterAll);
  }
});

function getFriends(friendsFilter) {
  new Promise((resolve, reject) => {
    VK.Api.call(
      'friends.get',
      { fields: 'online, photo_100, sex', v: '5.120' },
      function (r) {
        if (r.response) {
          switchesBlock.style.display = 'BLOCK';
          const friendsArr = friendsFilter(r.response);
          resolve(friendsArr);
        }
      },
    );
  }).then((cards) => createFriendCards(cards));
}

function getNews(newsFilter) {
  new Promise((resolve, reject) => {
    VK.Api.call('newsfeed.get', { filters: 'post', v: '5.120' }, function (r) {
      if (r.response) {
        switchesBlock.style.display = 'NONE';
        const newsArr = newsFilter(r.response);
        console.log(r.response);
        resolve(newsArr);
      }
    });
  }).then((news) => createNewsCards(news));
}

function friendsFilterOnline(friendsArr) {
  return friendsArr.items.filter((element) => {
    return element.online == 1;
  });
}
function friendsFilterAll(friendsArr) {
  return friendsArr.items;
}

function newsFilterText(newsArr) {
  let itemsArr = newsArr.items.filter((element) => {
    return element.text.length > 10;
  });
  return { groups: newsArr.groups, items: itemsArr };
}

function createFriendCards(cards) {
  let dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'mb-3');
  dataContainer.append(cardContainer);

  const containerRow = document.createElement('div');
  containerRow.classList.add('row', 'no-gutters');
  cardContainer.append(containerRow);

  cards.forEach((element) => createUserDataCard(containerRow, element));
}

function createUserDataCard(cardUserData, element) {
  let { first_name, last_name, id, photo_100 } = element;

  const userName = document.createElement('a');
  userName.href = `http://vk.com/id${id}`;
  userName.textContent = `${first_name} ${last_name}`;
  userName.classList.add('card-title');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('col-md-1', 'offset-md-1', 'my-2');
  const imageLink = document.createElement('a');
  imageLink.href = `http://vk.com/id${id}`;
  const avatar = new Image();
  avatar.src = photo_100;
  avatar.classList.add('card-img');
  imageLink.append(avatar);
  imageContainer.append(imageLink);

  const cardUserContainer = document.createElement('div');
  cardUserContainer.classList.add('col-md-3', 'my-2');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.append(userName);
  cardUserContainer.append(cardBody);

  const rightOffset = document.createElement('div');
  rightOffset.classList.add('col-md-1');

  cardUserData.append(imageContainer);
  cardUserData.append(cardUserContainer);
  cardUserData.append(rightOffset);
}

function createNewsCards(news) {
  let dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  const newsContainer = document.createElement('ul');
  newsContainer.classList.add('list-unstyled', 'offset-md-2', 'col-md-8');
  dataContainer.append(newsContainer);
  let newsItems = news.items;
  const newsGroups = news.groups;
  newsItems.forEach((element) =>
    createNewsDataCard(newsContainer, newsGroups, element),
  );
}

function createNewsDataCard(newsContainer, newsGroups, element) {
  const group = newsGroups.find((group) => group.id == element.source_id * -1);

  const article = document.createElement('li');
  article.classList.add('media', 'my-4');

  const groupLogo = new Image();
  groupLogo.src = group.photo_100;
  groupLogo.classList.add('mr-3');
  article.prepend(groupLogo);

  const articleText = document.createElement('div');
  articleText.classList.add('media-body');
  articleText.textContent = element.text;
  article.append(articleText);

  let articleTitle = document.createElement('h5');
  articleTitle.classList.add('mt-0', 'mb-1');
  articleTitle.textContent = group.name;
  articleText.prepend(articleTitle);
  newsContainer.append(article);
}
