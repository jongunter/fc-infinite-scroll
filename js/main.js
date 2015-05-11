// Number of contacts to show initally
var numberToShow = 10;

// The maximum number of contacts to display on the page at one time
var maxContacts = 20;

// The ID of the contac that's at the top of the page
var currentTopContact = 0;

// The ID of the contact at the bottom of the page
var currentBottomContact = 0;

// Number of contacts currently dipslayed on the page
var numVisible = 0;

// The container used for infinite scrolling
var scrollingContainer = $('ul.contacts');

// The number of contacts available 
var numContacts = pageContacts.length;




// When passed a contact ID number (index), makes it into a properly-formatted contact card for the scrolling container
function makeContactCard(id){

	// Fetch the contact display information
	contactDetails = getContactInfo(id);
	name = contactDetails.name;

	// Determine the odd/even row to give rows different colors
	rowClass = "odd";
	if(id % 2 == 0){
		rowClass = "even";
	}

	// Build the contact card and return it
	color = 
	returnValue = '<li style="background:class="new contact-'+ id +' '+ rowClass +'">' + name + "</li>";
	return returnValue;
}

// Adds contact cards to the page when given an array of contacts
function addContactCards(contacts, addToBottom) {

	// Define default parameters
	if(typeof addToBottom == 'undefined'){
		addToBottom = true;
	}

	// Since we're adding contacts to the page in a certain order, reverse it if we're scrollin gup
	if(!addToBottom){
		contacts.reverse();
	}

	// For each contact
	contacts.forEach(function(element, index, array){
		
		// Build the contact card
		cardToAdd = makeContactCard(index);

		// Add to page
		if(addToBottom){
			scrollingContainer.append(cardToAdd);


		} else {
			scrollingContainer.prepend(cardToAdd);
		}

	});

	// Animate the new contacts sliding in
	$("ul.contacts li.new").slideDown()
	$("ul.contacts li.new").removeClass("new");

}


function loadContacts(isDown){

	// If no direction is specified, we're goin' down by default
	if (typeof isDown == 'undefined') {
		isDown = true;
	}

	// If there's nothing loaded, let's load some of those contacts!
	if (numVisible == 0) {
		contactsToAdd = getContacts();
	} else if(down) {
		// Load contacts going down
		contactsToAdd = getContacts(currentBottomContact, isDown);
	} else {
		// Load contacts going up
		contactsToAdd = getContacts(currentTopContact, isDown);
	}

	return contactsToAdd;

}



function scrollDown(){



}

function initInfoBox(){
	infoBoxList = $("div.debug-info ul.contacts-info");

	pageContacts.forEach(function(element, index, array){
		infoBoxList.append(makeContactCard(index));
	});

	updateInfoBox();
}

function updateInfoBox(){

	pageContacts.forEach(function(element, index, array){
		elementToCheck = $("ul.contacts .contact-" + index);
		if(elementToCheck.length){
			$("div.debug-info .contact-" + index).addClass("on-page");
		} else {
			$("div.debug-info .contact-" + index).removeClass("on-page");
		}

	});

}


$(document).ready(function(){
 
	contacts = loadContacts();
	addContactCards(contacts);
	

})


$(window).scroll(function(){
        if  ($(window).scrollTop() == $(document).height() - $(window).height()){
        	//scrollDown();
        	//updateInfoBox();
        }


});
