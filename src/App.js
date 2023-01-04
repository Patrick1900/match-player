import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBox from './Search-Box.js';
import Player from './Player.js';
import { Fade, Container } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

var localStorageSpace = function(){
  var data = '';
  for(var key in window.localStorage){
      if(window.localStorage.hasOwnProperty(key)){
          data += window.localStorage[key];
      }
  }
  if(data) {
    var l = ((data.length * 16)/(8 * 1024)).toFixed(2)
    console.warn('local storage size: ', l)
    if (l > 4500) {
      data = ''
      for(var key in window.localStorage){
          if(key.startsWith('cc')){
            window.localStorage.removeItem(key);
          } else {
            if(window.localStorage.hasOwnProperty(key)){
              data += window.localStorage[key];
            }
          }
        }
        l = ((data.length * 16)/(8 * 1024)).toFixed(2)
        data = ''
        if (l > 4500) {
          for(var key in window.localStorage){
            if(key.startsWith('p:analyse')){
              window.localStorage.removeItem(key);
            }
            else {
              if(window.localStorage.hasOwnProperty(key)){
                data += window.localStorage[key];
              }
            }
          }
        }
        l = ((data.length * 16)/(8 * 1024)).toFixed(2)
        if (l > 4500) {
          window.localStorage.clear()
        }
      }

  }

};

function App() {
  const [matchPlayId, setMatchPlayId] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);

  useEffect(() => {
    localStorageSpace();
    if (window.location.pathname) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length > 1 && pathParts[0] === 'user' && !isNaN(pathParts[1])) {
        setMatchPlayId(Number(pathParts[1]));
        if (pathParts.length > 3 && pathParts[2] === 'tour' && !isNaN(pathParts[3])) {
          setTournamentId(Number(pathParts[3]));
        }
        return;
      }
    }

    const pin = localStorage.getItem('pin:tournament');
    const id = localStorage.getItem('last:fetched:player');

    if (pin && id) {
      window.location.href = `${window.location.origin}/user/${id}/tour/${pin}`;
    } else if (id) {
      window.location.href = `${window.location.origin}/user/${id}`;
    }
  }, []);

  function fetchPlayer(userId) {
    if (!userId) {
      return;
    }
    if (matchPlayId === userId) {
      return;
    }

    const pin = localStorage.getItem('pin:tournament');

    if (pin) {
      window.location.href = `${window.location.origin}/user/${userId}/tour/${pin}`;
    } else{
      window.location.href = `${window.location.origin}/user/${userId}`;
    }
  }

  return <Router>
      <div>
        {!tournamentId && <div style={{position: 'sticky', top: '0', zIndex: '999999'}}>
          <div style={{background:'snow'}}>
            <SearchBox onFetchPlayer={fetchPlayer} loadMatchPlayId={matchPlayId} />
          </div>
          <div style={{height: '12px', width: '100%', background: 'snow', opacity: '0.9'}}></div>
          <div style={{height: '4px', width: '100%', background: 'snow', opacity: '0.8'}}></div>
          <div style={{height: '2px', width: '100%', background: 'snow', opacity: '0.7'}}></div>
          <div style={{height: '2px', width: '100%', background: 'snow', opacity: '0.6'}}></div>
          <div style={{height: '2px', width: '100%', background: 'snow', opacity: '0.5'}}></div>
          <div style={{height: '2px', width: '100%', background: 'snow', opacity: '0.4'}}></div>
          <div style={{height: '2px', width: '100%', background: 'snow', opacity: '0.3'}}></div>
        </div>}
        <Switch>
          <Route exact path="/">
            <Fade in out timeout={3000}>
              <img src="logo.big.png" style={{opacity: "0.7", maxWidth:"75%", height:"auto", position: "absolute", right: "0", bottom: "0"}}/>
            </Fade>
          </Route>
          <Route exact path="/user/:id">
            <Container>
              {matchPlayId && <PlayerContent playerId={matchPlayId}/>}
            </Container>
          </Route>
          <Route exact path="/user/:id/tour/:tour">
            <div style={{margin: '0 64px'}} >
              {matchPlayId && tournamentId && <PlayerContent playerId={matchPlayId} tournamentId={tournamentId}/>}
            </div>
          </Route>
        </Switch>
      </div>
  </Router>
}

const PlayerContent = ({playerId, tournamentId}) => {
  const [message, setMessage] = useState(null);
  const [player, setPlayer] = useState(null);

  function fetchPlayer() {
    setMessage(null);
    const d = new Date();
    const ds = `${d.getFullYear()}${d.getMonth()}${d.getDay()}`;
    const lsd  =  `player:${playerId}`;

    try {
      const r = localStorage.getItem(lsd);
      if (r) {
        const rex = JSON.parse(r);
        if (rex.d === ds) {
          setPlayer(rex.p);
          localStorage.setItem('last:fetched:player', playerId);
          return;
        }
      }
    } catch(e) {
      // do nothing
    }

    fetch(`https://matchplay.events/data/users/${playerId}`)
      .then(response => {
        if (!response.ok) {
          setMessage(`Player with the id ${playerId} not found: ${response.status}`);
          return null;
        }
        return response.json();
      })
      .then(json => {
        if (!json) {
          return;
        }
        setPlayer(json);
        localStorage.setItem('last:fetched:player', playerId);
        localStorage.setItem(lsd, JSON.stringify({
          d: ds,
          p: json
        }));
      }).catch(e => {
        setMessage(`Unexpected Error on parsing Info for Player id {id}: ${e}`);
      })
    return;
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  return (
    <>
      {message && <Alert variant="filled" severity="warning">{message}</Alert>}
      {player && <Player player={player} tournamentId={tournamentId}/>}
    </>
  );
}

export default App;
