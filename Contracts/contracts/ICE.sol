import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ice is ERC20("ice", "ICE") {
    constructor (){
        _mint(msg.sender, 1000);
        console.log(symbol());
    }
}