import React, { useEffect, useState } from 'react';
import './App.css';
import { Typography, Divider, List, ListItem, CircularProgress, LinearProgress, Grid, Button } from '@material-ui/core';
import House from '@material-ui/icons/House';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FilterTiltShift from '@material-ui/icons/FilterTiltShift';
import Close from '@material-ui/icons/Close';
import handleViewport from 'react-in-viewport';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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

const Standings = ({ inViewport, forwardedRef, tournament, ifpaId, claimedBy, playerClicked, tournamentInfo, standingsInfo }) => {
    const classes = useStyles();

    const [load, setLoad] = useState(false);
    const [message, setMessage] = useState(null);
    const [games, setGames] = useState(null);
    const [winLostList, setWinLostList] = useState(null);
    const [standing, setStanding] = useState(null);
    const [totalParticipants, setTotalParticipants] = useState(null);
    const [wonBy, setWonBy] = useState(null);
    const [progress, isProgress] = useState(true);
    const [arenas, setArenas] = useState([]);
    const [isArenas, setIsArenas] = useState(false);

    const fetchTournament = (() => {
      setArenas([]);
      setIsArenas(false)
      fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setArenas(json.arenas);
          tournamentInfo(json)
          setIsArenas(true)
        }).catch(e => {
          setIsArenas(true)
        })
      return;  
    });  

    const fetchTournamentResults = (() => {
      setGames(null);
      setWinLostList(null);
      fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}/results`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          const selectedPlayerGames = json.map((j) => { const games = j.games.map(g => { g['roundId'] = j.round_id; return g;}); return j.games; } ).flat().filter((g) => g.players.some((p) => (p.ifpa_id === ifpaId || p.claimed_by === claimedBy)));
          setGames(selectedPlayerGames);

          if (selectedPlayerGames) {
            const winLostList = selectedPlayerGames.map((g) => {
              const player = g.players.find(p => p.ifpa_id === ifpaId || p.claimed_by === claimedBy);
              if (!player) {
                return;
              }
              const playerId = player.player_id;
              const results =  Object.assign(g.results).sort((a,b) => Number(a.points) - Number(b.points));
              if (!results || !results.length) {
                return;
              }
              return results[results.length -1].player_id === playerId ? {
                won: g
              } : { 
                lost: g
              };
            }).reduce((a, v) => {
                if (!v) {
                  return a;
                }
                if (v.lost) {
                  a.lost.push(v);
                } else {
                  a.won.push(v);
                }
                return a;
            }, {won: [], lost: []})
            setWinLostList(winLostList);
          }
          isProgress(false);
        }).catch(e => {
          isProgress(false);
          setMessage(`Results for the tournament id:${tournament.tournament_id} not loaded: ${e}`);
        })
      return;  
    });  

    const fetchStandings = (() => {
      setStanding(null);
      setTotalParticipants(null)
      fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}/standings`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setTotalParticipants(json.length)
          setWonBy(json.find((j) => j.position === 1))
          setStanding(json.find((j) => j.claimed_by === claimedBy));
          standingsInfo(json);
        }).catch(e => {
          // do nothing
        })
      return;  
    });  

    function loadData() {
      setMessage(null);
      isProgress(true);
      try {
        fetchTournament();
        fetchStandings();
        fetchTournamentResults();
      } catch {
        isProgress(false);
      }    
    }  

    useEffect(() => {
      if (!load) {
        return;
      }
      loadData();
    }, [load]); 

    useEffect(() => {
      if (!inViewport) {
        return;
      }
      if (load) {
        if (message) {
          loadData();
        }
        return;
      }

      setLoad(true);
    }, [inViewport]); 

    const Player = ({info}) => {
      return ifpaId === info.ifpaId || info.claimedBy === claimedBy ? 
      <b style={{padding: '0 2px'}}>{`${info.name} ${info.points}`}</b> :
      <span onClick={() => playerClicked(info)} className={info.claimedBy || info.ifpaId ? classes.underline : null} style={{padding: '0 2px'}}>{`${info.name} ${info.points}`}</span>;
    }

    return (
      <div ref={forwardedRef}>
        {progress && <LinearProgress style={{margin: '15px 0'}}/>}
        <Grid container wrap="nowrap" spacing={5}>
          {message && <Grid item><span style={{margin:'10px', color: 'orange'}}>{message}</span><Button onClick={() => loadData()}variant="outlined" color="primary">Reload</Button></Grid>}
          {games && standing && <Grid item xs={3} justify="left">
              <Typography>{`Position: `}<b>{standing.position}</b></Typography>
              {standing.points !== null && standing.points !== undefined && <Typography>{`Points: ${standing.points}`}</Typography>}
              {games.length > 0 && winLostList && <Typography>{`Games played: ${games.length} (`}<span style={{color:'green'}}>{winLostList.won.length}</span>{`/`}<span style={{color:'red'}}>{winLostList.lost.length}</span>{`)`}</Typography>}
              <Typography>{`Number of Players: ${totalParticipants}`}</Typography>
              {wonBy && <Typography onClick={() => playerClicked(wonBy)} className={wonBy.claimed_by ? classes.underline : null}>{`Winner: ${wonBy.name}`}</Typography>}
              {wonBy && !wonBy.claimed_by && <i style={{color: 'lightgrey'}}>Player without MatchPlayId</i>}
          </Grid>}
          {games && isArenas && <Grid item justify="center" xs={9}><List>{games.map((g) => {
            const arena = arenas.find(a => a.arena_id === g.arena_id);
            const arenaName = arena && arena.name.length > 3 ? arena.name.split('-').slice(-1)[0].trim() : null;
            return <Typography>{arenaName ? <i style={{color: 'grey'}}>{`[${arenaName}] `}</i>: <></>}{g.players.map((p) => {return {ifpaId: p.ifpa_id, name: p.name, claimedBy: p.claimed_by, points: getFixedPoints(g.results.find((r) => r.player_id === p.player_id))}}).map((t) => <Player info={t} />)}<a href={`https://matchplay.events/live/${tournament.url_label}/matches?round_id=${g.roundId}`} target="_blank"><ChevronRight style={{fontSize: '14px'}}/></a></Typography>;
          })}</List></Grid>}
        </Grid>
        <Divider style={{margin: '0 0 15px 0'}}/>
      </div>
    );
        };

  const StandingsLoader = handleViewport(Standings);

  const Tournament = ({tournament, tournamentId, ifpaId, claimedBy, playerClicked}) => {
    const classes = useStyles();

    const [showPlayerList, setShowPlayerList] = useState(null);
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const [standingsInfo, setStandingsInfo] = useState(null);
    const [results, setResults] = useState(null);
    const [resultsProgress, setResultsProgress] = useState(null);

    useEffect(() => {
      if (!tournamentId) {
        return;
      }
      fetchTournament();
      fetchStandings();
      fetchTournamentResults();

      const interval = setInterval(function(){ 
        fetchStandings();
        fetchTournamentResults();
      }, 30000);

      return () => {
        clearInterval(interval);
      }
    }, []); 

    const fetchTournament = (() => {
      fetch(`https://matchplay.events/data/tournaments/${tournamentId}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setTournamentInfo(json)
        }).catch(e => {
          // do nothing
        })
      return;  
    });  

    const fetchTournamentResults = (() => {
      setResultsProgress(true);
      fetch(`https://matchplay.events/data/tournaments/${tournamentId}/results`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setResults(json)
          setResultsProgress(false);
        }).catch(e => {
          // do nothing
          setResultsProgress(false);
        })
      return;  
    }); 

    const fetchStandings = (() => {
      fetch(`https://matchplay.events/data/tournaments/${tournamentId}/standings`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setStandingsInfo(json);
        }).catch(e => {
          // do nothing
        })
      return;  
    });

    function pin() {
      localStorage.setItem('pin:tournament', tournament.tournament_id);
      window.location.reload(false);
    }

    function unpin() {
      localStorage.removeItem('pin:tournament');
      window.location.reload(false);
    }

    const TournamentInfo = () => {
      if (!tournamentInfo) {
        return null;
      }
      return <Grid container spacing={1}>
          {tournamentInfo.players && <Grid xs={4} spacing={3}>
            <List disablePadding>
            {tournamentInfo.players.map((p) => {
                return <>
                  <ListItem><div className={p.claimed_by || p.ifpa_id ? classes.underline : null} onClick={() => playerClicked(p)}>{p.name}</div></ListItem>
                  <div style={{display: 'flex', marginLeft: '35px', fontSize: '12px', color: 'gray'}}><span>{p.ifpa_id ? `IFPA #${p.ifpa_id}` : <span style={{color: 'orange'}}>No IFPA#</span>}</span><span>{` / `}</span><span>{p.claimed_by ? `MatchPlay #${p.claimed_by}` : <span style={{color: 'orange'}}>No MatchPlay#</span>}</span></div>
                </>
            })}  
            </List>
          </Grid>}
          {tournamentInfo.arenas && <Grid item xs={4} spacing={3}>
            {tournamentInfo.arenas.map((a) => {
                return <div style={{display: 'flex'}}>{a.name}</div>
            })}  
          </Grid>}
          {standingsInfo && <Grid item xs={4} spacing={3}>
            <List disablePadding>
            {standingsInfo.map((s) => {
                return <ListItem><Grid container><Grid style={{position: 'relative'}} item xs={1} spacing={3}><div style={{position: 'absolute', marginRight: '5px', right: 0}}>{`${s.position}.`}</div></Grid><Grid item xs={8} spacing={3}><span>{`${s.name}`}</span></Grid><Grid item xs={3} spacing={3}>{s.points !== null && s.points !== undefined && <span style={{fontSize: '12px'}}>{`Points: ${s.points}`}</span>}</Grid></Grid></ListItem>
            })}  
            </List>
          </Grid>}
      </Grid>
    }

    const Player = ({info}) => {
      return ifpaId === info.ifpaId || info.claimedBy === claimedBy ? 
      <b style={{padding: '0 2px'}}>{`${info.name} ${info.points}`}</b> :
      <span onClick={() => playerClicked(info)} className={info.claimedBy || info.ifpaId ? classes.underline : null} style={{padding: '0 2px'}}>{`${info.name} ${info.points}`}</span>;
    }

    return tournamentId ? <div>{tournamentInfo && <ListItem><div style={{width: '100%', display: 'flex', alignItems: 'center'}}><Close onClick={unpin} className={classes.underline} style={{color: 'red', fontSize: '20px', marginTop: '-2px', marginRight: '2px'}} /><a target="_blank" href={`https://matchplay.events/live/${tournamentInfo.url_label}`}><House style={{paddingTop: '1px', marginRight: '5px'}} /></a><div style={{width: '100%'}}>{` ${tournamentInfo.name} (${tournamentInfo.type})`}</div></div>
      </ListItem>}<Divider style={{margin: '5px'}}/>
      <div style={{margin: '15px 0px'}}>
        {tournamentInfo && results && <div style={{padding: '15px 0px'}}><span>{resultsProgress && <CircularProgress size={10}/>}<span>{`Round: ${results.length}`}</span>{resultsProgress && <CircularProgress size={10}/>}</span></div>}
        {tournamentInfo && results && results[results.length-1] && results[results.length-1] && results[results.length-1].games.map((g) => {
            const arena = tournamentInfo.arenas.find(a => a.arena_id === g.arena_id);
            return <Typography>{arena && arena.name ? <i style={{color: 'grey'}}>{`[${arena.name}] `}</i>: <></>}{g.players.map((p) => {return {ifpaId: p.ifpa_id, name: p.name, claimedBy: p.claimed_by, points: getFixedPoints(g.results.find((r) => r.player_id === p.player_id))}}).map((t) => <Player info={t} />)}<a href={`https://matchplay.events/live/${tournamentInfo.url_label}/matches?round_id=${g.roundId}`} target="_blank"><ChevronRight style={{fontSize: '14px'}}/></a></Typography>;
        })} 
      </div>
      <Divider style={{margin: '5px'}}/>
      <TournamentInfo/>
      </div> 
      : 
      <><ListItem>
      <div style={{width: '100%', display: 'flex', alignItems: 'center'}}><FilterTiltShift onClick={pin} className={classes.underline} style={{color: 'gray', fontSize: '20px', marginTop: '-2px', marginRight: '2px'}} /><a target="_blank" href={`https://matchplay.events/live/${tournament.url_label}`}><House style={{paddingTop: '1px', marginRight: '5px'}} /></a><div style={{width: '100%'}}>{` ${tournament.name} (${tournament.type})`}</div></div>
        <span onClick={() => setShowPlayerList(!showPlayerList)} style={{cursor: 'pointer', fontSize: '14px', color: 'lightskyblue', whiteSpace: 'nowrap'}}>{`Tournament Info `}{showPlayerList ? <ExpandMore style={{fontSize: '14px'}}/> : <ExpandLess style={{fontSize: '14px'}}/>}</span>
      </ListItem>
      {tournamentInfo && <><Divider style={{margin: '5px'}}/>
        <span style={{padding: '5px', color: 'green'}}>{tournamentInfo.status}</span></>}
      {(tournamentInfo || standingsInfo) && showPlayerList && <div style={{margin: '10px'}}><Divider/><Grid style={{marginBottom: '10px'}} container spacing={1}>
          {tournamentInfo.players && <Grid xs={4} spacing={3}>
            <List disablePadding>
            {tournamentInfo.players.map((p) => {
                return <>
                  <ListItem><div className={p.claimed_by || p.ifpa_Id ? classes.underline : null} onClick={() => playerClicked(p)}>{p.name}</div></ListItem>
                  <div style={{display: 'flex', marginLeft: '35px', fontSize: '12px', color: 'gray'}}><span>{p.ifpa_id ? `IFPA #${p.ifpa_id}` : <span style={{color: 'orange'}}>No IFPA#</span>}</span><span>{` / `}</span><span>{p.claimed_by ? `MatchPlay #${p.claimed_by}` : <span style={{color: 'orange'}}>No MatchPlay#</span>}</span></div>
                </>
            })}  
            </List>
          </Grid>}
          {tournamentInfo.arenas && <Grid item xs={4} spacing={3}>
            {tournamentInfo.arenas.map((a) => {
                return <div style={{display: 'flex'}}>{a.name}</div>
            })}  
          </Grid>}
          {standingsInfo && <Grid item xs={4} spacing={3}>
            <List disablePadding>
            {standingsInfo.map((s) => {
                return <ListItem><Grid container><Grid style={{position: 'relative'}} item xs={1} spacing={3}><div style={{position: 'absolute', marginRight: '5px', right: 0}}>{`${s.position}.`}</div></Grid><Grid item xs={8} spacing={3}><span>{`${s.name}`}</span></Grid><Grid item xs={3} spacing={3}><span style={{fontSize: '12px'}}>{`Points: ${s.points}`}</span></Grid></Grid></ListItem>
            })}  
            </List>
          </Grid>}
      </Grid><Divider/><div style={{fontSize: '12px', margin: '15px 0', display: 'flex', color: 'lightblue'}}>Selected Player Results:</div></div>}
      <StandingsLoader tournament={tournament} ifpaId={ifpaId} claimedBy={claimedBy} playerClicked={playerClicked} tournamentInfo={setTournamentInfo} standingsInfo={setStandingsInfo}/>
    </>;
  }

export default Tournament;
