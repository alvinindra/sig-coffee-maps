import React, { Component } from 'react'
import Twemoji from './twemoji'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TableCount from './tableCount'
import github_mark from '../images/github_mark.png'

class Header extends Component {
  render() {
    const { rowCountProp } = this.props

    return (
      <div id="header">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" id="logo">
              <Twemoji emoji="☕" /> Coffee Shop West Java
            </Typography>
            <TableCount rowCountProp={rowCountProp} />
            <a
              href="https://docs.google.com/spreadsheets/d/1KPF8276wxfAYyzciJe5lQhneW6AzKEyiBBoTDJ0fc-g/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="contained" size="small">
                Add<span id="RoasterButtonMobile">&nbsp;Coffee Shop</span>
              </Button>
            </a>
            <a
              href="https://github.com/alvinindra/sig-coffee-maps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton className="GitHub" variant="outlined" size="small">
                <img
                  className="GitHub"
                  src={github_mark}
                  alt="Hosted on GitHub"
                />
              </IconButton>
            </a>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Header
