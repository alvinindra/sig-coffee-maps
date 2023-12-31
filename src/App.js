import React, { Component } from 'react'
import './App.css'
import { BingProvider } from 'leaflet-geosearch'
import Header from './components/header'
import CoffeeMap from './components/map.js'
import CoffeeTable from './components/table'
import CircularProgress from '@material-ui/core/CircularProgress'

// Material-UI
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

const { GoogleSpreadsheet } = require('google-spreadsheet')

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(
  '1KPF8276wxfAYyzciJe5lQhneW6AzKEyiBBoTDJ0fc-g'
)

// Google Sheets Document ID -- DEV
// const doc = new GoogleSpreadsheet('1KPF8276wxfAYyzciJe5lQhneW6AzKEyiBBoTDJ0fc-g');

// Provider for leaflet-geosearch plugin
const provider = new BingProvider({
  params: {
    key: process.env.REACT_APP_BING_MAPS_API_KEY,
  },
})

class App extends Component {
  // Initial state
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      dataMaps: [],
      dataHeader: [{ label: 'Title' }, { label: 'City' }],
      rowCount: '',
    }
  }

  componentDidMount() {
    // Google Sheets API
    // Based on https://github.com/theoephraim/node-google-spreadsheet

    var self = this

    ;(async function main() {
      // Use service account creds
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        ),
      })

      await doc.loadInfo() // Loads document properties and worksheets

      const sheet = doc.sheetsByIndex[0]
      const rows = await sheet.getRows()

      // Total row count
      self.setState({ rowCount: rows.length })

      rows.forEach((x) => {
        if (x.Coordinates) {
          x.mapCoords = JSON.parse(x.Coordinates)
        }
      })

      self.setState({ dataMaps: rows })

      var needsUpdates = rows.filter((x) => {
        return !x.Coordinates
      })

      if (needsUpdates && needsUpdates.length > 0) {
        for (let index in needsUpdates) {
          let city = needsUpdates[index].City

          try {
            let providerResult = await provider.search({
              query: city + ', West Java, Indonesia',
            })
            let latlon = [providerResult[0].y, providerResult[0].x]
            needsUpdates[index].Coordinates = JSON.stringify(latlon) // Convert obj to string
            needsUpdates[index].mapCoords = latlon
            await needsUpdates[index].save() // Save to remote Google Sheet
          } catch (e) {
            console.log(e)
          }
        }

        // Update the rows array with the changes made in needsUpdates
        for (let index in needsUpdates) {
          let rowIndex = rows.findIndex(
            (row) => row._rowNumber === needsUpdates[index]._rowNumber
          )
          if (rowIndex !== -1) {
            rows[rowIndex] = needsUpdates[index]
          }
        }

        self.setState({ dataMaps: rows })
      }

      // Loading message
      self.setState({ isLoading: false })
    })()
  }

  render() {
    return (
      <div className="App">
        <Header rowCountProp={this.state.rowCount} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Paper id="CoffeeMap" className="fadeIn">
              {this.state.isLoading ? (
                <div className="flexLoading">
                  <div className="loading">Brewing...</div>
                </div>
              ) : (
                <CoffeeMap dataMapsProp={this.state.dataMaps} />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper id="CoffeeTable">
              {this.state.isLoading ? (
                <div className="flexLoading">
                  <div className="loading">
                    <CircularProgress />
                  </div>
                </div>
              ) : (
                <CoffeeTable
                  dataMapsProp={this.state.dataMaps}
                  dataHeaderProp={this.state.dataHeader}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default App
