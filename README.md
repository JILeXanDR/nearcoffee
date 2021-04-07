# Buy me a coffee in NEAR

## development

- to be able to get some coffee need to submit new account, for this is needed:
  - click to "login with NEAR"

- it includes single contract written in Rust

### contract methods

#### view
- `call who_bought_coffee_for '{"account_id": "acc.near"}'`
- `call get_stats '{"account_id": "acc.near"}'`
  
#### change
- `call bought_one_coffee_for '{"account_id": "acc.near", "message": "something nice (optional)"}'`
- `call edit_profile '{""}'`

### design

- use NEAR logo on a cap of coffee!
