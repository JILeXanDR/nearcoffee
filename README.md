# Buy me a coffee in NEAR

## development

- to be able to get some coffee need to submit new account, for this is needed:
    - click to "login with NEAR"

- it includes single contract written in Rust

### design

- use NEAR logo on a cap of coffee!

## Usage

### Setup

```shell
export CONTRACT=dev-1618250281091-9032689
export ACCOUNT_ID=jilexandr.testnet
```

### Commands

```shell
# Init state
near call $CONTRACT new '{"owner_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID
```

```shell
# Buy coffee
near call $CONTRACT buy_one_coffee_for '{"account_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID --amount 0.2
```

```shell
# Get supporters of profile
near call $CONTRACT who_bought_coffee_for '{"account_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID
```

```shell
# Create profile
near call $CONTRACT create_profile '{"account_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID
```

```shell
# Get profile
near call $CONTRACT get_profile_of '{"account_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID
```

```shell
# Update profile
near call $CONTRACT update_profile '{"account_id": "jilexandr.testnet", "description": "test"}' --accountId $ACCOUNT_ID
```

```shell
# Swap coffee
near call $CONTRACT swap_coffee '{}' --accountId $ACCOUNT_ID
```

```shell
# Withdraw fees
near call $CONTRACT withdraw_fees '{}' --accountId $ACCOUNT_ID
```

```shell
# Get all profiles
near call $CONTRACT get_all_profiles '{}' --accountId $ACCOUNT_ID
```

## TODO:

- [ ] MVP
- [ ] Add contract owner when init contract
- [ ] Make debug action (only for contract owner) to get current state. Just serialize whole contract struct as JSON?
- [ ] Deploy contract to testnet (coffee.testnet or coffees.testnet)
- [ ] `call $CONTRACT get_stats '{"account_id": "jilexandr.testnet"}' --accountId $ACCOUNT_ID`