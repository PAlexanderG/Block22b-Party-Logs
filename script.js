/ Create 2 elements (method) ParentNode.querySelector<Element>(selectors: string): Element | null 
const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

// Debugger (debugger) action to chechout the code

// create API_URL data element links
const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';
​
// create a promise function
const addNewParty = async (newParty) => {
  try {
    // code to create party from form data
    const response = await fetch(PARTIES_API_URL, { method: 'POST', body: JSON.stringify(newParty), headers: {
      'Content-Type': 'application/json'
    } });
    const data = await response.json();
    return data;
  } catch(error) {
    console.error(error);
  }
}
​
/*
newSongForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const genre = document.getElementById('genre').value;
        const releaseDate = document.getElementById('release-date').value;
​
        const newSong = {
            title,
            artist_id: artist,
            genre_id: genre,
            release_date: releaseDate
        };
​
        await addNewSong(newSong);
        const songs = await fetchAllSongs();
        renderAllSongs(songs);
    });
*/
​
// create a addNewPartyForm element
const addNewPartyForm = async () => {
  // make the code for the html
  let form = `
  <form>
    Name: <input name="name" value="Test">
    Description: <input name="description" value="testD">
    Location: <input name="location" value="testL">
    DAte: <input name="date" value="2023-04-07">
    Time: <input name="time" value="18:48:01">
​
    <button class="submit-button" type="button">Submit</button>
    </form>
  `
  newPartyForm.innerHTML = form;
  const submitButton = newPartyForm.querySelector('.submit-button');
  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const name = document.getElementsByName('name')[0].value;
    const description = document.getElementsByName('description')[0].value;
    const location = document.getElementsByName('location')[0].value;
    const date = document.getElementsByName('date')[0].value;
    const time = document.getElementsByName('time')[0].value;
​
    const newParty = {
        name,
        description,
        location,
        date,
        time
    };
​
    await addNewParty(newParty);
    const parties = await getAllParties();
    renderParties(parties);
  });

​
// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};
​
// get single party by id
const getPartyById = async (id) => {
  try {
    debugger
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};
​
// delete party
const deleteParty = async (id) => {
  // your code here
  try {
    debugger
    const response = await fetch(`${PARTIES_API_URL}/${id}`, { method: 'DELETE'});
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};
​
// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);
​
    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();
​
    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();
​
    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();
​
    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    // These did not exist on party
    /*
            <h2>${party.title}</h2>
            <p>${party.event}</p>
            <p>${party.city}</p>
            <p>${party.state}</p>
            <p>${party.country}</p>
    */
    partyDetailsElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.description}</p>
            <p>${party.location}</p>
            <p>${party.date}</p>
            <p>${party.time}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join('')}
          </ul>
          
​
​
            <button class="close-button">Close</button>
        `;
    partyContainer.appendChild(partyDetailsElement);
​
    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
      // this way works, but a little inefficient because we have to make the network request again, and rerender all the elemtns
      // init()
​
      // this way will be done by changing the style again
      toggleParties('block');
    });
  } catch (error) {
    console.error(error);
  }
};
​
// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button"  data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);
​
      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        // remove the parties first
        toggleParties('none');
​
        // partyElements.forEach((partyElement) => {
        //   partyElement.style.display = 'none';
        // })
​
        // displaying the details of the party that we clicked "show details"
        const element = event.target; // <- element that got interacted with
        const dataset = element.dataset; // <- dataset is an object that contains all data- attributes on an element
        const id = dataset.id 
        renderSinglePartyById(id)
      });
​
      // delete party
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        // your code here
        deleteParty(event.target.dataset.id)
      });
    });
  } catch (error) {
    console.error(error);
  }
};
​
// init function
const init = async () => {
  // your code here
  const partiesFromApi = await getAllParties()
  await renderParties(partiesFromApi)
};
​
init();
​
function toggleParties(displayVal) {
  const partyElements = document.getElementsByClassName('party');
  console.log(partyElements);
  for (const partyElement of partyElements) {
    partyElement.style.display = displayVal;
  }
}