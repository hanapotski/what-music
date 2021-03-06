import React from 'react';
import CommonArtists from './CommonArtists';
import CommonGenres from './CommonGenres';
import AllUsers from './AllUsers';

class FindCommon extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
            allUsers: [],
            searchEmail: '',
            compareFriend: {},
            artistsInCommon: [],
            genresInCommon: [],
            // backendURL: 'https://what-music-backend.herokuapp.com'
            backendUrl: 'http://localhost:8000'
        }
        this.search = this.search.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.findCommonArtists = this.findCommonArtists.bind(this);
        this.findCommonGenres = this.findCommonGenres.bind(this);
        this.getFavGenres = this.getFavGenres.bind(this);
        this.printState = this.printState.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    componentDidMount() {
        console.log('*** this is FindCommon.js ***');
        // this.getAllUsers();
    }

    getAllUsers() {
        const getConfig = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            Accept: 'application/json'
        };
        fetch(`/dbase/allUsers`, getConfig)
            .then(res => res.json())
            .then(foundAllUsers => {
                // console.log('*** typeof foundAllUsers ***', typeof foundAllUsers);
                // foundAllUsers.map(user => console.log('*** each users email ***', user.email));
                // console.log('*** this is the result of FindCommon.findAllUsers ***', foundAllUsers);
                // // this.setState({allUsers: foundAllUsers});
                // // console.log('*** typeof foundAllUsers ***', typeof foundAllUsers);
                // // console.log(`*** getallUsers found ${foundAllUsers.length} users ***`, foundAllUsers);
                let allUsersArray = [];
                // for (let i of foundAllUsers) {
                //     // console.log('***this is i of foundAllUsers ***', i);
                //     let userDeets = [{
                //         email: i.email,
                //         fname: i.user.fname,
                //         linitial: i.user.linitial}];
                //     allUsersArray.push(userDeets);
                // }
                foundAllUsers.map(user => {
                    allUsersArray.push(user.email)
                });
                // console.log('*** this is allUsersArray ***', allUsersArray);
                this.setState({allUsers: allUsersArray});
            })
            // .catch(err => console.log(err));
    }

    inputHandler(event) {
        let name = event.target.name,
            value = event.target.value;
        this.setState({[name]: value})
    }

    search() {
        const getConfig = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(`${this.state.backendURL}/dbase/user/${this.state.searchEmail}`, getConfig)
            .then(res => res.json())
            .then(friend => {
                this.setState({compareFriend: friend});
                // this.findCommonArtists(friend);
                // this.findCommonGenres(friend);
                console.log('*** findCommon.js found ur friend ***', friend);
            });
    }

    findCommonArtists(friend) {
        // compare two users to find commonArtists;
        console.log('*** FindCommon.findCommonArtists comparing ***');
        let commonArtists = [];

        // for each artist in friend's favArtists;
        for (let f in friend.favArtists) {
            //compare to each of my favArtists;
            for (let i in this.state.user.favArtists) {
                // if there's a match;
                if (friend.favArtists[f].id === this.state.user.favArtists[i].id) {
                    // then push to local array;
                    commonArtists.push({id: friend.favArtists[i].id, name: friend.favArtists[i].name});
                }
            }
        }
        // after all iterations, set state;
        console.log('*** common artists found ***', commonArtists);
        this.setState({artistsInCommon: commonArtists});
    }

    findCommonGenres(friend) {
        // compare two users to find commonGenres;
        console.log('*** FindCommon.findCommonGenres() ***');
        let commonGenres = [];
        if (!friend.favGenres.length) {
            friend.favGenres = this.getFavGenres(friend);
        }
        for (let f in friend.favGenres) {
            for (let i in this.state.user.favGenres) {
                if (friend.favGenres[f].genre === this.state.user.favGenres[i].genre) {
                    // console.log('** we got a matching genre here! ***');
                    commonGenres.push(friend.favGenres[f].genre);
                }
            }
        }
        this.setState({genresInCommon: commonGenres});
    }

    getFavGenres(friend) {
        // this method can be used to create a favGenres array if a user doesn't have one already
        let genres = {};
        let genresArray = [];

        // count how many times a genre appears in a user's favArtists:
        // for each artist in favArtists, create and add an object of each of their genres {genre: count} to temp genres object;
        for (let artist of friend.favArtists) {
            if (artist.genres.length > 0) {
                for (let genre of artist.genres) {
                    if (!Object.keys(genres).includes(genre)) {
                        genres[genre] = 1;
                    } else {
                        genres[genre]+= 1;
                    }
                }
            }
        }
        // next, iterate through temp genres object, format and push new object {genre: genre, count: count} to genresArray;
        for (let i of Object.keys(genres)) {
            genresArray.push({genre: i, count: genres[i]})
        }
        // finally return sorted array genresArray;
        return genresArray.sort((a, b) => { return b.count - a.count });
    }

    printState() {
        console.log('*** FindCommon printing state ***', this.state);
    }


    render() {
        return (
            <React.Fragment>
                {this.state.allUsers && <AllUsers allUsers={this.state.allUsers} />}

                <div className="row center-align">
                    <input className="search-email center" type="text" name="searchEmail" placeholder="Enter Your Friend's Email" value={this.state.searchEmail} onChange={this.inputHandler}  />
                    {/* add a select element that lets the user choose someone to compare to, from either a list of allUsers or myFriends */}
                    <button className="waves-effect waves-dark btn btn-submit-search center" onClick={this.search}>Compare Your Favorite Music</button>
                </div>

                <button className="waves-effect waves-dark btn" onClick={this.printState}>print state</button>
                <button className="waves-effect waves-dark btn" onClick={this.getAllUsers}>get All users</button>

                {/* think about how to style this div better*/}
                {/*<div className="row display-find-common-search-results">*/}
                    {/*<div className="col sm6 display-inline">*/}
                        {/*<h5 className="underline-text">common artists</h5>*/}
                        {/*<ol className="center-list">*/}
                            {/*{this.state.artistsInCommon && <CommonArtists commonArtists={this.state.artistsInCommon} />}*/}
                        {/*</ol>*/}
                    {/*</div>*/}

                    {/*<div className="col sm6 display-inline">*/}
                        {/*<h5 className="underline-text">common genres</h5>*/}
                        {/*<ol className="center-list">*/}
                            {/*{this.state.genresInCommon && <CommonGenres commonGenres={this.state.genresInCommon} /> }*/}
                        {/*</ol>*/}
                    {/*</div>*/}
                {/*</div>*/}

            </React.Fragment>
        );
    }

}

export default FindCommon;
