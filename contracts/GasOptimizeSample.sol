pragma solidity 0.4.24;

contract GasOptimizeSample {
    // The total amount of Ether bet for this current game
    uint public totalBets;
    // Array of players
    uint256[] public players;
    // Each number has an array of players. Associate each number with a bunch of players
    mapping(uint256 => uint256[]) numberBetPlayers;
    // The number that each player has bet for
    mapping(uint256 => uint256) playerBetsNumber;
    // The balance that each player owns
    mapping(uint256 => uint256) playerBalances;

    constructor() public {

    }

    function initData(
        uint256[] _users,
        uint256[] _betNumbers,
        uint256[] _betAmounts
    )
        public
    {
        for (uint i = 0; i < _users.length; i++) {
            players.push(_users[i]);
            numberBetPlayers[_betNumbers[i]].push(_users[i]);
            playerBetsNumber[_users[i]] = _betNumbers[i];
            totalBets += _betAmounts[i];
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

    function playerBalance(uint256 _user) public view returns (uint256) {
        return playerBalances[_user];
    }

    function distributePrizes(uint256 _numberWinner) public {
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
}