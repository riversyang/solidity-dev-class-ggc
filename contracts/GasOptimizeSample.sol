pragma solidity 0.4.24;

contract GasOptimizeSample {
    address owner;

    // The minimum bet a user has to make to participate in the game
    uint public minimumBet = 100 finney; // Equal to 0.1 ether

    // The total amount of Ether bet for this current game
    uint public totalBets;

    // The total number of bets the users have made
    uint public numberOfBets;

    // The maximum amount of bets can be made for each game
    uint public maxAmountOfBets = 10;

    // The max amount of bets that cannot be exceeded to avoid excessive gas consumption
    // when distributing the prizes and restarting the game
    uint public constant LIMIT_AMOUNT_BETS = 100;

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
        for (uint i; i < _users.length; i++) {
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
        numberOfBets = 0;
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