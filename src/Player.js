import React, { useEffect, useState, useRef } from 'react';
import { Fade, CircularProgress, CardContent, Card, Link, Container, Box, Grow, Grid, Button, Input, InputLabel, FormControl, Typography, InputAdornment } from '@material-ui/core';
import ShowChart from '@material-ui/icons/ShowChart';
import Theaters from '@material-ui/icons/Theaters';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import Tournament from './Tournament.js';
import Refresh from '@material-ui/icons/Refresh';
import { VictoryGroup, VictoryChart, VictoryAxis, VictoryStack, VictoryBar, VictoryTheme } from "victory";
import GetAppIcon from '@material-ui/icons/GetApp';

import { makeStyles } from '@material-ui/core/styles';
import PlayerCompare from './PlayerCompare';

const useStyles = makeStyles({
  zoom: {
    '&:hover': {
      'zoom': '2'
    }
  }
});

function getFlag(code){
  code = code.toUpperCase();
  if(code == 'AD') return '🇦🇩';
  if(code == 'AE') return '🇦🇪';
  if(code == 'AF') return '🇦🇫';
  if(code == 'AG') return '🇦🇬';
  if(code == 'AI') return '🇦🇮';
  if(code == 'AL') return '🇦🇱';
  if(code == 'AM') return '🇦🇲';
  if(code == 'AO') return '🇦🇴';
  if(code == 'AQ') return '🇦🇶';
  if(code == 'AR') return '🇦🇷';
  if(code == 'AS') return '🇦🇸';
  if(code == 'AT') return '🇦🇹';
  if(code == 'AU') return '🇦🇺';
  if(code == 'AW') return '🇦🇼';
  if(code == 'AX') return '🇦🇽';
  if(code == 'AZ') return '🇦🇿';
  if(code == 'BA') return '🇧🇦';
  if(code == 'BB') return '🇧🇧';
  if(code == 'BD') return '🇧🇩';
  if(code == 'BE') return '🇧🇪';
  if(code == 'BF') return '🇧🇫';
  if(code == 'BG') return '🇧🇬';
  if(code == 'BH') return '🇧🇭';
  if(code == 'BI') return '🇧🇮';
  if(code == 'BJ') return '🇧🇯';
  if(code == 'BL') return '🇧🇱';
  if(code == 'BM') return '🇧🇲';
  if(code == 'BN') return '🇧🇳';
  if(code == 'BO') return '🇧🇴';
  if(code == 'BQ') return '🇧🇶';
  if(code == 'BR') return '🇧🇷';
  if(code == 'BS') return '🇧🇸';
  if(code == 'BT') return '🇧🇹';
  if(code == 'BV') return '🇧🇻';
  if(code == 'BW') return '🇧🇼';
  if(code == 'BY') return '🇧🇾';
  if(code == 'BZ') return '🇧🇿';
  if(code == 'CA') return '🇨🇦';
  if(code == 'CC') return '🇨🇨';
  if(code == 'CD') return '🇨🇩';
  if(code == 'CF') return '🇨🇫';
  if(code == 'CG') return '🇨🇬';
  if(code == 'CH') return '🇨🇭';
  if(code == 'CI') return '🇨🇮';
  if(code == 'CK') return '🇨🇰';
  if(code == 'CL') return '🇨🇱';
  if(code == 'CM') return '🇨🇲';
  if(code == 'CN') return '🇨🇳';
  if(code == 'CO') return '🇨🇴';
  if(code == 'CR') return '🇨🇷';
  if(code == 'CU') return '🇨🇺';
  if(code == 'CV') return '🇨🇻';
  if(code == 'CW') return '🇨🇼';
  if(code == 'CX') return '🇨🇽';
  if(code == 'CY') return '🇨🇾';
  if(code == 'CZ') return '🇨🇿';
  if(code == 'DE') return '🇩🇪';
  if(code == 'DJ') return '🇩🇯';
  if(code == 'DK') return '🇩🇰';
  if(code == 'DM') return '🇩🇲';
  if(code == 'DO') return '🇩🇴';
  if(code == 'DZ') return '🇩🇿';
  if(code == 'EC') return '🇪🇨';
  if(code == 'EE') return '🇪🇪';
  if(code == 'EG') return '🇪🇬';
  if(code == 'EH') return '🇪🇭';
  if(code == 'ER') return '🇪🇷';
  if(code == 'ES') return '🇪🇸';
  if(code == 'ET') return '🇪🇹';
  if(code == 'FI') return '🇫🇮';
  if(code == 'FJ') return '🇫🇯';
  if(code == 'FK') return '🇫🇰';
  if(code == 'FM') return '🇫🇲';
  if(code == 'FO') return '🇫🇴';
  if(code == 'FR') return '🇫🇷';
  if(code == 'GA') return '🇬🇦';
  if(code == 'GB') return '🇬🇧';
  if(code == 'GD') return '🇬🇩';
  if(code == 'GE') return '🇬🇪';
  if(code == 'GF') return '🇬🇫';
  if(code == 'GG') return '🇬🇬';
  if(code == 'GH') return '🇬🇭';
  if(code == 'GI') return '🇬🇮';
  if(code == 'GL') return '🇬🇱';
  if(code == 'GM') return '🇬🇲';
  if(code == 'GN') return '🇬🇳';
  if(code == 'GP') return '🇬🇵';
  if(code == 'GQ') return '🇬🇶';
  if(code == 'GR') return '🇬🇷';
  if(code == 'GS') return '🇬🇸';
  if(code == 'GT') return '🇬🇹';
  if(code == 'GU') return '🇬🇺';
  if(code == 'GW') return '🇬🇼';
  if(code == 'GY') return '🇬🇾';
  if(code == 'HK') return '🇭🇰';
  if(code == 'HM') return '🇭🇲';
  if(code == 'HN') return '🇭🇳';
  if(code == 'HR') return '🇭🇷';
  if(code == 'HT') return '🇭🇹';
  if(code == 'HU') return '🇭🇺';
  if(code == 'ID') return '🇮🇩';
  if(code == 'IE') return '🇮🇪';
  if(code == 'IL') return '🇮🇱';
  if(code == 'IM') return '🇮🇲';
  if(code == 'IN') return '🇮🇳';
  if(code == 'IO') return '🇮🇴';
  if(code == 'IQ') return '🇮🇶';
  if(code == 'IR') return '🇮🇷';
  if(code == 'IS') return '🇮🇸';
  if(code == 'IT') return '🇮🇹';
  if(code == 'JE') return '🇯🇪';
  if(code == 'JM') return '🇯🇲';
  if(code == 'JO') return '🇯🇴';
  if(code == 'JP') return '🇯🇵';
  if(code == 'KE') return '🇰🇪';
  if(code == 'KG') return '🇰🇬';
  if(code == 'KH') return '🇰🇭';
  if(code == 'KI') return '🇰🇮';
  if(code == 'KM') return '🇰🇲';
  if(code == 'KN') return '🇰🇳';
  if(code == 'KP') return '🇰🇵';
  if(code == 'KR') return '🇰🇷';
  if(code == 'KW') return '🇰🇼';
  if(code == 'KY') return '🇰🇾';
  if(code == 'KZ') return '🇰🇿';
  if(code == 'LA') return '🇱🇦';
  if(code == 'LB') return '🇱🇧';
  if(code == 'LC') return '🇱🇨';
  if(code == 'LI') return '🇱🇮';
  if(code == 'LK') return '🇱🇰';
  if(code == 'LR') return '🇱🇷';
  if(code == 'LS') return '🇱🇸';
  if(code == 'LT') return '🇱🇹';
  if(code == 'LU') return '🇱🇺';
  if(code == 'LV') return '🇱🇻';
  if(code == 'LY') return '🇱🇾';
  if(code == 'MA') return '🇲🇦';
  if(code == 'MC') return '🇲🇨';
  if(code == 'MD') return '🇲🇩';
  if(code == 'ME') return '🇲🇪';
  if(code == 'MF') return '🇲🇫';
  if(code == 'MG') return '🇲🇬';
  if(code == 'MH') return '🇲🇭';
  if(code == 'MK') return '🇲🇰';
  if(code == 'ML') return '🇲🇱';
  if(code == 'MM') return '🇲🇲';
  if(code == 'MN') return '🇲🇳';
  if(code == 'MO') return '🇲🇴';
  if(code == 'MP') return '🇲🇵';
  if(code == 'MQ') return '🇲🇶';
  if(code == 'MR') return '🇲🇷';
  if(code == 'MS') return '🇲🇸';
  if(code == 'MT') return '🇲🇹';
  if(code == 'MU') return '🇲🇺';
  if(code == 'MV') return '🇲🇻';
  if(code == 'MW') return '🇲🇼';
  if(code == 'MX') return '🇲🇽';
  if(code == 'MY') return '🇲🇾';
  if(code == 'MZ') return '🇲🇿';
  if(code == 'NA') return '🇳🇦';
  if(code == 'NC') return '🇳🇨';
  if(code == 'NE') return '🇳🇪';
  if(code == 'NF') return '🇳🇫';
  if(code == 'NG') return '🇳🇬';
  if(code == 'NI') return '🇳🇮';
  if(code == 'NL') return '🇳🇱';
  if(code == 'NO') return '🇳🇴';
  if(code == 'NP') return '🇳🇵';
  if(code == 'NR') return '🇳🇷';
  if(code == 'NU') return '🇳🇺';
  if(code == 'NZ') return '🇳🇿';
  if(code == 'OM') return '🇴🇲';
  if(code == 'PA') return '🇵🇦';
  if(code == 'PE') return '🇵🇪';
  if(code == 'PF') return '🇵🇫';
  if(code == 'PG') return '🇵🇬';
  if(code == 'PH') return '🇵🇭';
  if(code == 'PK') return '🇵🇰';
  if(code == 'PL') return '🇵🇱';
  if(code == 'PM') return '🇵🇲';
  if(code == 'PN') return '🇵🇳';
  if(code == 'PR') return '🇵🇷';
  if(code == 'PS') return '🇵🇸';
  if(code == 'PT') return '🇵🇹';
  if(code == 'PW') return '🇵🇼';
  if(code == 'PY') return '🇵🇾';
  if(code == 'QA') return '🇶🇦';
  if(code == 'RE') return '🇷🇪';
  if(code == 'RO') return '🇷🇴';
  if(code == 'RS') return '🇷🇸';
  if(code == 'RU') return '🇷🇺';
  if(code == 'RW') return '🇷🇼';
  if(code == 'SA') return '🇸🇦';
  if(code == 'SB') return '🇸🇧';
  if(code == 'SC') return '🇸🇨';
  if(code == 'SD') return '🇸🇩';
  if(code == 'SE') return '🇸🇪';
  if(code == 'SG') return '🇸🇬';
  if(code == 'SH') return '🇸🇭';
  if(code == 'SI') return '🇸🇮';
  if(code == 'SJ') return '🇸🇯';
  if(code == 'SK') return '🇸🇰';
  if(code == 'SL') return '🇸🇱';
  if(code == 'SM') return '🇸🇲';
  if(code == 'SN') return '🇸🇳';
  if(code == 'SO') return '🇸🇴';
  if(code == 'SR') return '🇸🇷';
  if(code == 'SS') return '🇸🇸';
  if(code == 'ST') return '🇸🇹';
  if(code == 'SV') return '🇸🇻';
  if(code == 'SX') return '🇸🇽';
  if(code == 'SY') return '🇸🇾';
  if(code == 'SZ') return '🇸🇿';
  if(code == 'TC') return '🇹🇨';
  if(code == 'TD') return '🇹🇩';
  if(code == 'TF') return '🇹🇫';
  if(code == 'TG') return '🇹🇬';
  if(code == 'TH') return '🇹🇭';
  if(code == 'TJ') return '🇹🇯';
  if(code == 'TK') return '🇹🇰';
  if(code == 'TL') return '🇹🇱';
  if(code == 'TM') return '🇹🇲';
  if(code == 'TN') return '🇹🇳';
  if(code == 'TO') return '🇹🇴';
  if(code == 'TR') return '🇹🇷';
  if(code == 'TT') return '🇹🇹';
  if(code == 'TV') return '🇹🇻';
  if(code == 'TW') return '🇹🇼';
  if(code == 'TZ') return '🇹🇿';
  if(code == 'UA') return '🇺🇦';
  if(code == 'UG') return '🇺🇬';
  if(code == 'UM') return '🇺🇲';
  if(code == 'US') return '🇺🇸';
  if(code == 'UY') return '🇺🇾';
  if(code == 'UZ') return '🇺🇿';
  if(code == 'VA') return '🇻🇦';
  if(code == 'VC') return '🇻🇨';
  if(code == 'VE') return '🇻🇪';
  if(code == 'VG') return '🇻🇬';
  if(code == 'VI') return '🇻🇮';
  if(code == 'VN') return '🇻🇳';
  if(code == 'VU') return '🇻🇺';
  if(code == 'WF') return '🇼🇫';
  if(code == 'WS') return '🇼🇸';
  if(code == 'XK') return '🇽🇰';
  if(code == 'YE') return '🇾🇪';
  if(code == 'YT') return '🇾🇹';
  if(code == 'ZA') return '🇿🇦';
  if(code == 'ZM') return '🇿🇲';
  return '🏳';
}

const Player = ({player, tournamentId}) => {
  const [progress, isProgress] = useState(false);
  const [message, setMessage] = useState(null);
  const [tournaments, setTournaments] = useState(null);
  const [ifpaPlayer, setIfpaPlayer] = useState(null);
  const [countryRank, setCountryRank] = useState(null);
  const [analyse, setAnalyse] = useState(false);
  const [data, setData] = useState(null);
  const [showAnalyse, setShowAnalyse] = useState(true);
  const [storageAnalyse, setStorageAnalyse] = useState(false);
  const [headToHeadWin, setHeadToHeadWin] = useState(0)
  const [headToHeadLost, setHeadToHeadLost] = useState(0)
  const [playedAgainst, setPlayedAgainst] = useState([])
  const [playedAgainstTop10, setPlayedAgainstTop10] = useState([])

  const [groupPosition, setGroupPosition] = useState({})

  const [analyseTournaments, setAnalyseTournaments] = useState([]);
  const [analyseTournamentsCount, setAnalyseTournamentsCount] = useState(null);
  const [tournamentStanding, setTournamentStanding] = useState([]);

  const [compare, setCompare] = useState();

  function fetchTournaments() {
    const matchPlayId = player.claimed_by || player.user_id;
    setCountryRank(null);
    isProgress(true);
    fetch(`https://matchplay.events/data/users/${matchPlayId}/played`)
    .then(response => {
      if (!response.ok) {
        setMessage(`Tournaments for the player id:${matchPlayId} no found: ${response.status}`);
        return null;
      }
      return response.json();
    })
    .then(json => {
      isProgress(false);
      if (!json) {
        return;
      }
      setTournaments(json);
    }).catch(e => {
      isProgress(false);
      setMessage(`Unexpected Error on parsing Tournaments-Info for the player id:${matchPlayId}`);
    })
    return;
  };

  function fetchIfpaCountry() {
    const cc = ifpaPlayer.country_code;
    if (!cc) {
      return;
    }

    const d = new Date();
    const ds = `${d.getFullYear()}${d.getMonth()}${d.getDay()}`;
    const lsd = `cc:ranking:${cc.toLowerCase()}`;

    try {
      const r = localStorage.getItem(lsd);
      if (r) {
        const rex = JSON.parse(r);
        if (rex.d === ds) {
          const cr = rex.r.rankings.find(rank => Number(rank.player_id) === Number(ifpaPlayer.player_id))
          if (cr) {
            setCountryRank(cr.country_rank - 1);
          }
          return;
        }
      }
    } catch (e) {
      // do nothing
    }

    try {
      fetch(`https://api.ifpapinball.com/v2/rankings/country?country=${cc}&start_pos=1&count=500&api_key=ac0a98451d70551bbcd0a7ddce7acb6b`)
      .then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then(json => {
        if (!json) {
          return;
        }
        try {
          localStorage.setItem(lsd, JSON.stringify({
            d: ds,
            r: json
          }));
          const cr = json.rankings.find(rank => Number(rank.player_id) === Number(ifpaPlayer.player_id));
          if (cr) {
            setCountryRank(cr.country_rank - 1);
          }
        } catch (e) {
          // do nothing
        }
      })
      .catch(json => {
        // do nothing
      })
    } catch (e) {
      // do nothing
    }
  }

  function fetchIfpa() {

    const d = new Date();
    const ds = `${d.getFullYear()}${d.getMonth()}${d.getDay()}`;
    const lsd = `player:ifpa:${player.ifpa_id}`;

    try {
      const r = localStorage.getItem(lsd);
      if (r) {
        const rex = JSON.parse(r);
        if (rex.d === ds) {
          setIfpaPlayer(rex.p);
          return;
        }
      }
    } catch (e) {
      // do nothing
    }

    try {
      fetch(`https://api.ifpapinball.com/v2/player/${player.ifpa_id}?api_key=ac0a98451d70551bbcd0a7ddce7acb6b`)
      .then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then(json => {
        if (!json || !json.player || !json.player.length > 0) {
          return;
        }
        const p = json.player[0];
        setIfpaPlayer(p);
        localStorage.setItem(lsd, JSON.stringify({
          d: ds,
          p: p
        }));
      })
      .catch(json => {
        // do nothing
      })
    } catch (e) {
      // do nothing
    }
  }

  useEffect(() => {
    if (!ifpaPlayer) {
      return;
    }
    fetchIfpaCountry();
  }, [ifpaPlayer]);

  useEffect(() => {
    if (!data) {
      return;
    }
    console.warn('>>> data', data.length)
  }, [data]);

  useEffect(() => {
    if (analyseTournaments.length === 0) {
      return;
    }

    setAnalyseTournamentsCount(analyseTournaments.length);

    let against = [];
    // WIN LOST ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const winLost = analyseTournaments.reduce((a, b) => {
      if (!b.winLostList) {
        return a;
      }
      const lost = b.winLostList.lost.reduce((c, d) => {
        if (d.lost.players.length === 2) {
          c.s = c.s + 1;
          const tp = d.lost.players.find(p => p.claimed_by !== player.user_id);
          if (tp) {
            const pla = against.find(pla => pla.name === tp.name)
            if (!pla) {
              against.push({name: tp.name, results: {won: 0, lost: 1}})
            } else {
              pla.results.lost = pla.results.lost + 1;
              against[tp.name] = {...pla};
            }
          }
        } else if (d.lost.players.length > 2) {
          const tp = d.lost.players.find(p => p.ifpa_id === player.ifpa_id);
          if (tp) {
            const tr = d.lost.results.findIndex(p => p.player_id === tp.player_id);
            if (tr === 0) {
              c.g4 = c.g4 + 1
            } else if (tr === 1) {
              if (d.lost.players.length === 3) {
                c.g2 = c.g2 + 1
              } else {
                c.g3 = c.g3 + 1
              }
            } else {
              c.g2 = c.g2 + 1
            }
          }
        }
        return c;
      }, {s: 0, g2: 0, g3: 0, g4: 0});

      const won = b.winLostList.won.reduce((c, d) => {
        if (d.won.players.length === 2) {
          c.s = c.s + 1;
          const tp = d.won.players.find(p => p.claimed_by !== player.user_id);
          if (tp) {
            const pla = against.find(pla => pla.name === tp.name)
            if (!pla) {
              against.push({name: tp.name, results: {won: 1, lost: 0}})
            } else {
              pla.results.won = pla.results.won + 1;
              against[tp.name] = {...pla};
            }
          }
        } else if (d.won.players.length > 2) {
          c.g = c.g + 1;
        }
        return c;
      }, {s: 0, g: 0});

      // STANDINGS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      const ts = a.ts;
      if (b.tournamentStanding && b.tournamentStanding.length > 0) {
        const pos = b.tournamentStanding.find(s => s.claimed_by === player.user_id);
        if (pos) {
          ts.push({
            l: b.tournamentStanding.length - (pos.position - 1),
            p: pos.position
          })
        }
      }
      // STANDINGS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      return {
        won: a.won + won.s,
        lost: a.lost + lost.s,
        g1: a.g1 + won.g,
        g2: a.g2 + lost.g2,
        g3: a.g3 + lost.g3,
        g4: a.g4 + lost.g4,
        ts
      };
    }, {won: 0, lost: 0, g1: 0, g2: 0, g3: 0, g4: 0, ts: []})

    const sortedAgainst = against.sort((a, b) => Number(b.results.won + b.results.lost) - Number(a.results.won + a.results.lost));
    const sortedAgainstMoreWon = sortedAgainst.filter((a) => a.results.won > a.results.lost);
    console.warn('>>>WON<<<', sortedAgainstMoreWon);
    const sortedAgainstMoreLost = sortedAgainst.filter((a) => a.results.lost > a.results.won);
    console.warn('>>>LOST<<<', sortedAgainstMoreLost);
    const sortedAgainstTie = sortedAgainst.filter((a) => a.results.lost === a.results.won);
    console.warn('>>>TIE<<<', sortedAgainstTie);

    setPlayedAgainst(() => [...sortedAgainst]);
    setPlayedAgainstTop10(() => [...sortedAgainst.splice(0, 49)]);
    setHeadToHeadWin(winLost.won);
    setHeadToHeadLost(winLost.lost);
    setGroupPosition(() => ({
      g1: winLost.g1,
      g2: winLost.g2,
      g3: winLost.g3,
      g4: winLost.g4
    }))
    setTournamentStanding(() => [...winLost.ts])

  }, [analyseTournaments]);
  // WIN LOST ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  useEffect(() => {
    if (!analyse) {
      return;
    }

    localStorage.setItem(`p:analyse:${player.ifpa_id}`, JSON.stringify({
      analyseTournamentsCount,
      headToHeadWin,
      headToHeadLost,
      groupPosition,
      tournamentStanding,
      playedAgainstTop10
    }))
  }, [
    headToHeadWin,
    headToHeadLost,
    groupPosition,
    tournamentStanding,
    playedAgainstTop10
  ]);

  useEffect(() => {
    fetchTournaments();
    if (player.ifpa_id) {
      fetchIfpa();
    }

    const pa = localStorage.getItem(`p:analyse:${player.ifpa_id}`)
    if (pa) {
      setShowAnalyse(false);
      setStorageAnalyse(true);
      const rex = JSON.parse(pa);
      setAnalyseTournamentsCount(rex.analyseTournamentsCount);
      setHeadToHeadWin(rex.headToHeadWin);
      setHeadToHeadLost(rex.headToHeadLost);
      setGroupPosition(rex.groupPosition);
      setTournamentStanding(rex.tournamentStanding);
      setPlayedAgainstTop10(rex.playedAgainstTop10);
    }
  }, []);

  const TournamentsByType = () => {
    if (!tournaments) {
      return [];
    }
    const t = tournaments.reduce(function (acc, obj) {
      var key = obj['type'];
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    return <Grid wrap="nowrap" item container
                 spacing={1}>{Object.keys(t).map(o => <Grid item style={{
      marginTop: '2px',
      marginBottom: '0',
      textOverflow: 'ellipsis'
    }}><Typography style={{fontSize: '10px'}} color="textSecondary"
                   variant="subtitle2">{`${o.replaceAll(/_/gi, '')}:${t[o].length}`}</Typography></Grid>)}</Grid>
  }

  function onPlayerCompare(player) {
    setCompare(player);
  }

  function onPlayerClicked(player) {
    const claimedBy = player.claimedBy || player.claimed_by;
    if (claimedBy) {
      window.location.href = `${window.location.origin}/user/${claimedBy}`;
      return;
    }

    if (player.ifpaId || player.ifpa_id) {
      window.open(`https://www.ifpapinball.com/player.php?p=${player.ifpaId || player.ifpa_id}`, "_blank")
    }
  }

  function onStartAnalyse() {
    setAnalyse(true)
  }

  function onAnalyseData(id, data) {
    const atie = analyseTournaments.find(at => at.id === id.toString())
    if (!atie) {
      const tours = analyseTournaments;
      tours.push(Object.assign({id: id.toString()}, data));
      setAnalyseTournaments(t => ([...tours]))
    } else {
      const d = Object.assign(atie, data)
      const tours = Object.assign([], analyseTournaments, Object.assign(atie, data));
      setAnalyseTournaments(t => ([...tours]))
    }
  }

  function getHeadToHead() {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playedAgainst));
    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'player.json';
    a.innerHTML = 'download JSON';
    var container = document.getElementById('root');
    container.appendChild(a);
    a.click();
    container.remove();
  }

  if (compare) {
    return <div style={{marginBottom: '16px'}}>
      <Card style={{marginTop: '8px', marginBottom: '8px'}}>
        <Grid item container alignItems="center" direction='column'
              spacing={1}>
          <Grid item><Button onClick={() => setCompare(undefined)} color="primary"
                             endIcon={
                               <CloseOutlined/>}>Finish {compare.name} Player Compare</Button></Grid>
        </Grid>
      </Card>
      {tournaments && tournaments.map((t) => {
        return <PlayerCompare tournament={t} tournamentId={t.tournament_id} player={player} opponentPlayerName={compare.name}/>
      })}
    </div>
  }

  return <div style={{marginBottom: '16px'}}>
    {!tournamentId && player && <Grow in out timeout={1500}>
      <Card>
        <CardContent style={{position: 'relative'}}>
          <Grid item container direction="column">
            <Grid item container spacing={2} justify={"space-between"}>
              <Grid item>
                <Grid item container direction="column">
                  <Grid item container spacing={2}>
                    <Grid item>
                      <Typography>
                        {`${player.first_name} ${player.last_name}`}
                      </Typography>
                    </Grid>
                    {player.ifpa_id && <Grid item><Link target="_blank"
                                                        href={`https://tools.flipperliste.at/ifpa_player_statistics/?players%5B%5D=${player.first_name} ${player.last_name}`.replaceAll(/ /gi, '+')}>
                      <ShowChart/>
                    </Link></Grid>}
                    <Grid item><Link target="_blank"
                                     href={`https://pinballvideos.com/p?q=${player.first_name} ${player.last_name}`.replaceAll(/ /gi, '%20')}>
                      <Theaters/>
                    </Link></Grid>
                  </Grid>
                  <Grid item>
                    {player.ifpa_id ? <Link target="_blank"
                                            href={`https://www.ifpapinball.com/player.php?p=${player.ifpa_id}`}>
                                      {`#IFPA: ${player.ifpa_id}`}
                                    </Link> :
                     <Typography color="textSecondary" variant="subtitle2">
                       {`IFPA not registered`}
                     </Typography>}
                  </Grid>
                  <Grid item wrap="nowrap" container spacing={1}
                        style={{marginTop: '1px'}}>
                    {tournaments && tournaments.length !== 0 && <><Grid
                        item><Typography color="textSecondary"
                                         variant="subtitle2">
                      {`MatchPlay Tournaments played: ${tournaments.length}`}
                    </Typography></Grid><Grid item><Link
                        style={{opacity: '0.5'}} target="_blank"
                        href={`https://matchplay.events/live/users/${player.claimed_by || player.user_id}/played`}>
                      <AssignmentIcon fontSize="small"/>
                    </Link></Grid></>}
                  </Grid>
                  <Grid item wrap="nowrap" container spacing={1}>
                    {ifpaPlayer && <><Grid item><Typography
                        color="textSecondary" variant="subtitle2">
                      {`Total WPPR Events (All Time): ${ifpaPlayer.player_stats.total_events_all_time}`}
                    </Typography></Grid><Grid item><Link
                        style={{opacity: '0.5'}} target="_blank"
                        href={`https://www.ifpapinball.com/player.php?p=${player.ifpa_id}`}>
                      <AssignmentIcon fontSize="small"/>
                    </Link></Grid></>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                {ifpaPlayer &&
                <Grid item container direction="column" alignItems="center"
                      spacing={1}><Grid alignItems="flex-end" item container
                                        direction="column"><Grid item container
                                                                 spacing={2}>
                  <Grid
                      item><Typography>{getFlag(ifpaPlayer.country_code)}</Typography></Grid>
                  {ifpaPlayer.city &&
                  <Grid item><Typography>{ifpaPlayer.city}</Typography></Grid>}
                  <Grid
                      item><Typography>Age: {ifpaPlayer.age || '-'}</Typography></Grid>
                  <Grid item><Typography>WPPR
                    Rank: <b>{ifpaPlayer.player_stats.current_wppr_rank}</b></Typography></Grid>
                </Grid>
                  {countryRank && <Grid item>Country Rank: {countryRank}</Grid>}
                </Grid>
                  {ifpaPlayer.profile_photo && <Grid item>
                    <img onLoad={(e) => {e.target.style.display = 'block'}}
                         style={{
                           display: 'none',
                           opacity: '0.8',
                           border: '2px inset gold'
                         }} width="88" height="66"
                         src={ifpaPlayer.profile_photo}
                         alt="Player Picture"></img>
                  </Grid>}
                </Grid>}
                {tournaments && !storageAnalyse &&
                <Grid item container alignItems="center" direction='column'
                      spacing={1}>
                  <Grid item><Button disabled={analyse}
                                     onClick={onStartAnalyse} color="primary"
                                     endIcon={
                                       <MultilineChartIcon/>}>Analyse</Button></Grid>
                </Grid>}
              </Grid>
            </Grid>
            {tournaments && tournaments.length !== 0 && <TournamentsByType/>}
          </Grid>
          {progress && <CircularProgress style={{
            position: 'absolute',
            top: '25%',
            left: '45%',
            opacity: '0.7'
          }}/>}
        </CardContent>
      </Card>
    </Grow>}
    {message && <Alert variant="filled"
                       severity="warning">{message} onClick={fetchTournaments}</Alert>}
    {!tournamentId && (analyse || storageAnalyse) &&
    <Grow in out timeout={3500}>
      <Card style={{marginTop: '16px'}}>
        <CardContent style={{position: 'relative'}}>
          <Grid container>
            <Grid style={{marginBottom: '16px'}} wrap='nowrap' container
                  spacing={2} justify='space-between'>
              <Grid item style={{display: 'flex'}}><Typography>Analysed
                Tournaments: {analyseTournamentsCount}</Typography>{!analyse &&
              <Refresh onClick={() => {
                setAnalyse(true);
                setShowAnalyse(true);
              }} style={{
                marginLeft: '8px',
                opacity: '0.8',
                cursor: 'pointer',
                color: 'lightgreen'
              }}/>}</Grid>
              <Grid item style={{alignItems: 'flex-end', display: 'flex'}}>
                <Typography onClick={() => setShowAnalyse(!showAnalyse)}
                            style={{
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: 'lightskyblue',
                              whiteSpace: 'nowrap'
                            }}>{`Show Analyse `}{showAnalyse ? <ExpandMore
                    style={{fontSize: '14px'}}/> : <ExpandLess
                                                     style={{fontSize: '14px'}}/>}</Typography>
              </Grid>
            </Grid>
            {showAnalyse && <Grid container item>
              <Grid item style={{display: 'flex'}}>
                <div>
                  <Typography variant="body2">HeadToHead</Typography>
                  <VictoryChart domainPadding={80}
                                theme={VictoryTheme.material}>
                    <VictoryAxis
                        tickValues={[
                          1,
                          2
                        ]}
                        tickFormat={[
                          "Won",
                          "Lost"
                        ]}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={x => x}
                    />
                    <VictoryStack>
                      <VictoryBar
                          data={[
                            {x: 1, val: 0},
                            {x: 2, val: headToHeadLost}
                          ]}
                          x="x"
                          y="val"
                      />
                      <VictoryBar
                          data={[
                            {x: 1, val: headToHeadWin},
                            {x: 2, val: 0}
                          ]}
                          x="x"
                          y="val"
                      />
                    </VictoryStack>
                  </VictoryChart>
                </div>
              </Grid>
              <Grid item style={{display: 'flex'}}>
                <div>
                  <Typography variant="body2">Group</Typography>
                  <VictoryChart domainPadding={80}
                                theme={VictoryTheme.material}>
                    <VictoryAxis
                        tickValues={[
                          1,
                          2,
                          3,
                          4
                        ]}
                        tickFormat={[
                          "First",
                          "Second",
                          "Third",
                          "Last"
                        ]}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={x => x}
                    />
                    <VictoryStack>
                      <VictoryBar
                          data={[{x: 4, val: groupPosition.g4 || 0}]}
                          x="x"
                          y="val"
                      />
                      <VictoryBar
                          data={[{x: 1, val: groupPosition.g1 || 0}]}
                          x="x"
                          y="val"
                      />
                      <VictoryBar
                          data={[{x: 2, val: groupPosition.g2 || 0}]}
                          x="x"
                          y="val"
                      />
                      <VictoryBar
                          data={[{x: 3, val: groupPosition.g3 || 0}]}
                          x="x"
                          y="val"
                      />
                    </VictoryStack>
                  </VictoryChart>
                </div>
              </Grid>
              {playedAgainstTop10 && playedAgainstTop10.length !== 0 &&
              <Grid item style={{display: 'flex'}}>
                <div>
                  <Typography variant="body2">Most HeadToHead
                    Against{playedAgainst && playedAgainst.length !== 0 &&
                    <GetAppIcon style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '5px',
                      color: 'gray'
                    }} onClick={getHeadToHead}/>}</Typography>
                  <VictoryChart theme={VictoryTheme.material} height={1200}
                                width={1200}
                                padding={{left: 120, bottom: 60, right: 10}}>
                    <VictoryAxis
                        offsetX={120}
                        style={{tickLabels: {fontSize: 10, angle: -40}}}
                        tickValues={playedAgainstTop10.map((a, i) => i + 1)}
                        tickFormat={playedAgainstTop10.map((a) => a.name)}
                    />
                    <VictoryAxis
                        offsetY={60}
                        dependentAxis
                        tickFormat={x => x}
                    />
                    <VictoryGroup horizontal
                                  offset={8}
                                  style={{data: {width: 6}}}
                                  colorScale={[
                                    "green",
                                    "red"
                                  ]}
                    >
                      <VictoryBar
                          data={playedAgainstTop10.map((a, i) => ({
                            x: i + 1,
                            y: a.results.won
                          }))}
                      />
                      <VictoryBar
                          data={playedAgainstTop10.map((a, i) => ({
                            x: i + 1,
                            y: a.results.lost
                          }))}
                      />
                    </VictoryGroup>
                  </VictoryChart>
                </div>
              </Grid>}
              {tournamentStanding && tournamentStanding.length !== 0 &&
              <Grid item style={{display: 'flex'}}>
                <div>
                  <Typography variant="body2">Tournament Place</Typography>
                  <VictoryChart theme={VictoryTheme.material} width={1200}>
                    <VictoryAxis
                        tickValues={tournamentStanding.map((ts, i) => i + 1)}
                        tickFormat={tournamentStanding.map((ts) => tournamentStanding.length < 91 ? `${ts.p}.` : '')}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={x => x}
                    />
                    <VictoryStack>
                      <VictoryBar
                          data={tournamentStanding.map((ts, i) => ({
                            x: i + 1,
                            val: ts.l || 0
                          }))}
                          x="x"
                          y="val"
                      />
                      <VictoryBar
                          data={tournamentStanding.map((ts, i) => ({
                            x: i + 1,
                            val: ts.p || 0
                          }))}
                          x="x"
                          y="val"
                      />
                    </VictoryStack>
                  </VictoryChart>
                </div>
              </Grid>}
            </Grid>}
          </Grid>
        </CardContent>
      </Card>
    </Grow>}
    {!tournamentId && tournaments && tournaments.map((t) => {
      return <Tournament key={t.tournament_id} analyse={analyse}
                         analyseData={onAnalyseData} tournament={t}
                         ifpaId={player.ifpa_id}
                         claimedBy={Number(player.claimed_by || player.user_id)}
                         playerCompare={(p) => onPlayerCompare(p)}
                         playerClicked={(p) => onPlayerClicked(p)}/>;
    })}
    {tournamentId &&
    <Tournament standalone tournamentId={tournamentId} ifpaId={player.ifpa_id}
                claimedBy={Number(player.claimed_by || player.user_id)}
                playerCompare={(p) => onPlayerCompare(p)}
                playerClicked={(p) => onPlayerClicked(p)}/>}
  </div>
}

export default Player;
