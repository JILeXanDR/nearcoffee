// FIXME: this function is just copy of https://docs.rs/near-sdk-sim/3.0.1/near_sdk_sim/fn.to_yocto.html
// I faced on with a lot of errors "error[E0658]: const generics are unstable" when used create "near-sdk-sim"
pub fn to_yocto(value: &str) -> u128 {
    let vals: Vec<_> = value.split('.').collect();
    let part1 = vals[0].parse::<u128>().unwrap() * 10u128.pow(24);
    if vals.len() > 1 {
        let power = vals[1].len() as u32;
        let part2 = vals[1].parse::<u128>().unwrap() * 10u128.pow(24 - power);
        part1 + part2
    } else {
        part1
    }
}
