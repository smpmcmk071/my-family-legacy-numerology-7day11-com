// Blackjack game constants
export const STARTING_BALANCE = 1000;
export const BLACKJACK_MULTIPLIER = 2.5;
export const MINIMUM_BET = 10;

// Rebalance tuning
export const RESHUFFLE_THRESHOLD = 10; // reshuffle the shoe when fewer than this many cards remain
export const ACE_VALUE = 11; // cards whose reduced value is 2 count as a flexible ace (11 or 1)
export const ACE_REDUCE_TRIGGER = 2; // reduced_value === 2 marks a card as an ace
export const NATURAL_TARGET = 21; // two-card total that counts as a natural blackjack
export const DEALER_STAND = 16; // dealer stands on hard 16+ (hits soft 17)