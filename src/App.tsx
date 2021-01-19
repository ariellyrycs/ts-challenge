import React from 'react';
import Home from './components/home';
import EditVideo from './components/edit-video';
import AddVideo from './components/add-video';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import { Button } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

let buttonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  marginLeft: '10px'
};

let containerStyle = {
  marginTop: '20px'
};


const App: React.FC = () => {

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Videos</Typography>
          <Button component={Link} to={'/home'} style={buttonStyle}>home</Button>
          <Button component={Link} to={'/about-us'} style={buttonStyle}>About Us</Button>
          <Button component={Link} to={'/faq'} style={buttonStyle}>FAQ</Button>

          <Button component={Link} to={'/add-video'} style={{marginLeft: 'auto'}} variant='contained' color='default'>Add Video</Button>
        </Toolbar>
      </AppBar>
      <Container style={containerStyle}>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/about-us">
            about-us
          </Route>
          <Route path="/faq">
            FAQ
          </Route>
          <Route path="/add-video">
              <AddVideo />
          </Route>
          <Route path="/edit/author/:authorId/video/:videoId" component={EditVideo} />
          <Redirect to="/home" />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
