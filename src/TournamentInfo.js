import React from 'react';
import './App.css';
import { Divider, List, ListItem, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    underline: {
      cursor: 'pointer',
      '&:hover': {
        'text-decoration': 'underline'
      }
    }
  });


const TournamentInfo = ({tournamentInfo, standingsInfo, playerClicked, playerSelect, showPlayerList}) => {
    const classes = useStyles();

    return <>
      {(tournamentInfo || tournamentInfo) && showPlayerList && <div style={{margin: '10px'}}><Grid style={{marginBottom: '10px'}} container spacing={1}>
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
                return <ListItem><Grid container style={{cursor: 'pointer'}} onClick={() => playerSelect(s)}><Grid style={{position: 'relative'}} item xs={1} spacing={3}><div style={{position: 'absolute', marginRight: '5px', right: 0}}>{`${s.position}.`}</div></Grid><Grid item xs={8} spacing={3}><span>{`${s.name}`}</span></Grid>{s.points !== null && s.points !== undefined && <Grid item xs={3} spacing={3}><span style={{fontSize: '12px'}}>{`Points: ${s.points}`}</span></Grid>}</Grid></ListItem>
            })}
            </List>
          </Grid>}
      </Grid><Divider/><div style={{fontSize: '16px', margin: '15px 0', display: 'flex', color: 'lightblue'}}>Selected Player Results:</div></div>}
    </>;
  }

export default TournamentInfo;
