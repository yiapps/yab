import React from 'react'
import PropTypes from 'prop-types'
import PopoverLayout from './popover_layout'
import ColumnIndicator from '../column_indicator'

export default class LoadingPopover extends React.PureComponent {

  static defaultProps = {
    isXS: PropTypes.bool,
    onClose: PropTypes.func,
  }

  render() {
    const { isXS } = this.props
    
    return (
      <PopoverLayout
        width={250}
        isXS={isXS}
        onClose={this.props.onClose}
      >
          <div className={[_s.d, _s.px15, _s.py15, _s.mt15, _s.mb15].join(' ')}>
            <div className={[_s.d, _s.px15, _s.py15, _s.mt15, _s.mb15, _s.aiCenter, _s.jcCenter].join(' ')}>
              <ColumnIndicator type='loading' />
            </div>
          </div>
      </PopoverLayout>
    )
  }

}
