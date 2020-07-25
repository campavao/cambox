import React from 'react';
import './App.css'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class WordUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userActivated: false
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.user !== prevProps.user) {
      return this.setState({userActivated: this.props.user != null});
   }
  }

  render() {
		const { user, SignoutMessage } = this.props;
    const { userActivated } = this.state;
    const message = userActivated ? `Welcome ${user}! Start adding to the list below!  ` : 'Please enter a name.'

    return (
			<div>
        <div>
          <h2 className="message">{message}{ userActivated && <SignoutMessage />}</h2>

        </div>
			   <InputGroup id='user-input'>
            <FormControl as="textarea" aria-label="With textarea" />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={() => {
                return this.props.updateText();
              }}>Button</Button>
            </InputGroup.Append>
         </InputGroup>
			</div>
		);
  }
}
export default WordUser;
