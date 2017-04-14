import ACTIONS, { uri } from './index'
import { OrderedSet } from 'immutable'
import * as mapActions from './mapActions'
import store from '../configureStore'

/**
 * collectBranchAndYears organizes the metaData for the rest of the application
 * TODO: Consider refactoring to list
 * Each year for a particular layer is then concatinated
 * and returned
 * This function is extremely ugly but it is functional.
 * Eventually it will need to be rewritten.
 * @param {OrderedSet} - immutable ordered-set
 * @return {Array} - returns an array with two elements
 * the first being the branch
 * the second being an ordered-set descending
 */
export function collectBranchAndYears (orderedSet) {
  // Defensive programming but whatever
  if (!(orderedSet instanceof OrderedSet)) return
  // Pulls the state from redux
  const { mapReducer } = store.getState()
  // Gets the current branch of government being analyzed
  const { layer } = mapReducer.currentLayer
  // Gets the internal object
  const list = orderedSet.toList().get(layer)
  // Gets the key for the level government
  const level = Object.keys(list)
  // Grabs all the available keys
  const years = Object.keys(list[level])
  // Sort and return an array with the level of government and an OrderSet
  return [level, OrderedSet(years.sort((x, y) => y - x))]
}

/**
 * onLoad functions checks on the availability of the META-Data
 */
export function onLoad () {
  const { mapReducer } = store.getState()
  // REVIEW: Potentially unnecessary check
  if (mapReducer.geoFiles.size < 1) {
    pullMetaData()
    return
  }
  mapActions.fetchGeoJson()
}

/**
 * pullMetaData triggers an ajax action and loads necessary data if needed
 */
export function pullMetaData () {
  const { META_DATA } = ACTIONS
  window.fetch(uri + 'metaData.json')
        .then(rsp => {
          rsp.json().then(json => {
            const geoFiles = OrderedSet(json.geoFiles)
            const collected = collectBranchAndYears(geoFiles)
            store.dispatch({
              type: META_DATA,
              geoFiles,
              branch: collected[0],
              years: collected[1]
            })
            mapActions.fetchGeoJson()
          })
        })
        .catch(e => console.error(e))
}
