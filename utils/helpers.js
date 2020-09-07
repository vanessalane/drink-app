const moment = require('moment');

module.exports = {
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