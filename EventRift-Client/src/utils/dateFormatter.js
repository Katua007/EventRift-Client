import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin for "2 days ago" type formatting
dayjs.extend(relativeTime);

/**
 * Formats a date string into a readable format.
 * @param {string | Date} date The date string or Date object.
 * @param {string} format The format string (e.g., 'MMM D, YYYY [at] h:mm A').
 * @returns {string} The formatted date string.
 */
export const formatDate = (date, format = 'MMM D, YYYY [at] h:mm A') => {
    if (!date) return 'N/A';
    return dayjs(date).format(format);
};

/**
 * Calculates the time from now (e.g., "3 hours ago" or "in 2 days").
 * @param {string | Date} date The date string or Date object.
 * @returns {string} The relative time string.
 */
export const timeFromNow = (date) => {
    if (!date) return '';
    return dayjs(date).fromNow();
};