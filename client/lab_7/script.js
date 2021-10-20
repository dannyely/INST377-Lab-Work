async function dataHandler() {
  const endpoint =
    'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  const response = await fetch(endpoint);
  let restaurants = await response.json();
  // const prom = fetch(endpoint)
  // console.log(prom)
  //   fetch(endpoint).then((blob) =>
  //     blob.json().then((data) => restaurants.push(...data))
  //   );

  function findMatches(wordToMatch, restaurants) {
    if (wordToMatch == '') {
      return [];
    }
    return restaurants.filter((establishment) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return establishment.zip.match(regex);
    });
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, restaurants)
      .filter((item) => item.geocoded_column_1)
      .slice(0, 5);
    const html = matchArray
      .map((establishment) => {
        const regex = new RegExp(event.target.value, 'gi');
        const nameRestaurant = establishment.name;
        return `
                <li>
                   <span class="name">${nameRestaurant},${establishment.city}</span>
                </li>
                `;
      })
      .join('');
    markerList = matchArray.map((item) => [
      item.geocoded_column_1.coordinates[1],
      item.geocoded_column_1.coordinates[0],
    ]);
    // markerList is an array of coordinates - add all to the map
    // define markers, then make sure it's cleared out
    markerGroup.clearLayers();
    addMarkersAndPan(markerGroup);
    suggestions.innerHTML = html;
    // let map = mapInit();
    console.log(markerList);
  }
  function addMarkersAndPan(markerGroup) {
    try {
      var marker1 = L.marker([markerList[0][0], markerList[0][1]]).addTo(
        markerGroup
      );
      var marker2 = L.marker([markerList[1][0], markerList[1][1]]).addTo(
        markerGroup
      );
      var marker3 = L.marker([markerList[2][0], markerList[2][1]]).addTo(
        markerGroup
      );
      var marker4 = L.marker([markerList[3][0], markerList[3][1]]).addTo(
        markerGroup
      );
      var marker5 = L.marker([markerList[4][0], markerList[4][1]]).addTo(
        markerGroup
      );
      centerLeafletMapOnMarker(mymap, markerList[0]);
    } catch (error) {
      console.log(error, 'Less than 5 results');
    }
  }
  function centerLeafletMapOnMarker(map, marker) {
    // console.log(marker);
    // console.log('above ^^')
    map.setView(marker, 11);
    // var markerBounds = L.latLngBounds(latLngs);
    // map.fitBounds(markerBounds);
  }

  function mapInit() {
    var mymap = L.map('mapid').setView([38.9, -76.7], 13);
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoiZDNseSIsImEiOiJja3V5Nnh3ZXc2ejNmMnduendwY3B3eThlIn0.PwoyRu3TAyO4X5a1J6ag_g',
      }
    ).addTo(mymap);
    return mymap;
  }

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    displayMatches(evt);
  });
  let mymap = mapInit();
  var markerGroup = L.layerGroup().addTo(mymap);
}

window.onload = dataHandler;
