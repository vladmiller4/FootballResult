export class Team { // class Parent
    constructor(teamName, teamID, leagueName, rank, logo) {
        this.teamName = teamName;
        this.teamID = teamID;
        this.leagueName = leagueName;
        this.rank = rank;
        this.logo = logo;
    }
}

export class Player extends Team { // class Child
    constructor(playerName, position, age, nationality, teamName, teamID, leagueName, rank, logo) {
        super(teamName, teamID, leagueName, rank, logo);
        this.playerName = playerName;
        this.position = position;
        this.age = age;
        this.nationality = nationality;
    }
}