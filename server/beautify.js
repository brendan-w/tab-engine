
module.exports = function(tab) {
	
	tab = tab.replace(/-\|\|-/g, '─┼┼─');

	tab = tab.replace(/-\|-/g,   '─┼─');

	tab = tab.replace(/-\|\|/g, '─┼┤');
	tab = tab.replace(/\|\|-/g, '├┼─');

	tab = tab.replace(/-\|/g, '─┤');
	tab = tab.replace(/\|-/g, '├─');
	tab = tab.replace(/-/g, '─');

	return tab;
};
