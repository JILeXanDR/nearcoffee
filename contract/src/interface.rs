use near_sdk::AccountId;
use near_sdk::json_types::ValidAccountId;

use crate::CoffeePrice;
use crate::profile::Profile;

/// It describes public interface needs to be implemented by contract.
pub trait CoffeeForEveryone {
    /// Buys one coffee for given account_id.
    /// It's required to attach some amount of NEARs stated in COFFEE_PRICE constant.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id we want to buy a coffee
    /// * `count` - TODO: make it possible to choose count.
    /// * `message` - TODO: add optional message
    fn buy_one_coffee_for(&mut self, account_id: &ValidAccountId);

    /// Returns list of accounts who bought a coffee for account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id we want to get his supporters
    fn who_bought_coffee_for(&self, account_id: &ValidAccountId) -> Vec<AccountId>;

    /// Creates a new profile for given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id TODO: isn't better to use env::predecessor_account_id() since we don't need to create profile for someone else?
    fn create_profile(&mut self, account_id: &ValidAccountId) -> Profile;

    /// Updates a profile by given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id is associated with profile wanted to be updated TODO: isn't better to use env::predecessor_account_id() since we can update only our profile?
    /// * `description` - new text string which describes a given profile
    /// * `coffee_price` - new price per cap of coffee
    fn update_profile(&mut self, account_id: &ValidAccountId, description: String, coffee_price: CoffeePrice);

    /// Returns a profile by given account_id.
    ///
    /// # Arguments
    ///
    /// * `account_id` - NEAR account id is associated with profile (eq: bob.near)
    fn get_profile_of(&self, account_id: &ValidAccountId) -> Option<Profile>;

    /// It transfers all NEARs given by supporters.🤑
    fn swap_coffee(&mut self);
}

/// It describes public interface but accessible only by contract owner.
pub trait Ownership {
    /// Transfers all fees received by contract into account of contract owner.
    /// Since in current implementation there is no separated "fees" it just transfers all existing NEARs stored on the wallet.
    ///
    /// # Attention: in current implementation action can't be performed until balance of all profiles become zero.
    ///
    fn withdraw_fees(&mut self);
}
