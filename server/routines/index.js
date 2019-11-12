const emailing = require('./emailing');

async function initRoutines() {
	emailing.init();
}

module.exports = {
	initRoutines,
	emailing
};
