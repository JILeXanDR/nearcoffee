use near_sdk::Balance;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

// TODO: better to make it configurable
#[derive(BorshDeserialize, BorshSerialize, Serialize, Debug)]
pub enum CoffeePrice {
    // any price
    Custom(Balance),
    // 1 NEAR
    Expensive,
    // 0.5 NEAR
    Default,
    // 0.1 NEAR
    Cheap,
}

impl CoffeePrice {
    pub fn to_balance(&self) -> Balance {
        *match self {
            CoffeePrice::Custom(balance) => balance,
            CoffeePrice::Expensive => &1_000_000_000_000_000_000_000_000,
            CoffeePrice::Default => &5_000_000_000_000_000_000_000_00,
            CoffeePrice::Cheap => &1_000_000_000_000_000_000_000_00,
        }
    }
}
