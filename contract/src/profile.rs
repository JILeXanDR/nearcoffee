use near_sdk::{AccountId, Balance};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

// TODO: use Debug and PartialEq to enable comparison in assert_eq!
#[derive(Default, BorshDeserialize, BorshSerialize, Debug, PartialEq)]
pub struct Profile {
    // account_id is a NEAR account (eq account_name.near)
    // it should be used as unique identifier of profile
    pub account_id: AccountId,
    // description is a text shown somewhere in the profile
    pub description: String,
    // balance contains amount of NEARs gotten from bought coffee
    // user can withdraw this money to his account at any time
    pub balance: Balance,
}

impl Profile {
    pub(crate) fn new(account_id: AccountId, description: &str) -> Self {
        Self {
            account_id,
            description: description.to_string(),
            balance: 0,
        }
    }
}
