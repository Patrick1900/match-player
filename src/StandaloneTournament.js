import React, { useEffect, useState } from 'react';
import './App.css';
import { Link, Card, Typography, Divider, List, ListItem, CircularProgress, LinearProgress, Grid, Button } from '@material-ui/core';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Refresh from '@material-ui/icons/Refresh';
import Autorenew from '@material-ui/icons/Autorenew';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '100%',
    width: '100%'
  },
  gridList: {
    width: '100%',
    height: '100%'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  underline: {
    cursor: 'pointer',
    '&:hover': {
      'text-decoration': 'underline'
    }
  }
});

function getFixedPoints(val) {
  if (!val || !val.points) {
    return 0;
  }

  return Number(val.points).toFixed();
}

const StandaloneTournament = ({ results, ifpaId, claimedBy, refresh, info }) => {
  const classes = useStyles();
  const [round, setRound] = useState(null);

  useEffect(() => {

    if (!info) {
      return;
    }

    if(!results || results.length === 0) {
      return;
    }

    setRound({pos: results.length, data: results[results.length -1]})
  }, [info, results]); 

  function onRefresh() {
    refresh();
  }

  function sortedPlayer(game) {
    return game.players.sort((a,b) => Number(a.game.index) - Number(b.game.index));
  }

  function arenaName(arenaId) {
    return info.arenas.find(a => a.arena_id === arenaId).name;
  }

  function onPlayerClick(player) {
    localStorage.removeItem('pin:tournament');
    window.location.href = `${window.location.origin}/user/${player.claimed_by}`;
  }

  function onIfpaPlayerClick(player) {
    window.open(`https://www.ifpapinball.com/player.php?p=${player.ifpa_id}`, "_blank")
  }

  const PlayerLink = ({player, game}) => {
    if (!player) {
      return null;
    }

    const [points, setPoints] = useState(null);

    useEffect(() => {
      if (!game) {
        return;
      }

      const result = game.results.find(g => g.player_id === player.player_id);
      setPoints(getFixedPoints(result));
    }, []); 

    if (player.claimed_by === claimedBy || player.ifpa_id === ifpaId) {
    return <Grid item container justify="space-between" wrap="nowrap"><Grid item><div><b>{player.name}</b></div></Grid>{points !== null && <Grid item>{points}</Grid>}</Grid>
    }

    if (player.claimed_by) {
      return <Grid item container justify="space-between" wrap="nowrap"><Grid item><div style={{cursor: 'pointer'}} onClick={()=> onPlayerClick(player)}>{player.name}</div></Grid>{points !== null && <Grid item>{points}</Grid>}</Grid>;
    }

    if (player.ifpa_id) {
      return <Grid item container justify="space-between" wrap="nowrap"><Grid item><div className={classes.underline} onClick={()=> onIfpaPlayerClick(player)}>{player.name}</div></Grid>{points !== null && <Grid item>{points}</Grid>}</Grid>;
    }
    return <Grid item container justify="space-between" wrap="nowrap"><Grid item><div>{player.name}</div></Grid>{points !== null && <Grid item>{points}</Grid>}</Grid>;
  }

  function onBefore() {
    if (round.pos - 1 === 0) {
        return;
    }
    const pos = round.pos - 1;
    setRound({pos, data: results[pos -1]})
  }

  function onNext() {
    if (round.pos + 1 > results.length) {
      return;
    }
    const pos = round.pos + 1;
    setRound({pos, data: results[pos - 1]})
  }

  function autoSync() {
    if (info.status === 'completed') {
      return false;
    }
    if ((new Date(info.start).setHours(0,0,0,0) === new Date().setHours(0,0,0,0))) {
      return true;
    }
    return false;
  }

  const Round = ({round}) => {
    if (!round) {
      return null;
    }
    return <><Grid item container spacing={2} justify="center" alignContent="center">
      {round.pos > 1 && <Grid item style={{cursor: 'pointer'}} onClick={onBefore}><NavigateBefore style={{fontWeight:'600', color: 'green'}}/></Grid>}
      <Grid item><Typography>Round: {round.pos}</Typography></Grid>
      <Grid item><Link href={`https://matchplay.events/live/${info.url_label}/matches?round_id=${round.data.round_id}`} target="_blank"><AssignmentIcon style={{color: 'lightgray'}}/></Link></Grid>
      {round.pos < results.length && <Grid item style={{cursor: 'pointer'}} onClick={onNext}><NavigateNext style={{cursor: 'pointer', fontWeight:'600', color: 'green'}}/></Grid>}
    </Grid>
    <div style={{display: 'flex', position:'absolute', bottom: '5px', right: '5px'}} container><Autorenew style={{color: autoSync() ? 'green' : 'gray'}}></Autorenew><Refresh onClick={onRefresh} style={{cursor: 'pointer', color:'green'}}></Refresh></div>
    </>
  }

  function getXs(games) {
    if (games.length === 1) {
      return 12;
    }
    if (games.length === 2 || games.length === 4 || games.length === 5 || games.length === 7 || games.length === 8 || games.length === 10) {
      return 6;
    }
    if (games.length === 3 || games.length === 6 ||  games.length === 9 || games.length === 11) {
      return 4;
    }
    if (games.length > 32) {
      return 2;
    }
    return 3;
}

function detectActiveGames(g) {
  if (!g.results || g.results.length === 0) {
    return true;
  }
  return Number(g.results.reduce((a, b) => a.points || 0 + b.points || 0)).toFixed() === 0;
}

return <>
    {round && <Grid justify="center" container spacing={2} style={{marginTop: '16px'}}>
        <Grid item style={{background: 'whitesmoke', width: '100%', borderRadius: '5px', margin:'0 5px', position: 'relative'}}><Round round={round}/></Grid>
        <Grid item container spacing={2} xs={12} style={{padding:'0'}}>
      {round.data.games.map((g) => {
        if (g.players.length === 1) {
        return <Grid style={{marginTop: '8px'}}  xs={getXs(round.data.games)} key={g.game_id} item><Card style={{padding: '4px', height:'100%'}}><Grid justify="center" wrap="nowrap" item direction="column" container spacing={1}><Grid item><PlayerLink player={g.players[0]}/></Grid><Grid item key={g.game_id}>
              <i style={{opacity: '0.9', color: 'lightgreen'}}>bye</i>
          </Grid></Grid></Card></Grid>
        }
        return <Grid style={{marginTop: '8px'}} xs={getXs(round.data.games)} key={g.game_id} item><Card style={{background: detectActiveGames(g) ? 'AliceBlue' : 'white', height:'100%', padding: '4px'}}><Grid wrap="nowrap"  item direction="column" container spacing={1}><Grid item style={{color: "darkblue", fontWeight: '800'}}>
          {arenaName(g.arena_id)}
        </Grid>{sortedPlayer(g).map(p => <Grid item><PlayerLink  player={p} game={g}/></Grid>)}</Grid></Card></Grid>
      })}
    </Grid></Grid>}
    <div style={{height:'10px', width:'100%'}}></div>
  </>
   
}

export default StandaloneTournament;
