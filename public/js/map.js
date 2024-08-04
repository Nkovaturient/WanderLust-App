
mapboxgl.accessToken = mapToken;
// console.log(mapToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: list.geometry.coordinates || [74.1240, 15.2993], // [-74.5, 40]starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});


console.log(geocode, locatext);


const marker2 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(geocode) 
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${locatext}</h4><p>Exact location provided after booking</p>`)
.setMaxWidth("300px")
)
.addTo(map);