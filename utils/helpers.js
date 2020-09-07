const moment = require('moment');

module.exports = {
    if_eq: (first_val, second_val) => {
        return first_val === second_val
    },
    format_date: date => {
        return date = moment(date).format('MMMM Do, YYYY');
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }
      return word;
    }
}