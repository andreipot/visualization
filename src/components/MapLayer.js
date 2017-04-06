import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map, Marker, TileLayer } from 'react-leaflet'
import GeoJsonUpdatable from './GeoJsonUpdatable'
import * as Actions from '../actions/mapActions'

// Begin Map Variables
const stamenTonerTiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const stamenTonerAttr = 'Map tiles by &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const mapCenter = [41.203323, -77.194527]
const zoomLevel = 8
// End Map Variables

const AddressMarker = props => {
  if (props === null) return null
  const markers = props.map((e, i) => {
    const position = [e.lat, e.lng]
    return <Marker key={i} position={position} />
  })
  return markers
}

/**
 * MapLayer is the GIS layer of this web-app
 * Most of the GIS is Handled through Map and TileLayer
 * Most of this was taken from Azavea's Blog:
 * https://azavea.com/blog/2016/12/05/getting-started-with-react-and-leaflet
 *
 * This Component holds a reference to a real DOM node outside the virtual DOM
 * so leaflet can be updated.
 * https://facebook.github.io/react/docs/refs-and-the-dom.html
 */
@connect(props => {
  return props.mapReducer
})
class MapLayer extends Component {
  componentWillMount () {
    Actions.mapLoad()
  }
  render () {
    return (
      <div className='leaflet-container'>
        <Map className='map' center={mapCenter} zoom={zoomLevel}
          // Reference to actual DOM
          ref={ref => { this.leaflet = ref }} >
          <TileLayer
            attribution={stamenTonerAttr}
            url={stamenTonerTiles} />
          <GeoJsonUpdatable data={this.props.data} />
          { AddressMarker(this.props.addr) }
        </Map>
      </div>
    )
  }
}

export default MapLayer
