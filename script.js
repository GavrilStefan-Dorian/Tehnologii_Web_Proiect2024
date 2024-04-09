// GROUP CARDS
function createGroupCard(cardData) {
  return `
    <div class="group-card" onclick="selectGroup('${cardData.title}')">
      <img src="${cardData.imageSrc}" alt="${cardData.title}">
      <h3 class="group-title">${cardData.title}</h3>
      <p class="members-count">${cardData.membersCount} members</p>
      <p class="owner-name">Owner: ${cardData.ownerName}</p>
    </div>
  `;
}

//todo: will get from bd
const groupCardData = [
  {
    title: 'Book worms1',
    membersCount: 21,
    ownerName: 'person',
    imageSrc: 'group-image.png'
  },
  {
    title: 'Book worms2',
    membersCount: 21,
    ownerName: 'person',
    imageSrc: 'group-image.png'
  },
];

const popularGroupCardData = [
  {
    title: 'Popular Group 1',
    membersCount: 15,
    ownerName: 'owner1',
    imageSrc: 'group-image.png'
  },
  {
    title: 'Popular Group 2',
    membersCount: 18,
    ownerName: 'owner2',
    imageSrc: 'group-image.png'
  },
];

  const containers = document.querySelectorAll('.group-cards-container');
  containers.forEach(container => {
    const cardsHtml = groupCardData.map(createGroupCard).join('');
    container.innerHTML = cardsHtml;
  });

  const popularContainers = document.querySelectorAll('.group-cards-container--popular');
  popularContainers.forEach(container => {
    const cardsHtml = popularGroupCardData.map(createGroupCard).join('');
    container.innerHTML = cardsHtml;
  });
// ^ GROUP CARDS

//  ˇ  GROUP CREATE
document.querySelector('.create-group-btn').addEventListener('click', function() {
  window.location.href = 'create-group.html';
});
// ^ group create

//  ˇ
function selectGroup(groupName) {
  window.location.href = `group-page.html?group=${encodeURIComponent(groupName)}`;
}
// consider moving the html script here , or have js's for every html