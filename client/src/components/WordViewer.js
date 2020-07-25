import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import './App.css';

class WordViewer extends React.Component {
  render() {
		const { list, access } = this.props;

    return (
      <div>
				<ListGroup className="list-group">
					{list.map((entry, id) =>
						{
							return <ListGroup.Item key={id}>{entry}</ListGroup.Item>
						}
					)}
				</ListGroup>

        <Alert key={access} variant={access != null ? 'success' : 'danger'}>
          access code: {access}
        </Alert>
      </div>
		);
  }
}
export default WordViewer;
