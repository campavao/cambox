import React from 'react';
import WordViewer from './components/WordViewer';
import WordUser from './components/WordUser';
import QRCodeComponent from './components/QRCodeComponent';
import { Button, Container } from 'react-bootstrap';
import './index.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

class App extends React.Component {
	constructor() {
		super();
		const urlCode = window.location.search.replace('?code=', '');
		this.state = {
			userList: [],
			user: null,
			renderedResponse: '',
			serverList: [],
			access: urlCode ? parseInt(urlCode) : Math.floor(1000 + Math.random() * 9000),
			data: null,
			showMe: false
		}
	}

	componentDidMount() {
		this.updateAccessCode((err, serverList) => {
			console.log(serverList);
			return this.setState({
		    serverList: serverList.messages,
				userList: serverList.userList
		  })});
	}

	updateAccessCode = async (cb) => {
		socket.on('getListEmit', serverList => cb(null, serverList));
		socket.on('updateUserList', userList => this.setState({userList: userList}));
		socket.emit('getServerList', this.state.access);
		const code = window.location.search.replace('?code=', '');
		if (code !== null && code !== '') {
			await this.setState({access: parseInt(code)});
			this.getServerList();
		}
	}

		getServerList = async() => {
				return await
				fetch(`/getList/?code=${this.state.access}`)
				.then(async (res) => await res.json())
				.then(data => {
					return this.setState({serverList: data[0].messages, data: data});
				}).catch(err => {
					throw Error(err);
				})
		}

		updateServerList = async(data) => {
			const newItem = {
				accessCode: this.state.access,
				messages: data,
				userList: [this.state.user]
			}
			const response = await fetch('/updateList', {
				method: 'POST',
				credentials: 'same-origin', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json'
				},
				referrer: 'no-referrer', // no-referrer, *client
				body: JSON.stringify(newItem) // body data type must match "Content-Type" header
			});

			return await response.json();
		}

	updateText = async () => {
		const input = document.getElementsByTagName('textarea')[0].value;
		//reset the field after input
		document.getElementsByTagName('textarea')[0].value = '';

		if (this.state.user == null)
		{
			socket.emit('addUser', input.trim(), this.state.access);
			return this.setState({
				user: input.trim(),
				showMe: true
			})
		}
		else
		{
			this.getServerList();
			const newServerList = this.state.serverList;
			newServerList.push(input);
			const temp = await this.updateServerList(newServerList);
			return this.setState({
				serverList: temp.messages
			})
		}
	}

	signOut = () => {
		return this.setState({user: null, serverList: []});
	}

	signOutMessage = () => {
		return <Button onClick={this.signOut} variant="link" className="signout">sign out</Button>;
	}

	render() {
		const { userList, user, serverList, access } = this.state;
		const isPhone = window.screen.width <= 758;
		if (isPhone) {
			document.getElementById("canvas").style.display = "none";
		}

		return (
			<Container>
				{isPhone ? (
					<WordUser user={user} updateText={this.updateText} SignoutMessage={this.signOutMessage}/>
				) : (
					<div>
						<h1>Scan with your phone's camera to get started!</h1>
						<QRCodeComponent access={access}/>
						<ul>
							{userList.length > 0 && 'Connected: '}
							{userList.map(userEntry => <li>{userEntry}</li>)}
						</ul>
					</div>
				)}
					{access != null && serverList.length > 0 && <WordViewer list={serverList} access={access}/>}
			</Container>
		);
	};
}

export default App;
