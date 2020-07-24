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
  // eslint-disable-next-line no-undef
  Auth.login(7535975, 2 | 4 | 8192 | 262144);
  // eslint-disable-next-line no-undef
  VK.Api.call('users.get', { v: '5.120' }, function (r) {
    if (r.response) {
      greetingsText.textContent = `Привет, ${r.response[0].first_name} ${r.response[0].last_name}`;
      greetingsText.style.display = 'BLOCK';
      loginBtn.style.display = 'NONE';
    }
  });
});

friendsBtn.addEventListener('click', () => {
  switchesBlock.style.display = 'BLOCK';
  getResponseData(
    'friends.get',
    { fields: 'online, photo_100, sex', v: '5.120' },
    friendsFilterAll,
  ).then((cards) => createFriendCards(cards));
});

newsBtn.addEventListener('click', () => {
  switchesBlock.style.display = 'NONE';
  getResponseData(
    'newsfeed.get',
    { filters: 'post', v: '5.120' },
    newsFilterText,
  ).then((news) => createNewsCards(news));
});

photosBtn.addEventListener('click', () => {
  switchesBlock.style.display = 'NONE';
  const photosImageContainer = createPhotoCards();
  getResponseData('photos.get', { album_id: 'profile', v: '5.120' }).then(
    (photos) => {
      photos.items.forEach((image) => {
        createImages(image, photosImageContainer);
      });
    },
  );
});

switchFriendsOnline.addEventListener('click', () => {
  const method = 'friends.get';
  const parameters = { fields: 'online, photo_100, sex', v: '5.120' };
  if (switchFriendsOnline.classList.contains('switch-off')) {
    switchFriendsOnline.classList.toggle('switch-off');
    getResponseData(method, parameters, friendsFilterOnline).then((cards) =>
      createFriendCards(cards),
    );
  } else {
    switchFriendsOnline.classList.toggle('switch-off');
    getResponseData(method, parameters, friendsFilterAll).then((cards) =>
      createFriendCards(cards),
    );
  }
});
//self-explanatory
function getResponseData(method, parameters, filter = null) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    VK.Api.call(method, parameters, function (r) {
      if (r.response) {
        if (filter) {
          const filteredArr = filter(r.response);
          resolve(filteredArr);
        }
        resolve(r.response);
      }
    });
  });
}
//Filters
function friendsFilterOnline(friendsArr) {
  return friendsArr.items.filter((element) => {
    return element.online == 1;
  });
}
function friendsFilterAll(friendsArr) {
  return friendsArr.items;
}

function newsFilterText(newsArr) {
  const itemsArr = newsArr.items.filter((element) => {
    return element.text.length > 10;
  });
  return { groups: newsArr.groups, items: itemsArr };
}
//creates a blank sheet for cards
function createFriendCards(cards) {
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'mb-3');
  dataContainer.append(cardContainer);

  const containerRow = document.createElement('div');
  containerRow.classList.add('row', 'no-gutters');
  cardContainer.append(containerRow);

  cards.forEach((element) => createUserDataCard(containerRow, element));
}
//creates cards and stuff
function createUserDataCard(cardUserData, element) {
  const { first_name, last_name, id, photo_100 } = element;

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
//creates a blank sheet for photos
function createPhotoCards() {
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';
  const photosImageContainer = document.createElement('div');
  photosImageContainer.classList.add(
    'row',
    'text-center',
    'text-lg-left',
    'my-4',
  );
  dataContainer.append(photosImageContainer);
  photosImageContainer.addEventListener('click', (event) => {
    openModalImage(event);
  });
  return photosImageContainer;
}
//creates a blank sheet for news
function createNewsCards(news) {
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  const newsContainer = document.createElement('ul');
  newsContainer.classList.add(
    'list-unstyled',
    'offset-md-1',
    'col-md-10',
    'mt-5',
  );
  dataContainer.append(newsContainer);
  const newsItems = news.items;
  const newsGroups = news.groups;
  newsItems.forEach((element) =>
    createNewsDataCard(newsContainer, newsGroups, element),
  );
}
//creates news cards and filling them with data and stuff
function createNewsDataCard(newsContainer, newsGroups, element) {
  const group = newsGroups.find((group) => {
    if (element.source_id < 0) {
      return group.id == element.source_id * -1;
    } else {
      return group.id == element.source_id;
    }
  }); //отрицательный индекс - группа, положительный - user

  const article = document.createElement('li');
  article.classList.add('media', 'my-3');

  const groupLogoRef = document.createElement('a');
  groupLogoRef.href = `http://vk.com/club${group.id}`;
  const groupLogoImage = new Image();
  groupLogoImage.classList.add('group-logo');
  groupLogoImage.src = group.photo_100;
  groupLogoRef.classList.add('col-2');
  groupLogoRef.append(groupLogoImage);
  article.prepend(groupLogoRef);

  const articleContent = document.createElement('div');
  articleContent.classList.add('media-body');
  articleContent.textContent = element.text;
  article.append(articleContent);

  const articleRef = document.createElement('a');
  articleRef.classList.add('mt-0', 'mb-1');
  articleRef.href = `http://vk.com/club${group.id}`;

  const articleTitle = document.createElement('h5');
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
    // somehow there are elements without attachments
    imagesArr.forEach((image) => {
      if (image.type == 'photo') {
        createImages(image.photo, newsImageContainer);
      }
    });
  }
  articleContent.append(newsImageContainer);
  newsContainer.append(article);
  newsContainer.append(document.createElement('hr'));
}
//adds an image on news card
function createImages(image, newsImageContainer) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('col-lg-4', 'col-md-6', 'col-6');
  const imageLink = document.createElement('a');
  imageLink.classList.add('d-block', 'mb-4', 'h-100');
  imageContainer.append(imageLink);

  const imageInGrid = new Image();
  imageInGrid.src = image.sizes[image.sizes.length - 1].url;
  imageInGrid.classList.add('img-fluid', 'img-thumbnail', 'news-img');
  imageLink.append(imageInGrid);
  newsImageContainer.append(imageContainer);
}
//for image to open in modal window
function openModalImage(event) {
  const modalImage = document.querySelector('.modal-content');

  if (event.target.tagName == 'IMG') {
    modalWindow.style.display = 'BLOCK';
    modalImage.src = event.target.src;
  }
}
