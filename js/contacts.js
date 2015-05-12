// (C) Copyright 2015 Jon Gunter

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

// Get the contacts from the server and put them into a local array
// We use an API to generate random names and photos
function fetchContactsFromServer(amount) {

	// Set the amount to get if not defined
	// Note: the max the API will let us request at one time is 100
	if(typeof amount == 'undefined') {
		amount = numContacts;
	}

	// Fetch contacts from the server
	$.ajax({
	  	url: 'http://api.randomuser.me/?results=' + amount,
	  	dataType: 'json',
	  	success: function(data){
	  		// Load the data into an array
	    	pageContacts = data;
	    	console.log("Successfuly fetched " + amount + " contacts from the server.")

	    	// Trigger the loading of contacts into the <ul>
	    	loadContacts();

	    	// Hide the loader GIF
	    	$('.bottom-loader').fadeOut();
	  	}
	});
}

// Turn a contact object into a visually appealing contact card
// Takes the contact index (in the pageContacts array) as an argument
function createContactCard(index){

	// Extract the first and last names
	name = pageContacts.results[index].user.name.first + " " + pageContacts.results[index].user.name.last

	// Randomly generate a color fo the contact card
	color = Math.floor(Math.random()*900000)+100000;

	// Form the image for the contact's picture
	image = '<img src="'+pageContacts.results[index].user.picture.thumbnail +'">';

	// Return the HTML contact card
	returnValue = '<li style="background:#'+color+';" class="contact-'+ index + '"><div class="contact-inner">' + image + name + "</div></li>";
	return returnValue;

}

// Adds a contact card to the page
// If the flag isBottom is true (default), it wil add the contact card to the bottom
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

// Initially load the contacts onto the page. This is only called once.
function loadContacts(){
	
	// Cycle through the first 10 (or however many specified) contacts and add them to the page
	for (i = 0; i <= currentBottomContact; i++){
		card = createContactCard(i);
		addToPage(card);
	};

}

// Remove a contact card from the page when new contacts are added
// If isBottom is true, that means we're adding NEW contacts to the BOTTOM
// Thus, this flag removes items from the TOP!
function removeFromPage(index, isBottom) {

	// By default, remove items from the top
	if(isBottom == undefined) {
		isBottom = true;
	}

	// Get the DOM object to remove
	objectToRemove = $('.contacts li.contact-' + index);

	// Remember the scrolling position so we can account for it
	viewTop = $( window ).scrollTop();

	// Remove the contact card
	objectToRemove.remove();

	// Adjust the scrolling to account for the remove contact card
	if(isBottom) {
		$( window ).scrollTop( viewTop - 150 );
	} else {
		$( window ).scrollTop( viewTop + 150 );
	}	
	
}

// When the page is scrollled, add and remove contacts from the page
// The isDown flag determines whether or ot we are scrolling down
function scrollContacts(isDown){

	// If direction is not defined, define it as down 
	if(isDown == undefined) {
		isDown = true;
	}

	// If we're scrolling down..
	if(isDown) {

		// If we're already at the last contact, there's nothing more to do...abandon ship!
		if(currentBottomContact >= numContacts-1) {
			return false;
		}

		// Determine the last contact we should add to the page
		newBottomContact = currentBottomContact + scrollInterval;

		// If the last contact we should add does not exist, load fewer contacts
		if(newBottomContact >= numContacts-1){
			newBottomContact = numContacts-1;
		}

		// For every contact that we're going to add, create a contact card and add it to the page
		for (i = currentBottomContact + 1; i <= newBottomContact; i++) {
			card = createContactCard(i);
			addToPage(card);
		}

		// Keep track of the bottom contact
		currentBottomContact = newBottomContact;

		// Remove contacts from top of page and keep track of the new top contact
		newTopContact = currentTopContact + scrollInterval;
		for(i = currentTopContact; i < newTopContact; i++) {
			removeFromPage(i);
		}
		currentTopContact = newTopContact;

	} else {
		// If we're srolling up...
		
		// If there's no more contacts above our current position, don't do anything 
		if(currentTopContact == 0) {
			return false;
		}

		// Determine the new top contact we need to add (and then fill in the difference)
		newTopContact = currentTopContact - scrollInterval;

		// If the top contact does not exist, just make it the first one in the result set
		if(newTopContact < 0) {
			newTopContact = 0;
		}

		// Create a contact card and add it to the page
		for (i = currentTopContact - 1; i >= newTopContact; i--) {
			card = createContactCard(i);
			addToPage(card, false);
		}
		currentTopContact = newTopContact;

		// Remove contact cards from the bottom of the page
		newBottomContact = currentBottomContact - scrollInterval;
		for(i = currentBottomContact; i > newBottomContact; i--) {
			removeFromPage(i, false);
		}
		currentBottomContact = newBottomContact;

	}

}

// On load, get all the contacts from the server
$(document).ready(function(){
	fetchContactsFromServer();
})

// On scrolling, load more contacts
$(window).scroll(function(){

	// On scrolling down, add more contacts to bottom
    if  ($(window).scrollTop() == $(document).height() - $(window).height()){
			scrollContacts();
			console.log("Adding contacts to bottom triggered.")
    }

    // On scrolling up, add more contacts to the top
    if(currentTopContact > 0 && $(window).scrollTop() < 10){
    	scrollContacts(false);
    	console.log("Adding contacts to top triggered.")
    }
});