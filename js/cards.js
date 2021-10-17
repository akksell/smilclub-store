// create card object
function Card(el) {
	this.getElementClass = el;
	this.getElementParent = el.parentElement;

	// create draggable cards on screen
	// should only be first card
	this.startCardMovement = function() {
		var mousePosition;
		var offset = [0,0];
		var isDown = false;

		// functions handle mouse movement/touch input
		function checkMouseBtnDown() {
			e = window.event;
			isDown = true;
			offset = [
			    el.offsetLeft - e.clientX,
			    el.offsetTop - e.clientY
			];
		}

		function checkTouchStart() {
			e = window.event;
			var touchPoints = e.changedTouches[0];
			isDown = true;
			offset = [
			    el.offsetLeft - parseInt(touchPoints.clientX),
			    el.offsetTop - parseInt(touchPoints.clientY)
			];
			e.preventDefault();
		}

		function checkMouseBtnUp() {
			isDown = false;
			return isDown;
		}

		function onMouseMove() {
			event.preventDefault();
 		    if (isDown) {
			    if (event.type == 'mousemove') {
	 			   mousePosition = {

	 				  x : event.clientX,
	 				  y : event.clientY

	 			   };
			   } else {
				   mousePosition = {

					  x : parseInt(event.changedTouches[0].clientX),
					  y : parseInt(event.changedTouches[0].clientY)

				   };
			   }

 			   el.style.left = (mousePosition.x + offset[0]) + 'px';
 			   el.style.top  = (mousePosition.y + offset[1]) + 'px';

 			   // check if top of card is over navbar
 			   // block card from moving further up if true
 			   maxPosY = document.querySelector(
 				   '.navbar').getBoundingClientRect().bottom;
 			   minPosY = window.innerHeight;
 			   elementTop = el.getBoundingClientRect().top;
 			   elementBot = el.getBoundingClientRect().bottom;
 			   parentTop = el.parentElement.getBoundingClientRect().top;
 			   parentBot = el.parentElement.getBoundingClientRect().bottom;

 			   if (elementTop <= maxPosY) {
 				   el.style.top = -(parentTop - maxPosY) + 'px';
 			   } else if (elementBot >= minPosY) {
 				   el.style.top = -(parentBot - minPosY) + 'px';
 			   }

 			   var leftBound = document.documentElement.clientWidth * 0.25; // 25% of viewport
 		   		var rightBound = document.documentElement.clientWidth * 0.75; // 75% of viewport

 				var parent = el.parentElement;
 				var container = parent.parentElement;

 		   		elememtLeftPosX = el.getBoundingClientRect().left;
 		    		elementRightPosX = el.getBoundingClientRect().right;

 		   		if (elementRightPosX < leftBound) {  // check if hitting left side
 		   			var leaveAnimation = el.animate([
 		   				// keyframes
 		   				{ opacity: 1 },
 		   				//{ transform: 'translateX(-50%)' },
 		   				{ opacity: 0 },
 		   				{ transform: 'translateX(-110%)' },
 		   				{ opacity: 0 }
 		   			], {
 		   				// timing options
 		   				duration: 1000,
 		   				easing: "ease-in-out"
 		   			});

 		   			leaveAnimation.onfinish = function() {
 		   				el.style.opacity = 0;
 		   				container.removeChild(parent);
 		   				el.style.top = '0px';
 		   				el.style.left = '0px';
 		   				container.appendChild(parent);

 		   				var enterAnimation = el.animate([
 		   					// keyframes
 		   					{ opacity: 0 },
 		   					{ top: '15px' },
 		   					{ transform: 'translateY(-15px)' },
 		   					{ opacity: 1 }
 		   				], {
 		   					// timing options
 		   					duration: 1000,
 		   					easing: "ease-in-out"
 		   				});

 		   				el.style.opacity = 1;

 		   			};

 		   			//return 0; // success (hit boundary)

 		   		} else if (elememtLeftPosX > rightBound) {  // check if hitting right side
 		   			var leaveAnimation = el.animate([
 		   				// keyframes
 		   				// weird fix so that el properly fades
 		   				// off screen (percentages are positive version
 		   				// of the ones used for the left side)
 		   				{ opacity: 1 },
 		   				//{ transform: 'translateX(50%)' },
 		   				{ opacity: 0 },
 		   				{ transform: 'translateX(110%)' },
 		   				{ opacity: 0 }
 		   			], {
 		   				// timing options
 		   				duration: 1000,
 		   				easing: "ease-in-out"
 		   			});

 		   			leaveAnimation.onfinish = function() {
 		   				// want to remove the element and put
 		   				// at the very end of the parent
 		   				el.style.opacity = 0;
 		   				container.removeChild(parent);
 		   				el.style.top = '0px';
 		   				el.style.left = '0px';
 		   				container.appendChild(parent);

 		   				var enterAnimation = el.animate([
 		   					// keyframes
 		   					{ opacity: 0 },
 		   					{ top: '15px' },
 		   					{ transform: 'translateY(-15px)' },
 		   					{ opacity: 1 }
 		   				], {
 		   					// timing options
 		   					duration: 1000,
 		   					easing: "ease-in-out"
 		   				});

 		   				el.style.opacity = 1;

 		   			};
 		   		}
 		    }

		}

		// non-mobile events
		el.addEventListener('mousedown', checkMouseBtnDown, true);
		document.addEventListener('mouseup', checkMouseBtnUp, true);
		document.addEventListener('mousemove', onMouseMove, true);

		// mobile events
		el.addEventListener('touchstart', checkTouchStart, true);
		document.addEventListener('touchend', checkMouseBtnUp, true);
		document.addEventListener('touchmove', onMouseMove, true);


	}

	// disable card movement
	// TODO: add functionality to this and make sure cards objects that
	// call this method can no longer move
	this.disableCardMovement =  function() {
		// non-mobile events
		el.removeEventListener('mousedown', this.checkMouseBtnDown, true);
		document.removeEventListener('mouseup', this.checkMouseBtnUp, true);
		document.removeEventListener('mousemove', this.onMouseMove, true);

		// mobile events
		el.removeEventListener('touchstart', this.checkTouchStart, true);
		document.removeEventListener('touchend', this.checkMouseBtnUp, true);
		document.removeEventListener('touchmove', this.onMouseMove, true);
	}

	// flip card to reveal product info
	// TODO: create flip animation and add inner html content (more
	// product info + buy button)
	this.flipCard = function() {
		throw "Not implemented";
	}

}

// initialization
// make first card moveable and restrict movement of successive cards
var deckNode = document.querySelector(".card-deck");
var cardNodes = deckNode.querySelectorAll(".card");
var numCardNodes = cardNodes.length;
var maxZIndex = numCardNodes + 1;

//let deck = new Deck();

// make sure first card takes presedence over other cards
// don't draw elements in other cards other than first card
window.addEventListener('load', (event) => {
	for (i = 0; i < numCardNodes; i++) {
		cardNodes[i].style.zIndex = maxZIndex;
		maxZIndex--;

		cardNodes[i].setAttribute('id', 'card-num-' + i);

		//deck.addCard(cardNodes[i]);

		if (i > 0) {
			//cards[i].parentElement.style.position = 'absolute';
			cardNodes[i].style.border = '1px solid #FAB81E';

			var cardElements = cardNodes[i].children;
			for (var j = 0; j < cardElements.length; j++) {
				cardElements[j].style.opacity = 0;
			}
		}
	}
	let card1 = new Card(cardNodes[0]);
	card1.startCardMovement();
	console.log('page loaded');

	setTimeout(5000, card1.disableCardMovement());
});





//cards[0].enableCardMovement();
