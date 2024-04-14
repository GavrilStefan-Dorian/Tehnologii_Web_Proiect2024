// GROUP CARDS
function createGroupCard(cardData) {
  const card = document.createElement('div');
  card.classList.add('group-card');
  card.innerHTML = `
    <img src="${cardData.imageSrc}" alt="${cardData.title}">
    <h3 class="group-title">${cardData.title}</h3>
    <p class="members-count">${cardData.membersCount} members</p>
    <p class="owner-name">Owner: ${cardData.ownerName}</p>
  `;
  
  card.addEventListener('click', function() {
    selectGroup(cardData);
  });

  return card;
}

const groupCardData = [
  {
    title: 'Book worms1',
    membersCount: 21,
    ownerName: 'person',
    imageSrc: 'group-image.png',
    description: 'Group for book club B2'
  },
  {
    title: 'Book worms2',
    membersCount: 21,
    ownerName: 'person',
    imageSrc: 'group-image.png',
    description: 'Group for book club B1'

  },
];

const popularGroupCardData = [
  {
    title: 'Popular Group 1',
    membersCount: 15,
    ownerName: 'owner1',
    imageSrc: 'group-image.png',
    description: 'Group for book club B1'

  },
  {
    title: 'Popular Group 2',
    membersCount: 18,
    ownerName: 'owner2',
    imageSrc: 'group-image.png',
    description: 'Group for book club B1'

  },
];

const containers = document.querySelectorAll('#your-groups-container');
containers.forEach(container => {
  groupCardData.forEach(cardData => {
    const card = createGroupCard(cardData);
    container.appendChild(card);
  });
});

const popularContainers = document.querySelectorAll('.group-cards-container--popular');
popularContainers.forEach(container => {
  popularGroupCardData.forEach(cardData => {
    const card = createGroupCard(cardData);
    container.appendChild(card);
  });
});
// ^ GROUP CARDS

//  ˇ  GROUP CREATE
document.querySelector('.create-group-btn').addEventListener('click', function() {
  window.location.href = 'create-group.html';
});
// ^ group create

//  ˇ
function selectGroup(cardData) {
  const groupName = encodeURIComponent(cardData.title);
  const imageSrc = encodeURIComponent(cardData.imageSrc);
  const desc = encodeURIComponent(cardData.description);
  window.location.href = `group-page.html?group=${groupName}&img=${imageSrc}&desc=${desc}`;
}
