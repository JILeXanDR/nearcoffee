#![allow(warnings, unused)]

use near_sdk::{AccountId, Balance, env, log, near_bindgen, PanicOnDefault, setup_alloc};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::ValidAccountId;

use crate::profile::Profile;

mod profile;
mod utils;

setup_alloc!();

// it's an account who buys a coffee
type SupporterId = AccountId;

// it's an account of profile who receives a coffee
type ProfileId = AccountId;

// TODO: better to make it configurable
// coffee price is 0.2 NEAR (or ~1 $)
const COFFEE_PRICE: Balance = 2_000_000_000_000_000_000_000_00;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
struct Contract {
    // profiles are customized NEAR accounts can receive a coffee
    profiles: UnorderedMap<AccountId, Profile>,
    // list of all supports
    supporters: UnorderedMap<ProfileId, Vec<SupporterId>>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            profiles: UnorderedMap::new(b"proriles".to_vec()),
            supporters: UnorderedMap::new(b"supporters".to_vec()),
        }
    }

    #[payable]
    pub fn buy_one_coffee_for(&mut self, account_id: &ValidAccountId) {
        let supporter: SupporterId = env::predecessor_account_id();
        let attached_deposit: Balance = env::attached_deposit();

        assert_eq!(attached_deposit, COFFEE_PRICE, "Attached deposit is different then price of single cap of coffee");

        let mut profile: Profile = self.get_profile_of(account_id)
            .expect(format!("Account {} is not connected to our platform and can't be a receiver of a coffee", account_id).as_str());

        // update profile balance
        profile.balance += attached_deposit;

        let mut supporters = self.get_supporters_of(&profile.account_id);

        supporters.push(supporter.clone());

        // update state
        self.profiles.insert(account_id.as_ref(), &profile);
        self.supporters.insert(account_id.as_ref(), supporters.as_ref());

        log!("Account {} bought 1 coffee for {}", supporter, account_id);
    }

    /// Returns list of accounts who bought a coffee for account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id we want to get his supporters
    pub fn who_bought_coffee_for(&self, account_id: &ValidAccountId) -> Vec<AccountId> {
        self.get_supporters_of(account_id.as_ref())
    }

    /// Created a new profile for given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id
    pub fn create_profile(&mut self, account_id: &ValidAccountId) -> Profile {
        let account_id: &AccountId = account_id.as_ref();

        let profile = match self.profiles.get(account_id) {
            Some(_) => panic!("Account {} already exists", account_id),
            None => Profile::new(account_id.clone(), "".to_string())
        };

        self.profiles.insert(account_id, &profile);

        log!("Created new profile by {}", &account_id);
        profile
    }

    /// Updates a profile by given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id is associated with profile wanted to be updated
    /// * `description` - new text string which describes a given profile
    pub fn update_profile(&mut self, account_id: &ValidAccountId, description: String) {
        let mut profile = self.get_profile_of(&account_id).expect("No profile found");

        profile.description = description.to_string();

        self.profiles.insert(account_id.as_ref(), &profile);
    }

    /// Returns a profile by given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id is associated with profile (eq: bob.near)
    pub fn get_profile_of(&self, account_id: &ValidAccountId) -> Option<Profile> {
        self.profiles.get(account_id.as_ref())
    }
}

// let's organize all private methods inside separated contract implementation
impl Contract {
    fn get_supporters_of(&self, account_id: &AccountId) -> Vec<SupporterId> {
        let buyers: Vec<SupporterId> = self.supporters
            .get(account_id)
            .map_or_else(|| vec![], |v| v);
        buyers
    }
}

#[cfg(test)]
mod tests {
    use std::convert::TryInto;

    use near_sdk::{testing_env, VMContext};
    use near_sdk::env::log;
    use near_sdk::MockedBlockchain;
    use near_sdk::test_utils::{get_logs, VMContextBuilder};

    use crate::utils::to_yocto;

    use super::*;

    const BOB_ACCOUNT: &str = "bob";
    const ALICE_ACCOUNT: &str = "alice";

    fn get_context(is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(BOB_ACCOUNT.try_into().unwrap())
            .is_view(is_view)
            .build()
    }

    fn get_context_with_deposit(is_view: bool, account_id: &str, deposit: Balance) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(account_id.try_into().unwrap())
            .is_view(is_view)
            .attached_deposit(deposit)
            .build()
    }

    fn get_context_with_signer(is_view: bool, account_id: &str) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(account_id.try_into().unwrap())
            .is_view(is_view)
            .build()
    }

    #[test]
    fn create_profile_using_new_account_id() {
        let context = get_context(false);
        testing_env!(context);

        let mut contract = Contract::new();

        let account_id: ValidAccountId = String::from(ALICE_ACCOUNT).try_into().unwrap();

        let created_profile = contract.create_profile(&account_id);

        assert_eq!(created_profile.account_id, "alice");
        assert_eq!(created_profile.description, "");
        assert_eq!(created_profile.balance, 0);

        let found_profile = contract.get_profile_of(&account_id).expect("Could not find created profile in the state");

        assert_eq!(created_profile, found_profile);
    }

    #[test]
    #[should_panic(expected = "Account alice is not connected to our platform")]
    fn buy_one_coffee_for_missing_account_id() {
        let context = get_context_with_deposit(false, BOB_ACCOUNT, COFFEE_PRICE);
        testing_env!(context);

        let mut contract = Contract::new();

        let account_id: ValidAccountId = ALICE_ACCOUNT.to_string().try_into().unwrap();

        contract.buy_one_coffee_for(&account_id);
    }

    #[test]
    fn buy_one_coffee_for_existing_account_id() {
        let context = get_context_with_deposit(false, BOB_ACCOUNT, COFFEE_PRICE);
        testing_env!(context);

        let mut contract = Contract::new();

        // receiver for coffee
        let account_id: ValidAccountId = ALICE_ACCOUNT.to_string().try_into().unwrap();

        // prepare profile for alice to be able to buy a coffee for her
        contract.create_profile(&account_id);

        // finally bob buys a coffee for alice
        contract.buy_one_coffee_for(&account_id);

        let supporters = contract.get_supporters_of(account_id.as_ref());

        // only have 1 supporter
        assert_eq!(supporters.len(), 1);

        // check balance
        let profile = contract.get_profile_of(&account_id).unwrap();

        assert_eq!(profile.balance, COFFEE_PRICE);
    }

    #[test]
    #[should_panic(expected = "Attached deposit is different then price of single cap of coffee")]
    fn buy_one_coffee_with_wrong_attached_deposit() {
        // 0.3 NEARs is more then price of coffee
        let too_big_deposit: Balance = to_yocto("0.3");

        let context = get_context_with_deposit(false, BOB_ACCOUNT, too_big_deposit);
        testing_env!(context);

        let mut contract = Contract::new();

        // receiver for coffee
        let account_id: ValidAccountId = ALICE_ACCOUNT.to_string().try_into().unwrap();

        contract.buy_one_coffee_for(&account_id);
    }

    #[test]
    fn update_profile() {
        let mut context = get_context_with_signer(false, BOB_ACCOUNT);
        testing_env!(context);

        let mut contract = Contract::new();

        let account_id: ValidAccountId = BOB_ACCOUNT.try_into().unwrap();

        // prepare test data
        {
            // TODO: any better solution to prepare data?
            contract.create_profile(&account_id);
        }

        contract.update_profile(&account_id, "new description");

        let profile = contract.get_profile_of(&account_id).expect("No profile found");

        assert_eq!(profile.description, "new description");
    }

    #[test]
    fn who_bought_coffee_for_missing_account_id() {
        let mut context = get_context(false);
        testing_env!(context);

        let mut contract = Contract::new();

        let account_id: ValidAccountId = "test".try_into().unwrap();

        let supporters = contract.who_bought_coffee_for(&account_id);

        assert_eq!(supporters.len(), 0);
    }

    #[test]
    fn who_bought_coffee_for_existing_account_id() {
        let mut context = get_context_with_deposit(false, "bob", COFFEE_PRICE);
        testing_env!(context);

        let account_id: ValidAccountId = "alice".try_into().unwrap();

        let mut contract = Contract::new();

        // prepare test data
        {
            contract.create_profile(&account_id);
            contract.buy_one_coffee_for(&account_id);
            contract.buy_one_coffee_for(&account_id);
        }

        let supporters = contract.who_bought_coffee_for(&account_id);

        assert_eq!(supporters.len(), 2);
        assert_eq!(supporters, vec!["bob", "bob"]);
    }
}
