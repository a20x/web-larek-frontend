import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { CardsData } from './components/data/CardsData';
import { OrderData /* OrderValidator */ } from './components/data/OrderData';
import { ICard, IOrder } from './types';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, categoryStyles } from '../../web-larek-frontend/src/utils/constants';
import { AppApi } from './components/AppApi';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from '../../web-larek-frontend/src/utils/utils';
import { Modal } from './components/modal/Modal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Basket } from './components/Basket';
import { Contacts } from './components/forms/Contacts';
import { Order } from './components/forms/Order';

//основные элементы разметки
const modalContainer: HTMLElement = document.querySelector('#modal-container');
const pageWrapper: HTMLElement = document.querySelector('.page__wrapper');

//темплейты
const orderSuccessTemplate: HTMLTemplateElement =
	document.querySelector('#success');
const cardTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');

//объект ивентов
const events = new EventEmitter();

//объекты api
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

// объекты данных
const cardsData = new CardsData(events);
const orderData = new OrderData(events);

//объект модального окна
const modal = new Modal(modalContainer, events);

//объекты карточек
const cardsContainer = new CardsContainer(pageWrapper, events);
const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

//объект корзины
const basket = new Basket(cloneTemplate(basketTemplate), events);

//объект окна подтверждения заказа
const orderConfirmationTemplate = cloneTemplate(
	orderSuccessTemplate
) as HTMLElement;
const orderConfirmation = new OrderConfirmation(
	orderConfirmationTemplate,
	events
);

//объекты форм заказа
const orderCloneTemplate = cloneTemplate(orderTemplate) as HTMLFormElement;
const order = new Order(orderCloneTemplate, events);
const contactsCloneTemplate = cloneTemplate(
	contactsTemplate
) as HTMLFormElement;
const contacts = new Contacts(contactsCloneTemplate, events);

//получение данных о карточках с сервера
api
	.productList()
	.then((cardsInfo) => {
		cardsData.cards = cardsInfo.items;
        cardsData.basket = [];
	})
	.catch((err) => {
		console.error(err);
	});

const cardRenderData = (card: ICard) => {
	return {
		id: card.id,
		title: card.title,
		description: card.description,
		image: `${CDN_URL}${card.image}`,
		category: card.category,
		price: card.price,
		categoryClass: categoryStyles[card.category],
	};
};

//обработка полученных данных
events.on(`cardsData:changed`, () => {
	const cardsArray = cardsData.cards.map((card) => {
		const initialCard = new Card(cloneTemplate(cardTemplate), events);
		return initialCard.render(cardRenderData(card));
	});

	cardsContainer.render({ catalog: cardsArray });
});

//случатель на все обработчики
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//выбор карточки
events.on(`card:select`, (data: { card: ICard }) => {
	const cardData = cardsData.getCard(data.card.id);

    const cardInBasket = cardsData.cardInBasket(data.card);

    cardPreview.setSubmitDisabled(cardInBasket || cardData.price === null);

	const element = cardPreview.render(cardRenderData(cardData));

	modal.setContent(element);
	modal.open();
});

//добавленее карточки в корзину
events.on(`card:submit`, (data: { card: Card }) => {
	const { card } = data;
	modal.clearModal();
	modal.close();
	cardsData.addCardToBasket(card.id);
});

//удаление карточки из корзины
events.on(`card:delete`, (data: { card: Card }) => {
	const { card } = data;
	cardsData.removeCardFromBasket(card.id);
});

const renderBasket = () => {
    const cardArray = cardsData.basket.map((card, index) => {
		const initialCard = new Card(cloneTemplate(cardBasketTemplate), events);
        initialCard.index = index + 1;
		return initialCard.render(card);
	});

    basket.setSubmitDisabled(cardArray.length === 0);

	const total = cardsData.getBasketTotal();
    return {
        basketList: cardArray,
        basketPrice: total
    }
}

//открытие корзины
events.on(`basket:open`, () => {
    modal.setContent(basket.getElement());
    modal.open();
});

//рендер корзины
events.on(`basket:update`, () => {
	basket.render(renderBasket());
    cardsContainer.headerBasketCounter = cardsData.getBasketCardCount();
});

//сабмит корзины
events.on(`basket:submit`, () => {
	modal.clearModal();
	modal.setContent(orderCloneTemplate);
});

//валидация и обновление данных о способе оплаты
events.on(`payment: selected`, (data: {payment: string}) => {
    const validButton = orderData.validatePayment(data.payment);
	if(validButton) {
		orderData.payment = data.payment;
	} else {
		console.log('selected button invalid');
	}
})

//изменение состояния кнопок выбора оплаты 
events.on(`payment: updated`, (data: {payment: string}) => {
	order.activePaymentButton(data.payment);
	
	order.changeSubmitButtonState(orderData.validateOrderForm());
})

//валидация адреса
events.on(`order: input`, (data: { field: string; value: string }) => {
	if (orderData.validateAddress(data)) {
        orderData.address = data.value;
	} else {
		orderData.address = '';
		order.setErrorMessages(data.field,'Не введена почта');
	}
});

//обновление адреса
events.on(`address: updated`, () => {
	order.clearError('address');
	order.changeSubmitButtonState(orderData.validateOrderForm());
})

//сабмит формы order
events.on(`order: submit`, () => {
	modal.clearModal();
	modal.setContent(contactsCloneTemplate);
});

//валидация полей формы contacts
events.on(`contacts: input`, (data: { field: string; value: string }) => {
	if (data.field === 'email') {
		if (orderData.validateEmail(data)) {
			orderData.email = data.value;
		} else {
			orderData.email = '';
			contacts.setErrorMessages(data.field, 'Не введен email');
		}
	}
	if (data.field === 'phone') {
		if (orderData.validatePhone(data)) {
			orderData.phone = data.value;
		} else {
			orderData.phone = '';
			contacts.setErrorMessages(data.field, 'Не введен номер телефона');
		}
	}
});

events.on(`email: updated`, () => {
	contacts.clearError('email');
	contacts.changeSubmitButtonState(orderData.validateContactsForm());
})

events.on(`phone: updated`, () => {
	contacts.clearError('phone');
	contacts.changeSubmitButtonState(orderData.validateContactsForm());
})

//сабмит формы contacts, и отправка данных на сервер
events.on(`contacts: submit`, () => {
	const userData = orderData.getOrderData();

	const itemIds = cardsData.basket.map((item) => item.id);

	const data: IOrder = {
		address: userData.address,
		phone: userData.phone,
		email: userData.email,
		payment: userData.payment,
		total: cardsData.getBasketTotal(),
		items: itemIds,
	};

	api
		.order(data)
		.then((res) => {
			orderData.clearData();
			cardsData.clearBasket();
			orderConfirmation.total = res.total;
            modal.setContent(orderConfirmationTemplate);
		})
		.catch((err) => {
			console.error(err);
		});
});

//очистка форм и отключение кнопок сабмита
events.on(`data: cleared`, () => {
	order.clearForm();
	contacts.clearForm();
	order.activePaymentButton('');
	order.changeSubmitButtonState(false);
	contacts.changeSubmitButtonState(false);
})

//закрытие модального окна об успешной оплате
events.on(`success:submit`, () => {
	modal.clearModal();
	modal.close();
});


