campground = JSON.parse(campground)
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})

//popup
const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};


//adding a marker and popup on the marker
const marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: popupOffsets, className: 'my-class' })
            .setHTML(`<h3>${`${campground.title}`}</h3><p>${campground.location}</p>`)
        // .setMaxWidth("300px")

    )
    .addTo(map)


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl())

