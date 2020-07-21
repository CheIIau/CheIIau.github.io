const loginBtn = document.getElementById('login');
const friendsBtn = document.getElementById('getFriends');
const photosBtn = document.getElementById('getPhotos');
const newsBtn = document.getElementById('getNews');
const switchesBlock = document.querySelector('.switches-block');
const switchFriendsOnline = document.querySelector('.switch-friends-online');
const modalWindow = document.querySelector('.modal');

modalWindow.addEventListener('click', () => {
  modalWindow.style.display = 'NONE';
});

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
  imageContainer.classList.add('col-md-1', 'col-4', 'offset-md-1', 'my-2');
  const imageLink = document.createElement('a');
  imageLink.href = `http://vk.com/id${id}`;
  const avatar = new Image();
  avatar.src = photo_100;
  avatar.classList.add('card-img');
  imageLink.append(avatar);
  imageContainer.append(imageLink);

  const cardUserContainer = document.createElement('div');
  cardUserContainer.classList.add('col-md-3', 'col-8', 'my-2');
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
  newsContainer.classList.add(
    'list-unstyled',
    'offset-md-1',
    'col-md-10',
    'mt-5',
  );
  dataContainer.append(newsContainer);
  let newsItems = news.items;
  const newsGroups = news.groups;
  newsItems.forEach((element) =>
    createNewsDataCard(newsContainer, newsGroups, element),
  );
}

function createNewsDataCard(newsContainer, newsGroups, element) {
  const group = newsGroups.find((group) => {
    if (element.source_id < 0) {
      return group.id == element.source_id * -1;
    } else {
      return group.id == element.source_id;
    }
  });

  const article = document.createElement('li');
  article.classList.add('media', 'my-3');

  const groupLogoRef = document.createElement('a');
  groupLogoRef.href = `http://vk.com/club${group.id}`;
  const groupLogoImage = new Image();
  groupLogoImage.classList.add('group-logo');
  groupLogoImage.src = group.photo_100;
  groupLogoRef.classList.add('mr-3');
  groupLogoRef.append(groupLogoImage);
  article.prepend(groupLogoRef);

  const articleContent = document.createElement('div');
  articleContent.classList.add('media-body');
  articleContent.textContent = element.text;
  article.append(articleContent);

  let articleRef = document.createElement('a');
  articleRef.classList.add('mt-0', 'mb-1');
  articleRef.href = `http://vk.com/club${group.id}`;

  let articleTitle = document.createElement('h5');
  articleTitle.textContent = group.name;
  articleRef.append(articleTitle);
  articleContent.prepend(articleRef);

  const newsImageContainer = document.createElement('div');
  newsImageContainer.classList.add(
    'row',
    'text-center',
    'text-lg-left',
    'my-4',
  );
  newsImageContainer.addEventListener('click', (event) => {
    openModalImage(event);
  });
  const imagesArr = element.attachments;
  if (typeof imagesArr != 'undefined') {
    imagesArr.forEach((image) => createNewsImages(image, newsImageContainer));
  }
  articleContent.append(newsImageContainer);
  newsContainer.append(article);
  newsContainer.append(document.createElement('hr'));
}

function createNewsImages(image, newsImageContainer) {
  if (image.type == 'photo') {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('col-lg-4', 'col-md-6', 'col-6');
    const imageLink = document.createElement('a');
    imageLink.classList.add('d-block', 'mb-4', 'h-100');
    imageContainer.append(imageLink);

    const imageInGrid = new Image();
    imageInGrid.src = image.photo.sizes[image.photo.sizes.length - 1].url;
    imageInGrid.classList.add('img-fluid', 'img-thumbnail', 'news-img');
    imageLink.append(imageInGrid);
    newsImageContainer.append(imageContainer);
  }
}

function openModalImage(event) {
  const modalImage = document.querySelector('.modal-content');

  if (event.target.tagName == 'IMG') {
    modalWindow.style.display = 'BLOCK';
    modalImage.src = event.target.src;
  }
}
