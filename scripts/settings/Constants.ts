/**
 * The timestamp for when the club closes
 * This equals to 2:00 AM
 */
export const CLUB_CLOSE_TIME = 7 * 60;

/**
 * The timestamp for when the theater closes. (When it's last showing starts)
 * This equals to 10:00 PM
 */
export const THEATER_CLOSE_TIME = 3 * 60;

/**
 * The timestamp for when the bar closes.
 * This equals to 1:00 AM
 */
export const BAR_CLOSE_TIME = 6 * 60;

/**
 * The amount of minutes per tick.
 */
export const TIMESPEED = 2;

/**
 * The number of cycles for tummy decay to average bladder filling.
 * This prevents the bladder filling exponentially once a lot is drunk.
 */
export const AMOUNT_OF_TUMMY_DECAY_CYCLES = 6;

/**
 * Sets the max value of the random counter.
 */
export const RAND_COUNTER_MAX = 5; // TODO validate if this is still used.