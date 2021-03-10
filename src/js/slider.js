const data = [
	{
		description: `Оранжерея в&nbsp;стиле джунглей для&nbsp;любителей цветочков`,
		src: {
			x1: `/img/slider-1@1x.jpg`,
			x2: `/img/slider-1@2x.jpg`
		},
		size: {
			width: 750,
			height: 500
		}
	},
	{
		description: `Кафельная плитка в&nbsp;ванной комнате в&nbsp;скандинавском стиле`,
		src: {
			x1: `/img/slider-2@1x.jpg`,
			x2: `/img/slider-2@2x.jpg`
		},
		size: {
			width: 750,
			height: 500
		}
	},
	{
		description: `Рай воплоти для&nbsp;любителей Икеи и бирюзовых тонов`,
		src: {
			x1: `/img/slider-3@1x.jpg`,
			x2: `/img/slider-3@2x.jpg`
		},
		size: {
			width: 750,
			height: 500
		}
	}
];

const RenderPosition = {
	AFTERBEGIN: `afterbegin`,
	BEFOREEND: `beforeend`
};

const SwitchSlideDirection = {
	FORWARD: `next`,
	BACKWARD: `previous`
};

const container = document.querySelector( `.slider__wrapper` );
let selectedSlideNumber = 1;

const createElement = ( template ) => {
	const newElement = document.createElement( `div` );
	newElement.innerHTML = template;
	return newElement.firstChild || ``;
};

const createSlide = ( { description, src, size }, slideNumber ) => {
	const imageExtensionRegExp = /\.\w+$/i;
	const imageExtensionWebP = `.webp`;

	return `<li class="slider__item${slideNumber === selectedSlideNumber ? ` slider__item--current` : ``}">
						<p class="slider__description">${description}</p>
						<picture>
							<source
								type="image/webp"
								srcset="
									${src.x2.replace( imageExtensionRegExp, imageExtensionWebP )} 2x,
									${src.x1.replace( imageExtensionRegExp, imageExtensionWebP )} 1x
								"
							/>
							<img
								class="slider__image"
								src="${src.x1}"
								srcset="${src.x2} 2x"
								loading="lazy"
								width="${size.width}"
								height="${size.height}"
								alt="${description}"
							/>
						</picture>
					</li>`;
};

const createSlider = ( slides ) => {
	return `<div class="slider__content">
						<ul class="slider__list" style="transform: translateX(-${selectedSlideNumber * 100}%);">
						${slides.map( ( slide, index ) => createSlide( slide, index ) ).join( `` )}
						</ul>
						<div class="slider__controls">
							<button
								class="slider__button slider__button--previous"
								aria-label="Предыдущий слайд"
								${selectedSlideNumber === 0 ? ` disabled` : ``}
								data-button-switch-slide-direction="${SwitchSlideDirection.BACKWARD}"
							></button>
							<button
								class="slider__button slider__button--next"
								aria-label="Следующий слайд"
								${selectedSlideNumber === ( slides.length - 1 ) ? ` disabled` : ``}
								data-button-switch-slide-direction="${SwitchSlideDirection.FORWARD}"
							></button>
						</div>
					</div>`;
};

class Slider {
	constructor( container, slides ) {
		this._element = null;
		this._slideListElement = null;
		this._data = slides;
		this._container = container;
	}

	getTemplate() {
		return createSlider( this._data );
	}

	getElement() {
		this._element = this._element ? this._element : createElement( this.getTemplate() );
		return this._element;
	}

	render( containerElement = this._container, childElement = this.getElement(), position = RenderPosition.BEFOREEND ) {
		switch ( position ) {
		case RenderPosition.AFTERBEGIN:
			containerElement.prepend( childElement );
			break;
		case RenderPosition.BEFOREEND:
			containerElement.append( childElement );
			break;
		}
	}

	_changeSlideHandler = ( evt ) => {
		evt.preventDefault();

		const selectedDirection = evt.target.dataset.buttonSwitchSlideDirection;

		if ( selectedDirection === SwitchSlideDirection.BACKWARD && selectedSlideNumber === 0 ) {
			evt.target.disabled = true;
			return;
		}

		if ( selectedDirection === SwitchSlideDirection.FORWARD && selectedSlideNumber === ( this._data.length - 1 ) ) {
			evt.target.disabled = true;
			return;
		}

		const selectedSlide = this._slideListElement.querySelector( `.slider__item--current` );

		switch ( selectedDirection ) {
		case SwitchSlideDirection.FORWARD:
			selectedSlideNumber++;

			evt.target.disabled = selectedSlideNumber === ( this._data.length - 1 ) ? true : false;
			evt.currentTarget.querySelector( `.slider__button[data-button-switch-slide-direction="${SwitchSlideDirection.BACKWARD}"]` ).disabled = false;

			this._slideListElement.style.transform = `translateX(-${selectedSlideNumber * 100}%)`;

			selectedSlide.classList.remove( `slider__item--current` );
			selectedSlide.nextSibling.classList.add( `slider__item--current` );
			break;
		case SwitchSlideDirection.BACKWARD:
			selectedSlideNumber--;

			evt.target.disabled = selectedSlideNumber === 0 ? true : false;
			evt.currentTarget.querySelector( `.slider__button[data-button-switch-slide-direction="${SwitchSlideDirection.FORWARD}"]` ).disabled = false;

			this._slideListElement.style.transform = `translateX(-${selectedSlideNumber * 100}%)`;

			selectedSlide.classList.remove( `slider__item--current` );
			selectedSlide.previousSibling.classList.add( `slider__item--current` );
			break;
		}
	}

	setChangeSlideHandler() {
		this._slideListElement = this.getElement().querySelector( `.slider__list` );
		this.getElement().querySelector( `.slider__controls` ).addEventListener( `click`, this._changeSlideHandler );
	}
}

const sliderInstance = new Slider( container, data );

sliderInstance.setChangeSlideHandler();
sliderInstance.render();
