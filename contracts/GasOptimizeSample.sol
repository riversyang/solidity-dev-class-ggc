pragma solidity 0.4.24;

contract GasOptimizeSample {
    // The total amount of Ether bet for this current game
    uint public totalBets;
    // Array of players
    address[] public players;
    // Each number has an array of players. Associate each number with a bunch of players
    mapping(uint256 => address[]) numberBetPlayers;
    // The number that each player has bet for
    mapping(address => uint256) playerBetsNumber;
    // The balance that each player owns
    mapping(address => uint256) playerBalances;

    constructor() public {
    }

    function bet(uint256 _betNumber) public payable {
        require(players.length < 5);
        players.push(msg.sender);
        numberBetPlayers[_betNumber].push(msg.sender);
        playerBetsNumber[msg.sender] = _betNumber;
        totalBets += msg.value;
        if (players.length == 5) {
            distributePrizes1(5);
        }
    }

    function clearState() public {
        // Delete all the players for each number
        for (uint j = 1; j <= 10; j++) {
            for (uint k = 0; k < numberBetPlayers[j].length; k++) {
                playerBetsNumber[numberBetPlayers[j][k]] = 0;
                numberBetPlayers[j][k] = 0;
            }
            numberBetPlayers[j].length = 0;
        }

        for (uint i = 0; i < players.length; i++) {
            players[i] = 0;
        }

        players.length = 0;
        totalBets = 0;
    }

    function playerBalance() public view returns (uint256) {
        return playerBalances[msg.sender];
    }

    function distributePrizes1(uint256 _numberWinner) private {
        // Calculate winner's balance amount
        uint256 winnerBalance;
        uint i;

        if (numberBetPlayers[_numberWinner].length > 0) {
            winnerBalance = totalBets / numberBetPlayers[_numberWinner].length;
            // Apply rewards
            for (i = 0; i < numberBetPlayers[_numberWinner].length; i++) {
                playerBalances[numberBetPlayers[_numberWinner][i]] += winnerBalance;
            }
        } else {
            require(players.length > 0);
            winnerBalance = totalBets / players.length;
            // Apply rewards
            for (i = 0; i < players.length; i++) {
                playerBalances[players[i]] += winnerBalance;
            }
        }
    }

    function distributePrizes2(uint256 _numberWinner) private {
        // Calculate winner's balance amount
        uint256 winnerBalance;
        uint256 winnerCount;
        uint i;

        if (numberBetPlayers[_numberWinner].length > 0) {
            winnerCount = numberBetPlayers[_numberWinner].length;
            winnerBalance = totalBets / winnerCount;
            // Apply rewards
            for (i = 0; i < winnerCount; i++) {
                playerBalances[numberBetPlayers[_numberWinner][i]] += winnerBalance;
            }
        } else {
            require(players.length > 0);
            winnerCount = players.length;
            winnerBalance = totalBets / winnerCount;
            // Apply rewards
            for (i = 0; i < winnerCount; i++) {
                playerBalances[players[i]] += winnerBalance;
            }
        }
    }

}