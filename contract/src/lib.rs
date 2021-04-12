#![allow(warnings, unused)]

use std::convert::TryInto;

use near_sdk::{AccountId, Balance, env, log, near_bindgen, PanicOnDefault, Promise, setup_alloc};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::ValidAccountId;
use near_sdk::serde::{Deserialize, Serialize};

use crate::coffee::CoffeePrice;
use crate::interface::{CoffeeForEveryone, Ownership};
use crate::profile::{DEFAULT_DESCRIPTION, Profile};

mod profile;
mod utils;
mod interface;
mod coffee;

setup_alloc!();

// it's an account who buys a coffee
type SupporterId = AccountId;

// it's an account of profile who receives a coffee
type ProfileId = AccountId;

// TODO: not implemented yet
// Contract gets 1% fees for each withdraw.
const APP_WITHDRAW_FEES_PERCENT: u8 = 1;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
// It describes fields are used as a state of our contract.
struct Contract {
    // this is an account who owns this contract
    // and he's endowed with extended access rights (see Ownership trait)
    owner_id: AccountId,
    // profiles are customized NEAR accounts can receive a coffee
    profiles: UnorderedMap<AccountId, Profile>,
    // list of all supports
    supporters: UnorderedMap<ProfileId, Vec<SupporterId>>,
}

#[near_bindgen]
impl Contract {
    #[init]
    /// It inits new state and assigns owner_id as contract owner.
    /// In addition in creates profile for contract owner (the same as other could have).
    /// Be aware you can't change contract owner.
    pub fn new(owner_id: &ValidAccountId) -> Self {
        let mut instance = Self {
            owner_id: owner_id.to_string(),
            profiles: UnorderedMap::new(b"proriles".to_vec()),
            supporters: UnorderedMap::new(b"supporters".to_vec()),
        };

        // create profile for owner
        instance.create_profile(owner_id);

        instance
    }
}

#[near_bindgen]
impl CoffeeForEveryone for Contract {
    #[payable]
    fn buy_one_coffee_for(&mut self, account_id: &ValidAccountId) {
        let supporter: SupporterId = env::predecessor_account_id();
        let attached_deposit: Balance = env::attached_deposit();

        let mut profile: Profile = self.get_profile_of(account_id)
            .expect(format!("Account {} is not connected to our platform and can't be a receiver of a coffee", account_id).as_str());

        assert_eq!(attached_deposit, profile.coffee_price, "Attached deposit is different then price of single cap of coffee");

        // update profile balance
        profile.balance += attached_deposit;

        let mut supporters = self.get_supporters_of(&profile.account_id);

        supporters.push(supporter.clone());

        // update state
        self.profiles.insert(account_id.as_ref(), &profile);
        self.supporters.insert(account_id.as_ref(), supporters.as_ref());

        log!("Account {} bought 1 coffee for {}", supporter, account_id);
    }

    fn who_bought_coffee_for(&self, account_id: &ValidAccountId) -> Vec<AccountId> {
        self.get_supporters_of(account_id.as_ref())
    }

    fn create_profile(&mut self, account_id: &ValidAccountId) -> Profile {
        let account_id: &AccountId = account_id.as_ref();

        let profile = match self.profiles.get(account_id) {
            Some(_) => panic!("Account {} already exists", account_id),
            None => Profile::new(account_id.clone(), DEFAULT_DESCRIPTION.to_string())
        };

        self.profiles.insert(account_id, &profile);

        log!("Created new profile by {}", &account_id);
        profile
    }

    fn update_profile(&mut self, account_id: &ValidAccountId, description: String, coffee_price: CoffeePrice) {
        let mut profile = self.get_profile_of(&account_id).expect("No profile found");

        profile.description = description.to_string();
        profile.coffee_price = coffee_price.to_balance();

        self.profiles.insert(account_id.as_ref(), &profile);
    }

    fn get_profile_of(&self, account_id: &ValidAccountId) -> Option<Profile> {
        self.profiles.get(account_id.as_ref())
    }

    fn swap_coffee(&mut self) {
        let account_id: ValidAccountId = env::predecessor_account_id().try_into().unwrap();

        let mut profile = self.get_profile_of(&account_id).expect(format!("Profile associated with account {} not found", account_id).as_str());

        assert!(profile.balance > 0, "Your balance is not enough to make withdraw");

        // TODO: how to handle promises?
        Promise::new(profile.account_id.clone())
            .transfer(profile.balance);

        log!("Profile {} swaps all his coffee into {} NEARs.", &profile.account_id, &profile.balance);

        profile.balance = 0;
        self.profiles.insert(&profile.account_id, &profile);
    }
}

#[near_bindgen]
impl Ownership for Contract {
    fn withdraw_fees(&mut self) {
        let account_id = env::predecessor_account_id();

        assert_eq!(account_id, self.owner_id, "Can be called only by contract owner");

        let unswap_coffee_balance: Balance = self.get_unswap_coffee_balance();

        assert_eq!(unswap_coffee_balance, 0, "Fees can't be withdrawn until all profiles take their money ({})", unswap_coffee_balance);

        let fees: Balance = CoffeePrice::Default.to_balance() * 10;

        // FIXME:
        Promise::new(account_id.clone()).transfer(fees);

        log!("Contract owner {} withdrawn fees {}", account_id, fees);
    }
}

// Let's organize all private methods inside separated contract implementation.
impl Contract {
    fn get_supporters_of(&self, account_id: &AccountId) -> Vec<SupporterId> {
        let buyers: Vec<SupporterId> = self.supporters
            .get(account_id)
            .map_or_else(|| vec![], |v| v);
        buyers
    }

    fn get_unswap_coffee_balance(&self) -> Balance {
        self.profiles.iter().map(|(_, profile)| profile.balance).sum()
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

    const DEFAULT_ACCOUNT: &str = "default";
    const BOB_ACCOUNT: &str = "bob";
    const ALICE_ACCOUNT: &str = "alice";
    const OWNER_ACCOUNT: &str = "owner";

    fn get_context(is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(prepare_account(DEFAULT_ACCOUNT))
            .is_view(is_view)
            .build()
    }

    fn get_context_with_deposit(is_view: bool, account_id: &str, deposit: Balance) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(prepare_account(account_id))
            .is_view(is_view)
            .attached_deposit(deposit)
            .build()
    }

    fn get_context_with_signer(is_view: bool, account_id: &str) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(prepare_account(account_id))
            .is_view(is_view)
            .build()
    }

    fn prepare_account(id: &str) -> ValidAccountId {
        id.try_into().unwrap()
    }

    fn prepare_contract() -> Contract {
        Contract::new(&prepare_account(OWNER_ACCOUNT))
    }

    #[test]
    fn check_owner_profile() {
        let context = get_context(false);
        testing_env!(context);

        let mut contract = prepare_contract();

        let owner_profile = contract.get_profile_of(&prepare_account(OWNER_ACCOUNT))
            .expect("Profile not found");

        assert_eq!(owner_profile.account_id, OWNER_ACCOUNT);
    }

    #[test]
    fn create_profile_using_new_account_id() {
        let context = get_context(false);
        testing_env!(context);

        let mut contract = prepare_contract();

        let alice_account_id: ValidAccountId = prepare_account(ALICE_ACCOUNT);
        let created_profile = contract.create_profile(&alice_account_id);

        assert_eq!(created_profile, Profile {
            account_id: ALICE_ACCOUNT.to_string(),
            description: "new member of community".to_string(),
            coffee_price: CoffeePrice::Default.to_balance(),
            balance: 0,
        });

        let found_profile = contract.get_profile_of(&alice_account_id)
            .expect("Could not find created profile in the state");

        assert_eq!(created_profile, found_profile);
    }

    #[test]
    #[should_panic(expected = "Account alice is not connected to our platform")]
    fn buy_one_coffee_for_missing_account_id() {
        let context = get_context_with_deposit(false, BOB_ACCOUNT, CoffeePrice::Default.to_balance());
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        let account_id: ValidAccountId = ALICE_ACCOUNT.to_string().try_into().unwrap();

        contract.buy_one_coffee_for(&account_id);
    }

    #[test]
    fn buy_one_coffee_for_existing_account_id() {
        let context = get_context_with_deposit(false, BOB_ACCOUNT, CoffeePrice::Default.to_balance());
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

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

        assert_eq!(profile.balance, CoffeePrice::Default.to_balance());
    }

    #[test]
    #[should_panic(expected = "Attached deposit is different then price of single cap of coffee")]
    fn buy_one_coffee_with_wrong_attached_deposit() {
        // 0.3 NEARs is more then price of coffee
        let too_big_deposit: Balance = to_yocto("0.3");

        let context = get_context_with_deposit(false, BOB_ACCOUNT, too_big_deposit);
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        // receiver for coffee
        let account_id: ValidAccountId = prepare_account(ALICE_ACCOUNT);

        contract.create_profile(&account_id);

        contract.buy_one_coffee_for(&account_id);
    }

    #[test]
    fn update_profile() {
        let mut context = get_context_with_signer(false, BOB_ACCOUNT);
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        let bob_account_id: ValidAccountId = prepare_account(BOB_ACCOUNT);

        // prepare test data
        {
            contract.create_profile(&bob_account_id);
        }

        contract.update_profile(&bob_account_id, "new description".to_string(), CoffeePrice::Default);

        let profile = contract.get_profile_of(&bob_account_id)
            .expect("No profile found");

        assert_eq!(profile.description, "new description");
    }

    #[test]
    fn who_bought_coffee_for_missing_account_id() {
        let mut context = get_context(false);
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        let account_id: ValidAccountId = prepare_account("test");

        let supporters = contract.who_bought_coffee_for(&account_id);

        assert_eq!(supporters.len(), 0);
    }

    #[test]
    fn who_bought_coffee_for_existing_account_id() {
        let mut context = get_context_with_deposit(false, BOB_ACCOUNT, CoffeePrice::Default.to_balance());
        testing_env!(context);

        let account_id: ValidAccountId = prepare_account(ALICE_ACCOUNT);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        // prepare test data
        {
            contract.create_profile(&account_id);
            contract.buy_one_coffee_for(&account_id);
            contract.buy_one_coffee_for(&account_id);
        }

        let supporters = contract.who_bought_coffee_for(&account_id);

        assert_eq!(supporters, vec!["bob", "bob"]);
    }

    #[test]
    fn update_profile_coffee_price() {
        let mut context = get_context_with_signer(false, BOB_ACCOUNT);
        testing_env!(context);

        let mut contract = Contract::new(&prepare_account(OWNER_ACCOUNT));

        let account_id: ValidAccountId = prepare_account(ALICE_ACCOUNT);

        let created_profile = contract.create_profile(&account_id);

        // let's make coffee price as 10 NEAR
        contract.update_profile(&account_id, created_profile.description, CoffeePrice::Custom(10_000_000_000_000_000_000_000_000));

        let found_profile = contract.get_profile_of(&account_id)
            .expect("Profile not found");

        assert_eq!(found_profile, Profile {
            account_id: ALICE_ACCOUNT.to_string(),
            description: DEFAULT_DESCRIPTION.to_string(),
            coffee_price: 10_000_000_000_000_000_000_000_000,
            balance: 0,
        });
    }
}
