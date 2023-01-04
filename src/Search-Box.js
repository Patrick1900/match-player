import React, { useEffect, useState, useRef } from 'react';
import { Link, Container, Box, Grow, Grid, Button, Input, InputLabel, FormControl, Typography, InputAdornment } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloseOutlined from '@material-ui/icons/CloseOutlined';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    searchBox: {
      padding: '8px 16px',
      border: '1px solid lightgray',
      borderRadius: '40px',
      margin: '16px 8px',
      background:'white'
    },
    resetIcon: {
        margin: '-5px'
    }
  });

const SearchBox = ({onFetchPlayer, loadMatchPlayId}) => {
    const classes = useStyles();
    const inputRef = useRef(null)
    const [matchPlayId, setMatchPlayId] = useState(null);

    useEffect(() => {
        setMatchPlayId(loadMatchPlayId)
      }, [loadMatchPlayId]); 

    function onChangeTextFieldMatchPlayId(val) {
        setMatchPlayId(val.target.value);
    }

    function reset() {
        localStorage.removeItem('pin:tournament');
        localStorage.removeItem('last:fetched:player');
        window.location.href = window.location.origin;
      }

    return <div>
            <Box display="flex" justifyContent="center">
                <Box className={classes.searchBox}>
                <Grow in>
                    <Grid direction="row">
                            <Grid wrap="nowrap" justify="center" container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <FormControl>
                                        <InputLabel htmlFor="filled-adornment-password">MatchPlay-Id</InputLabel>
                                        <Input inputRef={inputRef} autoFocus id="filled-adornment-password" label="MatchPlay-Id" onKeyUp={e => {if (e.keyCode === 13) {onFetchPlayer(matchPlayId)} }} onChange={onChangeTextFieldMatchPlayId} value={matchPlayId}  endAdornment={
                                            <InputAdornment position="end">
                                                <CloseOutlined
                                                    style={{color: 'lightgray', cursor: 'pointer'}}
                                                    onClick={reset}
                                                />
                                        </InputAdornment>} startAdornment={<InputAdornment position="start">
                                                <AccountCircle
                                                    style={{color: 'lightgray', cursor: 'pointer'}}
                                                    onClick={() => inputRef.current.select()}
                                                />
                                        </InputAdornment>}/>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Button style={{marginBottom: '-5px'}} size="large" onClick={() => onFetchPlayer(matchPlayId)} color="primary">Search</Button>    
                                </Grid>
                            </Grid>
                    </Grid> 
                </Grow>
                </Box>
            </Box>
            <Grid style={{opacity: "0.7", marginTop: "-24px"}} wrap="nowrap" justify="center" container spacing={2} alignItems="flex-end">
                <Grid item>
                    <Typography style={{fontSize: "10px", lineHeight: "1.4"}}>
                        {'Open Player Search on'}
                    </Typography>
                </Grid>    
                <Grid item>                            
                    <Link target="_blank>" rel="noopener" style={{fontSize: "10px"}} href="https://matchplay.events/live/ratings">
                        {'MatchPlay'}
                    </Link>
                </Grid>
                <Grid item>
                    <Link target="_blank" rel="noopener" style={{fontSize: "10px"}} href="https://www.ifpapinball.com/players/find.php">
                        {'IFPA'}
                    </Link>
                </Grid>
            </Grid>
        </div>
}

export default SearchBox;