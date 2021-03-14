const NAME_REG_EXP = /^[-a-zA-Zа-яёА-ЯЁ\s]+$/;
const EMAIL_REG_EXP = /^(?:[-a-z\d\+\*\/\?!{}`~_%&`=^$#]+(?:\.[-a-z\d\+\*\/\?!{}`~_%&`=^$#]+)*)@(?:[-a-z\d_]+\.){1,60}[a-z]{2,6}$/;
const PHONE_REG_EXP = /^(\+7|7|8)*[-\s]*[(]{0,1}[0-9]{3}[)]{0,1}[-\s]*[0-9]{3}[-\s]*[0-9]{2}[-\s]*[0-9]{2}$/;

const URL = `https://jsonplaceholder.typicode.com/posts`;

const SHOW_TIME = 5000;

const ErrorDescription = {
	DEFAULT: `Данные указаны некорректно`,
	NAME: `Поле может содержать буквы, символы тире и пробел`,
	EMAIL: `Укажите адрес электронной почты в формате: pasha96@email.com`,
	PHONE: `Это не похоже на номер телефона`,
	SUBMIT: `При отправке данных произошла ошибка. Попробуйте отправить еще раз либо обновите страницу.`
};

const innerElement = document.querySelector( `.subscribe__inner` );
const formElement = innerElement.querySelector( `.subscribe__form` );
const inputNameElement = formElement.querySelector( `#subscribe-name` );
const inputEmailElement = formElement.querySelector( `#subscribe-email` );
const inputPhoneElement = formElement.querySelector( `#subscribe-phone` );
const buttonElement = formElement.querySelector( `.subscribe__button` );

const toast = ( message ) => {
	const toastElement = document.createElement( `div` );
	toastElement.textContent = message;
	toastElement.classList.add( `toast__item` );

	toastContainer.append( toastElement );

	setTimeout( () => {
		toastElement.remove();
	}, SHOW_TIME );
};

const renderValidationHint = ( targetElement, { isInvalid, description }, position = `afterend` ) => {
	if ( !isInvalid && targetElement.nextElementSibling.classList.contains( `subscribe__validation-hint` ) ) {
		targetElement.nextElementSibling.remove();
		return;
	}

	if ( isInvalid && targetElement.nextElementSibling.classList.contains( `subscribe__validation-hint` ) ) {
		targetElement.nextElementSibling.remove();
		targetElement.insertAdjacentHTML( position, `<p class="subscribe__validation-hint">${description}</p>` );
		return;
	}

	if ( isInvalid && !targetElement.nextElementSibling.classList.contains( `subscribe__validation-hint` ) ) {
		targetElement.insertAdjacentHTML( position, `<p class="subscribe__validation-hint">${description}</p>` );
	}
};

const checkValidity = ( { value }, regExp, errorDescription = ErrorDescription.DEFAULT, isRequired = true ) => {
	if ( value.length === 0 && isRequired ) {
		return {
			isInvalid: true,
			description: `Поле обязательно для заполнения`,
		};
	}

	if ( value.length === 0 && !isRequired ) {
		return {
			isInvalid: false,
			description: `Валидно`,
		};
	}

	if ( regExp.test( value ) ) {
		return {
			isInvalid: false,
			description: `Валидно`,
		};
	} else {
		return {
			isInvalid: true,
			description: errorDescription,
		};
	}
};

const setElementValidityMarker = ( targetElement, { isInvalid } ) => {
	if ( isInvalid ) {
		targetElement.classList.add( `subscribe__input--invalid` );
	} else {
		targetElement.classList.remove( `subscribe__input--invalid` );
	}
};

const inputValidationHandler = ( { target: targetElement }, regExp, errorDescription, isRequired = true ) => {
	const validation = checkValidity( targetElement, regExp, errorDescription, isRequired );

	setElementValidityMarker( targetElement, validation );
	renderValidationHint( targetElement, validation );
};

innerElement.style.minHeight = innerElement.offsetHeight + `px`;
formElement.setAttribute( `novalidate`, true );

const toastContainer = document.createElement( `div` );
toastContainer.classList.add( `toast` );
document.body.append( toastContainer );

inputNameElement.addEventListener( `input`, ( evt ) => {
	inputValidationHandler( evt, NAME_REG_EXP, ErrorDescription.NAME );

	evt.target.value = evt.target.value.replace( /[^-a-zA-Zа-яёА-ЯЁ\s]/, `` );
} );

inputEmailElement.addEventListener( `input`, ( evt ) => {
	inputValidationHandler( evt, EMAIL_REG_EXP, ErrorDescription.EMAIL );
} );

inputPhoneElement.addEventListener( `input`, ( evt ) => {
	inputValidationHandler( evt, PHONE_REG_EXP, ErrorDescription.PHONE, false );
} );

formElement.addEventListener( `submit`, ( evt ) => {
	evt.preventDefault();

	const nameValidation = checkValidity( inputNameElement, NAME_REG_EXP, ErrorDescription.NAME );
	const emailValidation = checkValidity( inputEmailElement, EMAIL_REG_EXP, ErrorDescription.EMAIL );

	if ( nameValidation.isInvalid ) {
		setElementValidityMarker( inputNameElement, nameValidation );
		renderValidationHint( inputNameElement, nameValidation );
	}

	if ( emailValidation.isInvalid ) {
		setElementValidityMarker( inputEmailElement, emailValidation );
		renderValidationHint( inputEmailElement, emailValidation );
	}

	if ( !nameValidation.isInvalid && !emailValidation.isInvalid ) {
		const formData = new FormData( evt.target );
		const data = {};

		for ( const pair of formData.entries() ) {
			data[ pair[ 0 ] ] = [ ...pair ].pop();
		}

		inputNameElement.disabled = true;
		inputEmailElement.disabled = true;
		inputPhoneElement.disabled = true;
		buttonElement.disabled = true;

		const buttonTextContentPrevious = buttonElement.textContent;
		buttonElement.textContent = `Сейчас подпишем...`;

		fetch( URL, {
			method: `POST`,
			body: JSON.stringify( data ),
			headers: {
				'Content-type': `application/json; charset=UTF-8`
			}
		} )
			.then( () => {
				innerElement.innerHTML = `<p class="subscribe__success">Спасибо! Мы будем держать вас в курсе обновлений</p>`;
			} )
			.catch( () => {
				toast( ErrorDescription.SUBMIT );

				inputNameElement.disabled = false;
				inputEmailElement.disabled = false;
				inputPhoneElement.disabled = false;
				buttonElement.disabled = false;

				buttonElement.textContent = buttonTextContentPrevious;
			} );
	}

} );
