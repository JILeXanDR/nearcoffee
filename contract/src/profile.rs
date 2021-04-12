use near_sdk::{AccountId, Balance};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

use crate::coffee::CoffeePrice;

pub const DEFAULT_DESCRIPTION: &str = "new member of community";

#[derive(Default, BorshDeserialize, BorshSerialize, Debug, PartialEq, Serialize)]
pub struct Profile {
    // account_id is a NEAR account (eq account_name.near).
    // It's also used as unique link to profile.
    pub account_id: AccountId,
    // description is a text shown in the profile.
    pub description: String,
    // it's a price per cap of coffee, can be customized
    pub coffee_price: Balance,
    // balance contains amount of NEARs gotten from received coffee.
    // Owner of profile can withdraw this money to his NEAR account at any time.
    pub balance: Balance,
}

impl Profile {
    pub fn new(account_id: AccountId, description: String) -> Self {
        Self {
            account_id,
            description: description.to_string(),
            coffee_price: CoffeePrice::Default.to_balance(),
            balance: 0,
        }
    }
}
