var page = require('webpage').create();
page.open('http://localhost:18190/?_escaped_fragment_=EnteredCharts/', function() {
//page.open('http://dracotal.nodeomega.com/Products', function() {
page.render('example.png');
phantom.exit();
});