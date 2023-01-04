import React, {useEffect, useState} from 'react';
import {
	Card,
	Grid,
	Link,
	List,
	ListItem,
	ListItemIcon,
	ListItemText, Typography
} from '@material-ui/core';
import House from '@material-ui/icons/House';
import YoutubeSearchedFor from '@material-ui/icons/YoutubeSearchedFor';
import AssignmentIcon from '@material-ui/icons/Assignment';

const PlayerCompare = ({ tournament, tournamentId, player, opponentPlayerName }) => {
	const [results, setResults] = useState(null);
	const [games, setGames] = useState([]);
	const [arenas, setArenas] = useState([]);

	function getPlayerResults(json) {
		const all = json.map((j) => { const games = j.games.map(g => { g['roundId'] = j.round_id; return g;}); return j.games; } ).flat();
		const selectedGames = all.filter((g) => {
			return g.players.some((p) => {
				return (p.claimed_by === player.user_id)
			} ) && g.players.some((p) => {
				return (p.name === opponentPlayerName)
			} )
		});
		setGames(selectedGames);
	}

	const fetchTournamentResults = (() => {
		fetch(`https://matchplay.events/data/tournaments/${tournamentId}/results`)
		.then(response => {
			return response.json();
		})
		.then(json => {
			setResults(json)
		}).catch(e => {
			// do nothing
		})
		return;
	});

	const fetchTournament = (() => {
		return fetch(`https://matchplay.events/data/tournaments/${tournament.tournament_id}`)
		.then(response => {
			return response.json();
		})
		.then(json => {
			setArenas(json.arenas);
		}).catch(e => {
			// do nothing
		});
		return;
	});

	useEffect(() => {
		if (!tournamentId) {
			return;
		}
		fetchTournament();
	}, []);

	useEffect(() => {
		if (!arenas) {
			return;
		}
		fetchTournamentResults();
	}, [arenas]);

	useEffect(() => {
		if (!results) {
			return;
		}
		getPlayerResults(results);
	}, [results]);

	function onClickYoutubeSearch(tour) {
		window.open(`https://www.youtube.com/results?search_query=${tour.replace(/ /gi, '+')}`, "_blank")
	}

	if (!games.length) {
		return null;
	}

	return <Card style={{marginTop: '16px', padding: '8px'}}><Grid container direction="column">
		<Grid xs={12} item>
			<List>
				<ListItem style={{margin: '0', padding: '0 8px'}}>
					<ListItemIcon style={{minWidth: '0', marginRight: '8px'}}>
						<Link target="_blank" href={`https://matchplay.events/live/${tournament.url_label}`}><House/></Link>
					</ListItemIcon>
					<ListItemText style={{lineHeight: '1'}} primary={<Grid container spacing={1}><Grid item><Typography>{tournament.name}</Typography></Grid><Grid item><YoutubeSearchedFor onClick={() => onClickYoutubeSearch(tournament.name)} style={{cursor: 'pointer', color: 'grey', fontSize: '20px', opacity: '0.5'}}/></Grid></Grid>} secondary={
						<Typography style={{fontSize: '10px'}}>{`${tournament.type}`} &#9679; {`${new Date(tournament.start).toLocaleDateString()}`} &#9679; {`${tournament.status}`}</Typography>}/>
				</ListItem>
			</List>
		</Grid>
		<Grid xs={12} item container spacing={2} direction="column" style={{marginLeft: '15px'}}>
			{games.map((g) => {
				const arena = arenas.find((a) => a.arena_id === g.arena_id);
				return <Grid xs={12} item container spacing={3} wrap="nowrap">
					<Grid xs={1} item>
						<a href={`https://matchplay.events/live/${tournament.url_label}/matches?round_id=${g.roundId}`} target="_blank"><AssignmentIcon style={{fontSize: '16px', color: 'lightgray'}}/></a>
					</Grid>
					{arena && arena.name && <Grid item xs={3} wrap='nowrap'>
						<a style={{textDecoration: 'none'}} href={`https://pinballvideos.com/m/${arena.name.split(' ').join('-').toLowerCase()}`} target="_blank"><i style={{cursor: 'pointer', color: 'grey'}}>{`[${arena.name}] `}</i></a>
					</Grid>}
					{g.players.map((p) => {
						const res = g.results.find((r) => r.player_id === p.player_id);
						return <Grid item xs={8} item container spacing={1}>
							<Grid item>{p.name}</Grid>
							<Grid item>{res ? res.points : '-'}</Grid>
						</Grid>
					})}
				</Grid>
			})}
		</Grid>
	</Grid></Card>
}

export default PlayerCompare;
