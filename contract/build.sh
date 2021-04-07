#!/bin/bash
set -e

# https://github.com/near/near-sdk-rs#building-rust-contract
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../out
cp target/wasm32-unknown-unknown/release/*.wasm ../out/
