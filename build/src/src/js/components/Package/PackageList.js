import React from "react"
import params from "Params"
import ClipboardJS from 'clipboard'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

new ClipboardJS('.btn')

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let id = this.props.pkg.name
    let state = this.props.pkg.state

    let toggleButtonTag = ''
    if (state == 'running') toggleButtonTag = 'Pause'
    if (state == 'exited') toggleButtonTag = 'Start'

    let dotClass = 'text-danger'
    if (state == 'running') dotClass = 'text-success'

    let accessLinks = ''
    if (this.props.pkg.manifest && this.props.pkg.manifest.homepage) {

      if (typeof this.props.pkg.manifest.homepage == typeof {}) {
        accessLinks = Object.getOwnPropertyNames(this.props.pkg.manifest.homepage).map((e, i) => (
          <a class="package-link" key={i} href={this.props.pkg.manifest.homepage[e]}>{e} </a>
        ))

      } else if (typeof this.props.pkg.manifest.homepage == typeof 'String') {
        accessLinks = (<a class="package-link" href={this.props.pkg.manifest.homepage}>homepage</a>)
      }

    }

    return (
      <tr id={id}>
        <td>{'my.'+this.props.pkg.name}</td>
        <td>{this.props.pkg.version}</td>
        <td>
          <span className={classNames("small", "state-light", dotClass)}>⬤  </span>
          <span className="state-label">{state}</span>
        </td>
        <td>
          {accessLinks}
        </td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link
              class="btn btn-outline-secondary tableAction-button"
              to={'package/'+this.props.pkg.shortName}
              >
              Settings
            </Link>
          </div>
        </td>
      </tr>
    );
  }
}

export default class PackageList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let DNProws = [];
    this.props.packageList.filter(p => p.isDNP).map((pkg, i) => {
      DNProws.push(
        <Row key={i}
          pkg={pkg}
          removePackage={this.props.removePackage}
          togglePackage={this.props.togglePackage}
          logPackage={this.props.logPackage}
        />
      );
    })

    let CORErows = [];
    this.props.packageList.filter(p => p.isCORE).map((pkg, i) => {
      CORErows.push(
        <Row key={i}
          pkg={pkg}
          removePackage={this.props.removePackage}
          togglePackage={this.props.togglePackage}
          logPackage={this.props.logPackage}
        />
      );
    })

    return (
      <div class="table-responsive">
        <table class='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>State</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan="4">DNP packages</th>
            </tr>
            {DNProws}
            <tr>
              <th colSpan="4">CORE packages</th>
            </tr>
            {CORErows}
          </tbody>
        </table>
      </div>
    );
  }
}