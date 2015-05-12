// BEGIN SETTINGS

// The max number of contacts allowed in the DOM at one time
var maxContacts = 11;

// The nubmer of contacts that will be in the mock system
var numContacts = 100;

//END SETTINGS: Do not touch the below variables

var currentTopContact = 0;
var currentBottomContact = maxContacts - 1;
var scrollInterval = 5;

// This array will be filled with the contacts once they're loaded
var pageContacts;



// Get the contacts from the serverr 
function fetchContactsFromServer(amount) {

	// Set the amount if not defined
	if(typeof amount == 'undefined') {
		amount = numContacts;
	}

	// Fetch contacts from the server
	$.ajax({
	  	url: 'http://api.randomuser.me/?results=' + amount,
	  	dataType: 'json',
	  	success: function(data){
	    	pageContacts = data;
	    	console.log("Successfuly fetched " + amount + " contacts from the server.")
	    	loadContacts();
	    	$('.bottom-loader').fadeOut();
	  	}
	});
}

// Turn a contact object into a visually appealing contact card
// Taxes the contact index as an argument
function createContactCard(index){

	name = pageContacts.results[index].user.name.first + " " + pageContacts.results[index].user.name.last

	//color = "#" + pageContacts.results[index].user.location.zip + "0"
	color = Math.floor(Math.random()*900000)+100000;
	image = '<img src="'+pageContacts.results[index].user.picture.thumbnail +'">'

	rowClass = "odd"
	returnValue = '<li style="background:#'+color+';" class="contact-'+ index +' '+ rowClass +'"><div class="contact-inner">' + image + name + "</div></li>";
	return returnValue;

}

// Adds a contact card to the page
function addToPage(html, isBottom){

	// If location on the page is not defined, define it as the bottom
	if(isBottom == undefined) {
		isBottom = true;
	}
	
	// Add the contact card html to the page
	if( isBottom ){
		// If bottom, append contact card to the bottom
		$("ul.contacts").append(html);
	} else {
		//If top, prepend the contact card to the top
		$("ul.contacts").prepend(html);
	}

}

// Initially load the contacts onto the page
function loadContacts(){
	
	// Cycle through the first 10 contacts and add them to the page
	for (i = 0; i <= currentBottomContact; i++){
		card = createContactCard(i);
		addToPage(card);
	};
	$('.contacts li.new').fadeIn(function(){
		$(this).removeClass("new");
	});

}

function removeFromPage(index, isBottom) {

	if(isBottom == undefined) {
		isBottom = true;
	}

	objectToRemove = $('.contacts li.contact-' + index);

	viewTop = $( window ).scrollTop();
	objectToRemove.remove();

	if(isBottom) {
		$( window ).scrollTop( viewTop - 150 );
	} else {
		$( window ).scrollTop( viewTop + 150 );
	}
 	
	
}

function updateSpacerBox(isBigger){

	if(isBigger == undefined){
		isBigger = true;
	}

	newHeight = 122*currentTopContact + 20 + 366;

	if(isBigger){
		newHeight += 122;
	}

	$(".spacer").css("height", newHeight + "px")
}

// When the page is scrollled, add and remove contacts from the page
function scrollContacts(isDown){

	// If direction is not defined, define it as down 
	if(isDown == undefined) {
		isDown = true;
	}

	if(isDown) {

		if(currentBottomContact >= numContacts-1) {
			return false;
		}

		// Add to bottom of page
		newBottomContact = currentBottomContact + scrollInterval;

		if(newBottomContact >= numContacts-1){
			newBottomContact = numContacts-1;
		}

		for (i = currentBottomContact + 1; i <= newBottomContact; i++) {
			card = createContactCard(i);
			addToPage(card);
		}
		currentBottomContact = newBottomContact;

		// Remove from top of page
		newTopContact = currentTopContact + scrollInterval;
		for(i = currentTopContact; i < newTopContact; i++) {
			removeFromPage(i);
		}
		currentTopContact = newTopContact;

	} else {

		if(currentTopContact == 0) {
			return false;
		}

		// Add to top of page
		newTopContact = currentTopContact - scrollInterval;

		if(newTopContact < 0) {
			newTopContact = 0;
		}

		for (i = currentTopContact - 1; i >= newTopContact; i--) {
			card = createContactCard(i);
			addToPage(card, false);
		}
		currentTopContact = newTopContact;

		// Remove from top of page
		newBottomContact = currentBottomContact - scrollInterval;
		for(i = currentBottomContact; i > newBottomContact; i--) {
			removeFromPage(i, false);
		}
		currentBottomContact = newBottomContact;

	}

}

$(document).ready(function(){
	fetchContactsFromServer();
})

$(window).scroll(function(){
    if  ($(window).scrollTop() == $(document).height() - $(window).height()){
			scrollContacts();
			console.log("Adding contacts to bottom triggered.")
    }

    if(currentTopContact > 0 && $(window).scrollTop() < 10){
    	scrollContacts(false);
    	console.log("Adding contacts to top triggered.")
    }
});