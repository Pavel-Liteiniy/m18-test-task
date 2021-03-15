const Id = {
	SUBSCRIBE: `#subscribe`
};

const linkElements = document.querySelectorAll( `a[data-scroll]` );
const inputNameElement = document.querySelector( `#subscribe-name` );


const clickLinkHandler = ( evt ) => {
	evt.preventDefault();

	const targetId = evt.currentTarget.getAttribute( `href` );
	const targetAnchor = document.querySelector( targetId );

	if ( targetAnchor === undefined ) {
		return;
	}

	targetAnchor.scrollIntoView( { behavior: `smooth`, block: `start`, inline: `nearest` } );

	if ( targetId === Id.SUBSCRIBE ) {
		setTimeout(() => inputNameElement.focus(), 1000);
	}
};

linkElements.forEach( ( link ) => {
	link.addEventListener( `click`, clickLinkHandler );
} );
