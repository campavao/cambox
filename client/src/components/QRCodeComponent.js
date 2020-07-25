import React from 'react';
import QRCode from 'qrcode';

var canvas = document.getElementById('canvas');
var protocol = window.location.protocol;
var port = window.location.port;

class QRCodeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			access: this.props.access
		}
	}

  render() {
    QRCode.toCanvas(canvas, `${protocol}//192.168.0.21:${port}/?code=${this.state.access}`, function (error) {
      if (error) console.error(error)
    });
		return <div />;
  }
}
export default QRCodeComponent;
