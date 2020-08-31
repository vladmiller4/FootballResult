import { textAnimate } from './text-animation.js';
import { Team, Player} from './classes.js';
textAnimate();

const head = window.document.getElementsByTagName('head')[0];
function loadBootstrap(src, callback) {
    let style = window.document.createElement('link')
    style.href = src;
    style.rel = 'stylesheet';
    style.crossOrigin = 'anonymous';
    style.integrity = 'sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z';
    head.appendChild(style)
    style.onload = () => callback(null, style);
    style.onerror = () => callback(new Error(`Bootstrap load error for ${src}`));
    document.head.append(style);
}

loadBootstrap('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css', function (error) {
    if (error) {
        console.error(error); // error handler #1
    }
});

async function getData(leagueID) { // async #1
    try {
        const url = `https://api-football-v1.p.rapidapi.com/v2/leagueTable/${leagueID}`;
        const response = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                "x-rapidapi-key": "b6ee121c40msh42f96fcffd3bad5p1ba897jsn37beb3c1e222"
            }
        });
        if (response.ok) {
            const data = await response.json();
            numberOfRequest();
            pushData(data);
        }
    } catch (error) {
        console.error('League data:', error.name, error.message); // error handler #2
    }
}

async function getTeamList(teamID) { // async #2
    try {
        const url = `https://api-football-v1.p.rapidapi.com/v2/players/squad/${teamID}/2019-2020`;
        const response = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                "x-rapidapi-key": "b6ee121c40msh42f96fcffd3bad5p1ba897jsn37beb3c1e222"
            }
        });
        if (response.ok) {
            const data = await response.json();
            numberOfRequest();
            pushPlayersList(data, teamID);
        }
    } catch (error) {
        console.error('TeamSquad data:', error.name, error.message); // error handler #3
    }
}

const qS = (a) => document.querySelector(a);

function loader() { // async #3
    qS('.loader').style.display = 'flex';
    setTimeout(function () {  
        qS('.loader').style.display = 'none';
    }, 500);
}

let arrTeams = [];

function pushData(data) {
    arrTeams = [];
    let n;
    if (data.api.standings.length == 3) {
        n = 2;
    } else {
        n = 0;
    }
    createTable(data.api.standings[n].length);
    for (let i = 0; i < data.api.standings[n].length; i++) {
        document.querySelectorAll('.team-position')[i].textContent = data.api.standings[n][i].rank;
        document.querySelectorAll('.team-name')[i].textContent = data.api.standings[n][i].teamName;
        document.querySelectorAll('.team-played')[i].textContent = data.api.standings[n][i].all.matchsPlayed;
        document.querySelectorAll('.team-won')[i].textContent = data.api.standings[n][i].all.win;
        document.querySelectorAll('.team-drawn')[i].textContent = data.api.standings[n][i].all.draw;
        document.querySelectorAll('.team-lost')[i].textContent = data.api.standings[n][i].all.lose;
        document.querySelectorAll('.team-gf')[i].textContent = data.api.standings[n][i].all.goalsFor;
        document.querySelectorAll('.team-ga')[i].textContent = data.api.standings[n][i].all.goalsAgainst;
        document.querySelectorAll('.team-gd')[i].textContent = data.api.standings[n][i].goalsDiff;
        document.querySelectorAll('.team-points')[i].textContent = data.api.standings[n][i].points;
        const team = new Team(data.api.standings[n][i].teamName, data.api.standings[n][i].team_id,
        data.api.standings[n][i].group, data.api.standings[n][i].rank, data.api.standings[n][i].logo);
        arrTeams.push(team);
        for (let i = 0; i < data.api.standings[n].length; i++) {
            document.querySelectorAll('.team')[i].onclick = function () {
                qS('.modal__table').lastChild.remove();
                getTeamList(arrTeams[i].teamID);
                loader();
                qS('.modal').style.display = "block";
            }
        }
    }
}

let arrPlayers = [];

function pushPlayersList(data, teamID) {
    arrPlayers = [];
    createTeamList(data.api.players.length);
    const currentTeam = arrTeams.filter(team => team.teamID == teamID);
    for (let i = 0; i < data.api.players.length; i++) {
        document.querySelectorAll('.player-name')[i].textContent = data.api.players[i].player_name;
        document.querySelectorAll('.player-position')[i].textContent = data.api.players[i].position;
        document.querySelectorAll('.player-age')[i].textContent = data.api.players[i].age;
        document.querySelectorAll('.player-nationality')[i].textContent = data.api.players[i].nationality;
        const player = new Player(data.api.players[i].player_name, data.api.players[i].position,
        data.api.players[i].age, data.api.players[i].nationality, currentTeam[0].teamName, 
        currentTeam[0].teamID, currentTeam[0].leagueName, currentTeam[0].rank, currentTeam[0].logo);
        arrPlayers.push(player);
    }
    qS('.modal__img').src = `${arrPlayers[0].logo}`;
    qS('.modal__name').textContent = `${arrPlayers[0].teamName}`;
}

window.onclick = function (event) { 
    if (event.target == qS('.modal')) {
        qS('.modal').style.display = "none";
    }
}

qS('.modal-close').onclick = function () {
    qS('.modal').style.display = "none";
}

qS('.back').onclick = function () {
    qS('.results__table').lastChild.remove();
    qS('.menu').style.display = "flex";
    qS('.results').style.display = "none";
}

function getResult(leagueID) {
    getData(leagueID);
    loader();
    qS('.menu').style.display = "none";
    qS('.results').style.display = "block";
}

function League(selector, id) {  // constructor function
    this.selector = selector;
    this.id = id;
}

const italy = new League('.italy', '891');
const england = new League('.england', '524');
const spain = new League('.spain', '775');
const france = new League('.france', '525');
const germany = new League('.germany', '754');
const ukraine = new League('.ukraine', '534');
const netherlands = new League('.netherlands', '566');
const russia = new League('.russia', '511');
const arrLeagues = new Array(italy, england, spain, france, germany, ukraine, netherlands, russia);

for (let i = 0; i < arrLeagues.length; i++) {
    qS(arrLeagues[i].selector).onclick = function () {
        getResult(arrLeagues[i].id);
    }
}

function createTable(count) {
    let tbody = document.createElement('tbody');
    qS(".results__table").appendChild(tbody);
    for (let i = 0; i < count; i++) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        tr.classList.add('team');
        let td = createTagWithClass('td');
        tr.innerHTML = `
        <th scope="row" class="team-position"></th>
        ${td('team-name')}
        ${td('team-played')}
        ${td('team-won')}
        ${td('team-drawn')}
        ${td('team-lost')}
        ${td('team-gf')}
        ${td('team-ga')}
        ${td('team-gd')}
        ${td('team-points')}
        `
    }
}

function createTeamList(count) {
    let tbody = document.createElement('tbody');
    qS(".modal__table").appendChild(tbody);
    for (let i = 0; i < count; i++) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        tr.classList.add('player');
        let td = createTagWithClass('td');
        tr.innerHTML = `
        ${td('player-name')}
        ${td('player-position')}
        ${td('player-age')}
        ${td('player-nationality')}
        `
    }
}

// Closures

function createTagWithClass(tag) { // outer Lexical Environment {tag: param, tagClass: fn}
    function tagClass(tagC) {
        let result = `<${tag} class="${tagC}"></${tag}>`; // inner Lexical Environment { text: tagC, result: value }
        return result;
    }
    return tagClass;
}

function countRequest() {
    let count = 1;  // outer Lexical Environment {count: 1, function: fn}
    return function(){
        return console.log(count++); // inner Lexical Environment {}
    }
}

let numberOfRequest = countRequest();

function greetVisitor(visitorName) { // Example // outer Lexical Environment { visitorName: param, greetingMsg: fn}
    function greetingMsg() {
	  console.log("Nice to meet you, " + visitorName); // inner Lexical Environment {}
    }
    return greetingMsg();
}

greetVisitor('Roman');

