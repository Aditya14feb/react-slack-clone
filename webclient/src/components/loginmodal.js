import React, { Component } from 'react';
import { Segment, Modal, Button, Form, Message, Header, Image, Label } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import logo from '../assets/circlelogo.svg';
import { isEmpty } from 'lodash';

import '../styles/modal.css';

import { bindActionCreators } from 'redux';
import { signin, signup, getUsers, getChannels, setCurrentChannel, getChannelMessages, initiateWebSocketConnection } from '../redux/actions';
import { connect } from 'react-redux';

class LoginModal extends Component {
  state = {
    mode: "signin",
    visible: false,
    email: "",
    password: "",
    firstname: "",
    username: "",
    lastname: "",
    password1: "",
    password2: "",
  }

  submit = (e) => {
    e.preventDefault();
    const { email, password, username, firstname, lastname, password1, password2 } = this.state;
    if (this.state.mode === 'signin') {
      this.props.signin(this, email, password)
        .then(resp => {
          if (resp.response === undefined) {
            this.props.initiateWebSocketConnection()
            this.props.getUsers()
              .then(resp => this.props.getChannels())
              .then(resp => this.props.setCurrentChannel(this.props.location.pathname.split("/")[2]))
              .then(resp => this.props.getChannelMessages())
          }
        })
    } else {
      this.props.signup(this, email, username, firstname, lastname, password1, password2)
        .then(resp => {
          if (resp.response === undefined) {
            this.props.getUsers()
              .then(resp => this.props.getChannels())
              .then(resp => this.props.setCurrentChannel(this.props.location.pathname.split("/")[2]))
              .then(resp => this.props.getChannelMessages())
          }
        })
    }
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => {
    e.preventDefault();
    this.setState({ visible: true })
  }

  showSignup = (e) => {
    e.preventDefault()
    this.setState({ mode: "signup" })
  }

  showLogin = (e) => {
    e.preventDefault()
    this.setState({ mode: "signin" })
  }

  render() {
    const { mode, visible, email, password, firstname, lastname, username, password1, password2 } = this.state;
    const { fetching, fetchError } = this.props;
    return (
      <Modal
        trigger={<Button onClick={this.showModal}>sign in to start chatting</Button>}
        dimmer="inverted"
        open={visible}
        onClose={this.hideModal}
        closeOnEscape={true}
        closeOnRootNodeClick={false}
        closeIcon={<Label color='grey' floating style={{ cursor: 'pointer' }}>X</Label>}
        size='small'>
        {(mode === 'signin') ? (
          <Modal.Header as='h2' className="modal-header">Sign In</Modal.Header>
        ) : (
            <Modal.Header as='h2' className="modal-header">Sign Up</Modal.Header>
          )}
        <Modal.Content className='modal-content-container'>
          <Segment basic padded className='login-content'>
            {(mode === 'signin') ? (
              <Form id='signin' onSubmit={this.submit} loading={fetching.count !== 0} warning={fetchError.length > 0 && fetching.fetch === 'sign in'}>
                <Header className="form-title" textAlign='center' as='h1'>
                  <Image src={logo} alt='logo' />
                  Howl
                </Header>
                <Message warning>{fetchError}</Message>
                <Form.Field>
                  <input placeholder='Email' required type='email' name='email' value={email} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <input placeholder='Password' required type='password' name='password' value={password} onChange={this.handleChange} />
                </Form.Field>
                <Button type='submit' fluid className='submit-button' style={{ display: 'none' }}>submit</Button>
                <p style={{ textAlign: 'center' }}>
                  <Label>
                    Email
                    <Label.Detail>guest@guest.com</Label.Detail>
                  </Label>
                  <Label>
                    Password
                    <Label.Detail>dinosaurs</Label.Detail>
                  </Label>
                </p>
                <p style={{ textAlign: 'center' }}>
                  Don't have an account?
                  <br />
                  <a onClick={this.showSignup}>Sign Up</a>
                </p>
              </Form>
            ) : (
                <Form id='signup' onSubmit={this.submit} loading={fetching.count !== 0} warning={fetchError.length > 0 && fetching.fetch === 'sign up'}>
                  <Header className="form-title" textAlign='center' as='h1'>
                    <Image src={logo} alt='logo' />
                    Howl
                    </Header>
                  <Message warning>{fetchError}</Message>
                  <Form.Field required>
                    <input placeholder='Email address' type='email' name='email' value={email} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field required>
                    <input placeholder='Username' type='text' name='username' value={username} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <input placeholder='First Name' type='text' name='firstname' value={firstname} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <input placeholder='Last Name' type='text' name='lastname' value={lastname} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field required>
                    <input placeholder='Password' type='password' name='password1' value={password1} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field required>
                    <input placeholder='Confirm Password' type='password' name='password2' value={password2} onChange={this.handleChange} />
                  </Form.Field>
                  <Button type='submit' fluid className='submit-button' style={{ display: 'none' }}>submit</Button>
                  <p style={{ textAlign: 'center' }}>
                    Already have an account?
                    <br />
                    <a onClick={this.showLogin}>Sign In</a>
                  </p>
                </Form>
              )}
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button className='exit-button' onClick={this.hideModal} disabled={fetching.count !== 0}>
            exit
            </Button>
          <Button className='submit-button' onClick={this.submit} disabled={fetching.count !== 0}>
            submit
            </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.fetching,
    fetchError: state.fetchError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signin,
    signup,
    getChannels,
    getUsers,
    setCurrentChannel,
    getChannelMessages,
    initiateWebSocketConnection
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginModal));
