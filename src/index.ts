import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { CardsData } from './components/data/CardsData';
import { OrderData /* OrderValidator */ } from './components/data/OrderData';
import { IApi, ICard, IOrder } from './types';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, settings, categoryStyles } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/modal/ModalElement';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Basket } from './components/Basket';
import { Contacts, Order } from './components/Form';

const gallery: HTMLElement = document.querySelector('.gallery');
const modalContainer: HTMLElement = document.querySelector('#modal-container');

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
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

// объекты данных
const cardsData = new CardsData(events);
const orderData = new OrderData(events);

//объект модального окна
const modal = new Modal(modalContainer, events);

//объекты карточек
const cardsContainer = new CardsContainer(gallery, events);
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
		events.emit(`initialData: loaded`);
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
events.on(`initialData: loaded`, () => {
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
	const cardInBasket = cardsData.basket.some(
		(item) => item.id === data.card.id
	);

	if (cardInBasket || cardData.price === null) {
		cardPreview.setDisabled(cardPreview.cardButton, true);
	} else {
		cardPreview.setDisabled(cardPreview.cardButton, false);
	}

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

const updateBasket = () => {
    const cardArray = cardsData.basket.map((card, index) => {
		const initialCard = new Card(cloneTemplate(cardBasketTemplate), events);
        initialCard.index = index + 1;
		return initialCard.render(card);
	});

	if (cardArray.length === 0) {
		basket.setDisabled(basket.basketButton, true);
	} else {
		basket.setDisabled(basket.basketButton, false);
	}

	const total = cardsData.getBasketTotal();
	const renderedBasket = basket.render({
		basketList: cardArray,
		basketPrice: total,
	});

	modal.setContent(renderedBasket);

	cardsContainer.headerBasketCounter = cardsData.getBasketCardCount();
}

//открытие корзины
events.on(`basket:open`, () => {
	updateBasket();
	modal.open(); 
});

//удаление карточки из корзины
events.on(`card:delete`, (data: { card: Card }) => {
	const { card } = data;
	cardsData.removeCardFromBasket(card.id);
});

//обновление корзины на главное страницы
events.on(`basket:update`, () => {
	updateBasket();
});

//сабмит корзины
events.on(`basket:submit`, () => {
	modal.clearModal();
	modal.setContent(orderCloneTemplate);
});

//валидация адреса
events.on(`order:input`, (data: { field: string; value: string }) => {
	if (orderData.validateAddress(data)) {
		order.clearError(data.field);
	} else {
		order.setErrorMessages(data.field, 'Не введена почта');
	}
});

//сабмит формы order
events.on(`order:submit`, (data: { address: string; payment: string }) => {
	orderData.address = data.address;
	orderData.payment = data.payment;

	order.clearForm();
	modal.clearModal();
	modal.setContent(contactsCloneTemplate);
});

//валидация полей формы contacts
events.on(`contacts:input`, (data: { field: string; value: string }) => {
	if (data.field === 'email') {
		if (orderData.validateEmail(data)) {
			contacts.clearError(data.field);
		} else {
			contacts.setErrorMessages(data.field, 'Не введен email');
		}
	}
	if (data.field === 'phone') {
		if (orderData.validatePhone(data)) {
			contacts.clearError(data.field);
		} else {
			contacts.setErrorMessages(data.field, 'Не введен номер телефона');
		}
	}
});

//сабмит формы contacts, и отправка данных на сервер
events.on(`contacts:submit`, (inputData: { email: string; phone: string }) => {
	orderData.email = inputData.email;
	orderData.phone = inputData.phone;

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
			contacts.clearForm();
			modal.clearModal();

			orderConfirmation.total = res.total;
			modal.setContent(orderConfirmationTemplate);
			cardsData.clearBasket();
			cardsContainer.headerBasketCounter = cardsData.getBasketCardCount();
		})
		.catch((err) => {
			console.error(err);
		});
});

//закрытие модального окна об успешной оплате
events.on(`success:submit`, () => {
	modal.clearModal();
	modal.close();
});
