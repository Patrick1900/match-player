import React, { useEffect, useState } from 'react';
import './App.css';
import { List, ListItemText, ListItem, ListItemIcon, Link, Card, Typography, Divider, LinearProgress, Grid, Button } from '@material-ui/core';
import House from '@material-ui/icons/House';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FilterTiltShift from '@material-ui/icons/FilterTiltShift';
import handleViewport from 'react-in-viewport';
import TournamentInfo from './TournamentInfo.js';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HighlightOff from '@material-ui/icons/HighlightOff';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Highlight from '@material-ui/icons/Highlight';
import ShowChart from '@material-ui/icons/ShowChart';
import YoutubeSearchedFor from '@material-ui/icons/YoutubeSearchedFor';
import { makeStyles } from '@material-ui/core/styles';
import StandaloneTournament from './StandaloneTournament';

const useStyles = makeStyles({
  underline: {
    cursor: 'pointer',
    '&:hover': {
      'text-decoration': 'underline'
    }
  },
  points: {
    marginTop: '2px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'white',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '20px',
    opacity: '0.5'
  }
});

function getFixedPoints(val) {
  if (!val || !val.points) {
    return 0;
  }

  return Number(val.points).toFixed();
}

const Standings = ({ analyse, analyseData, inViewport, forwardedRef, tournament, playerId, ifpaId, claimedBy, playerCompare, playerSelect, playerClicked, resetPlayer, tournamentInfo, standingsInfo }) => {
    const classes = useStyles();

    const [load, setLoad] = useState(false);
    const [message, setMessage] = useState(null);
    const [games, setGames] = useState(null);
    const [winLostList, setWinLostList] = useState(null);
    const [standing, setStanding] = useState(null);
    const [tournamentStanding, setTournamentStanding] = useState(null);
    const [tournamentResults, setTournamentResults] = useState(null);
    const [totalParticipants, setTotalParticipants] = useState(null);
    const [wonBy, setWonBy] = useState(null);
    const [progress, isProgress] = useState(true);
    const [arenas, setArenas] = useState([]);
    const [isArenas, setIsArenas] = useState(false);
    const [isGroup, setIsGroup] = useState(false);

    const fetchTournament = (() => {
      setArenas([]);
      setIsArenas(false)
      return fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setArenas(json.arenas);
          tournamentInfo(json)
          setIsGroup(json.type.search('group') > -1)
          setIsArenas(true)
        }).catch(e => {
          setIsArenas(true)
        });
    });

    const fetchTournamentResults = (() => {
      setGames(null);
      setWinLostList(null);
      return fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}/results`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setTournamentResults(json);
          getPlayerResults(json);
          isProgress(false);
        }).catch(e => {
          isProgress(false);
          setMessage(`Results for the tournament id:${tournament.tournament_id} not loaded: ${e}`);
        })
    });

    const fetchStandings = (() => {
      setStanding(null);
      setTotalParticipants(null)
      return fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}/standings`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          setTournamentStanding(json)
          setTotalParticipants(json.length)
          setWonBy(json.find((j) => j.position === 1))
          setStanding(json.find((j) => j.claimed_by === claimedBy));
          standingsInfo(json);
        }).catch(e => {
          // do nothing
        })
    });

    function loadData() {
      setMessage(null);
      isProgress(true);
      try {
        return Promise.all([fetchTournament(),
        fetchStandings(),
        fetchTournamentResults()]);
      } catch {
        isProgress(false);
      }
    }

    useEffect(() => {
      if (!analyse) {
        return;
      }
      if (load) {
        analyseData(tournament.tournament_id, {winLostList, arenas, games, standing, tournamentResults, tournamentStanding, tournament})
        return;
      }

      // >>>>>>>>>>>>>> ANALYSE LOAD
      loadData();
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>
    }, [analyse]);

    useEffect(() => {
      if (!analyse) {
        return;
      }
      if (!winLostList || !tournamentStanding) {
        return;
      }

      if (playerId && claimedBy !== playerId) {
        return;
      }

      analyseData(tournament.tournament_id, {winLostList, tournamentStanding});
    }, [winLostList, tournamentStanding]);

    useEffect(() => {
      if (!load) {
        return;
      }
      loadData();
    }, [load]);

    useEffect(() => {
      if (!load) {
        return;
      }

      if (playerId) {
        setStanding(tournamentStanding.find((j) => j.player_id === playerId));
      } else {
        setStanding(tournamentStanding.find((j) => j.claimed_by === claimedBy));
      }
      getPlayerResults(tournamentResults)
    }, [playerId]);

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

    function getPlayerResults(json) {
      const selectedPlayerGames = json.map((j) => { const games = j.games.map(g => { g['roundId'] = j.round_id; return g;}); return j.games; } ).flat().filter((g) => g.players.some((p) => (playerId ? p.player_id === playerId :  p.ifpa_id === ifpaId || p.claimed_by === claimedBy)));
      setGames(selectedPlayerGames);

      if (selectedPlayerGames) {
        const winLostList = selectedPlayerGames.map((g) => {
          const player = g.players.find(p => playerId ? p.player_id === playerId : p.ifpa_id === ifpaId || p.claimed_by === claimedBy);
          if (!player) {
            return;
          }
          const inPlayerId = player.player_id;
          const results =  Object.assign(g.results).sort((a,b) => Number(a.points) - Number(b.points));
          if (!results || !results.length) {
            return;
          }
          return results[results.length -1].player_id === inPlayerId ? {
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
    }

    const Player = ({info, results}) => {
      const index = (results.findIndex(r => {
        return r.player_id === info.playerId;
      }))
      const color = (index === 0 || Number(info.points) === 0) ? 'Silver' : (index === results.length -1 ? 'Green' : (index === results.length - 2 ? 'LimeGreen' : 'LightSlateGray'));
      return <Grid item container xs={12}>
        {ifpaId === info.ifpaId || info.claimedBy === claimedBy ?
        <Grid item xs={10}>
          <Typography style={{fontWeight: 'bold'}}>{`${info.name}`}</Typography>
        </Grid> : playerId && info.playerId === playerId ? <Grid item xs={10}>
            <Typography onClick={() => playerClicked(info)}  className={info.claimedBy || info.ifpaId ? classes.underline : null} style={{color: 'DarkBlue', fontWeight: '800'}}>{`${info.name}`}</Typography>
          </Grid> : <Grid item xs={10}>
                <Typography style={{cursor: 'pointer'}}><span onClick={() => playerSelect(info)} >{`${info.name}`}</span><Highlight style={{marginTop: '2px'}} onClick={() => {playerCompare(info)}} style={{fontSize: '16px', color: 'lightgray'}}/></Typography>
          </Grid>}
          <Grid item style={{display: 'flex', alignItems:'flex-start'}}>
            <Typography style={{background: color}} className={classes.points}>{`${info.points}`}</Typography>
        </Grid>
      </Grid>
    }

    const Game = ({game}) => {
        const players = game.players.sort((a,b) => Number(a.game.index) - Number(b.game.index));
        const results = game.results.sort((a,b) => Number(a.points) - Number(b.points));
        const arena = arenas.find(a => a.arena_id === game.arena_id);
        const arenaName = arena && Number(arena.name) !== isNaN ? arena.name.split('-').slice(-1)[0].trim() : null;

        return <>
            <Grid item><a href={`https://matchplay.events/live/${tournament.url_label}/matches?round_id=${game.roundId}`} target="_blank"><AssignmentIcon style={{fontSize: '16px', color: 'lightgray'}}/></a></Grid>
            {arenaName && <Grid item xs={3} wrap='nowrap'><a style={{textDecoration: 'none'}} href={`https://pinballvideos.com/m/${arenaName.split(' ').join('-').toLowerCase()}`} target="_blank"><i style={{cursor: 'pointer', color: 'grey'}}>{`[${arenaName}] `}</i></a></Grid>}
            {players.length > 1 && players.map((p) => {return {playerId: p.player_id, ifpaId: p.ifpa_id, name: p.name, claimedBy: p.claimed_by, points: getFixedPoints(game.results.find((r) => r.player_id === p.player_id))}}).map((t) => <Grid item xs={3}><Player info={t} results={results}/></Grid>)}
            {players.length === 3 && <Grid item xs={3}/>}
            {isGroup && players.length === 2 && <><Grid item xs={3}/><Grid item xs={3}/></>}
            {players.length === 1 && <Grid item><div><i style={{opacity: '0.9', color: 'lightgreen'}}>[Player with a bye]</i></div></Grid>}
            {players.length > 1 && <Grid item>
                    {players.length > 1 && <Grid item><a href={`https://tools.flipperliste.at/ifpa_player_statistics/?players%5B%5D=${players.map(p => p.name.replace(/ /gi, '+')).join('&players%5B%5D=')}`} target="_blank"><ShowChart style={{fontSize: '16px', color: 'lightgray'}}/></a></Grid>}
            </Grid>}
        </>;
    }

    return (
      <div ref={forwardedRef}>
        {progress && <LinearProgress style={{margin: '16px 0'}}/>}
        <Grid container wrap="nowrap" spacing={2} direction='column'>
          {message && <Grid item><span style={{margin:'8px', color: 'orange'}}>{message}</span><Button onClick={() => loadData()}variant="outlined" color="primary">Reload</Button></Grid>}
          {games && standing && <Divider/>}
          {games && standing && <Grid item spacing={1} container style={{margin:'0 8px 0 8px', opacity: '0.6'}}>
              <Grid item xs={2}>
                {playerId && <Grid item container wrap='nowrap'><Typography onClick={() => playerClicked(standing)} className={standing.claimed_by ? classes.underline : null} style={{color: 'DarkBlue', fontWeight: '800'}}>{standing.name}</Typography><HighlightOff style={{cursor: 'pointer', marginLeft: '4px'}} onClick={resetPlayer}/></Grid>}
                <Typography>{`Position: `}<b>{standing.position}</b></Typography>
                {standing.points !== null && standing.points !== undefined && <Typography>{`Points: ${standing.points}`}</Typography>}
              </Grid>
              <Grid item xs={3}>
                {games.length > 0 && winLostList && <Typography>{`Games played: `}<b>{standing.byes ? games.length - standing.byes : games.length}</b>{` (`}<b style={{color:'green'}}>{standing.byes ? winLostList.won.length - standing.byes : winLostList.won.length}</b>{`/`}<b style={{color:'red'}}>{winLostList.lost.length}</b>{`)`}</Typography>}
                {standing.byes !== null && standing.byes !== undefined && standing.byes > 0 && <Typography>{`Byes: ${standing.byes}`}</Typography>}
              </Grid>
              <Grid item xs={3}>
                <Typography>{`Number of Players: ${totalParticipants}`}</Typography>
              </Grid>
              <Grid item xs={4}>
                {wonBy && <Typography onClick={() => playerSelect(wonBy)} style={{cursor:'pointer'}}>{`Lead: ${wonBy.name}`}</Typography>}
                {wonBy && !wonBy.claimed_by && <i style={{fontSize: '12px', color: 'lightgrey'}}>Player without MatchPlayId</i>}
              </Grid>
          </Grid>}
          <Divider/>
          {games && isArenas && <Grid item><Grid style={{margin:'8px 8px 0 8px'}} spacing={1} container direction='column'>{games.map((g) => {
            return <Grid wrap='nowrap' item container spacing={2} xs='12'><Game game={g}/></Grid>;
          })}</Grid></Grid>}
        </Grid>
        <Divider style={{margin: '0 0 15px 0', opacity: '0'}}/>
      </div>
    );
};

  const StandingsLoader = handleViewport(Standings);

  const Tournament = ({analyse, analyseData, tournament, standalone, tournamentId, ifpaId, claimedBy, playerCompare, playerClicked }) => {
    const classes = useStyles();

    const [showPlayerList, setShowPlayerList] = useState(null);
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const [standingsInfo, setStandingsInfo] = useState(null);
    const [results, setResults] = useState(null);
    const [resultsProgress, setResultsProgress] = useState(null);

    const [playerId, setPlayerId] = useState(null);

    useEffect(() => {
      if (!tournamentId) {
        return;
      }
      fetchTournament();
      fetchStandings();
      fetchTournamentResults();
    }, []);

    useEffect(() => {
      if (!tournamentId) {
        return;
      }

      if (!tournamentInfo) {
        return;
      }

      if (tournamentInfo.status === 'completed') {
        return;
      }

      if ((new Date(tournamentInfo.start).setHours(0,0,0,0) !== new Date().setHours(0,0,0,0))) {
        return;
      }

      const interval = setInterval(function(){
        fetchStandings();
        fetchTournamentResults();
        if (tournamentInfo.status === 'completed') {
          clearInterval(interval);
          return;
        }
      }, 20000);

      return () => {
        clearInterval(interval);
      }
    }, [tournamentInfo]);

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
      window.location.href = `${window.location.origin}/user/${claimedBy}/tour/${tournament.tournament_id}`;
    }

    function unpin() {
      localStorage.removeItem('pin:tournament');
      window.location.href = `${window.location.origin}/user/${claimedBy}`;
    }

    function onPlayerSelect(player) {
      setPlayerId(player.claimedBy === claimedBy ? null : player.player_id || player.playerId);
    }

    function onResetPlayer() {
      setPlayerId(null);
    }

    function onTournamentRefresh() {
      fetchStandings();
      fetchTournamentResults();
    }

    function onClickYoutubeSearch(tour) {
      window.open(`https://www.youtube.com/results?search_query=${tour.replace(/ /gi, '+')}`, "_blank")
    }

    const Header = ({standalone}) => {
        if (!Boolean(tournament || tournamentInfo)) {
          return null;
        }
        const tour = tournament === undefined || tournament === null ? tournamentInfo : tournament;

        return <Grid wrap='nowrap' container spacing={2} justify='space-between'>
            <Grid item>
                <List>
                    <ListItem style={{margin: '0', padding: '0 8px'}}>
                        <ListItemIcon style={{minWidth: '0', marginRight: '8px'}}>
                          {!standalone ? <FilterTiltShift onClick={pin} className={classes.underline} style={{color: 'gray', fontSize: '20px'}} /> : <HighlightOff onClick={unpin} className={classes.underline} style={{color: 'orange', fontSize: '20px'}} />}
                        </ListItemIcon>
                        <ListItemIcon style={{minWidth: '0', marginRight: '8px'}}>
                            <Link target="_blank" href={`https://matchplay.events/live/${tour.url_label}`}><House/></Link>
                        </ListItemIcon>
                        <ListItemText style={{lineHeight: '1'}} primary={<Grid container spacing={1}><Grid item><Typography>{tour.name}</Typography></Grid><Grid item><YoutubeSearchedFor onClick={() => onClickYoutubeSearch(tour.name)} style={{cursor: 'pointer', color: 'grey', fontSize: '20px', opacity: '0.5'}}/></Grid></Grid>} secondary={
                            <Typography style={{fontSize: '10px'}}>{`${tour.type}`} &#9679; {`${new Date(tour.start).toLocaleDateString()}`} &#9679; {`${tour.status}`}</Typography>}/>
                    </ListItem>
                </List>
            </Grid>
            <Grid item style={{alignItems: 'flex-end', display: 'flex'}}>
                <Typography onClick={() => setShowPlayerList(!showPlayerList)} style={{cursor: 'pointer', fontSize: '14px', color: 'lightskyblue', whiteSpace: 'nowrap'}}>{`Tournament Info `}{showPlayerList ? <ExpandMore style={{fontSize: '14px'}}/> : <ExpandLess style={{fontSize: '14px'}}/>}</Typography>
            </Grid>
        </Grid>
    }

    return !standalone ? <Card style={{margin: '16px 0 8px 0'}}>
          <Header/>
          <TournamentInfo tournamentInfo={tournamentInfo} standingsInfo={standingsInfo} playerClicked={playerClicked} playerSelect={onPlayerSelect} showPlayerList={showPlayerList}/>
          <StandingsLoader key={`SL${tournament.tournament_id}`} analyse={analyse} analyseData={analyseData} tournament={tournament} playerId={playerId} ifpaId={ifpaId} claimedBy={claimedBy} playerCompare={playerCompare} playerClicked={playerClicked} resetPlayer={onResetPlayer} playerSelect={onPlayerSelect} tournamentInfo={setTournamentInfo} standingsInfo={setStandingsInfo} />
        </Card> : <><Card style={{margin: '16px 0 8px 0'}}>
          <Header standalone results={results}/>
          <TournamentInfo tournamentInfo={tournamentInfo} standingsInfo={standingsInfo} playerClicked={playerClicked} playerSelect={onPlayerSelect} showPlayerList={showPlayerList}/>
        </Card>
        <StandaloneTournament refresh={onTournamentRefresh} ifpaId={ifpaId} claimedBy={claimedBy} playerClicked={playerClicked} results={results} playerSelect={onPlayerSelect} info={tournamentInfo} standingsInfo={standingsInfo}/>
        </>;
  }

export default Tournament;
