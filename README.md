# EIP72-auth-example

This is an example of an EIP-712 based token claim system.

To be eligible to claim ERC20 ICE tokens, the user will need to be issued a Voucher.

Vouchers are a signed sort of data, formatted following EIP-712 standard.

Vouchers contains a fixed domain and are issued for a specific user, amount and timestamp.

On the front-end side, the user will connect, then we will verify that : 

- the voucher has been issued to the user address
- the user is effectively the owner of the user address using a signature verification
