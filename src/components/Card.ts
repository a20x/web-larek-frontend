import { ICard } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card extends Component<ICard> {
	private cardImage: HTMLImageElement | null;
	private cardCategory: HTMLSpanElement | null;
	private cardTitle: HTMLHeadingElement;
	private cardText: HTMLElement | null;
	private cardButton: HTMLButtonElement | null;
	private cardPrice: HTMLSpanElement;
	events: IEvents;
	private cardId: string;
	private cardDeleteButton: HTMLButtonElement | null;
    private cardIndex: HTMLSpanElement | null;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardImage = this.container.querySelector('.card__image') as HTMLImageElement;
		this.cardCategory = this.container.querySelector('.card__category') as HTMLSpanElement;
		this.cardTitle = this.container.querySelector('.card__title') as HTMLHeadingElement;
		this.cardText = this.container.querySelector('.card__text') as HTMLElement;
		this.cardButton = this.container.querySelector('.button') as HTMLButtonElement;
		this.cardPrice = this.container.querySelector('.card__price') as HTMLSpanElement;
        this.cardIndex = this.container.querySelector('.basket__item-index') as HTMLSpanElement;
		this.cardDeleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => {
				this.events.emit(`card:select`, { card: this });
			});
		}

		if (this.cardButton) {
			this.cardButton.addEventListener('click', () => {
				this.events.emit(`card:submit`, { card: this });
			});
		}

		if (this.cardDeleteButton) {
			this.cardDeleteButton.addEventListener('click', () => {
				this.events.emit(`card:delete`, { card: this });
			});
		}
	}

	set price(price: number | null) {
		if (this.cardPrice) {
			this.setText(this.cardPrice, price === null ? `Бесценно` : `${price} синапсов`)
		}
	}

	set category(category: string) {
		if (this.cardCategory) this.setText(this.cardCategory, category)
	}

	set image(url: string) {
		if (this.cardImage) this.cardImage.src = url;
	}

	set description(text: string) {
		if (this.cardText) this.setText(this.cardText, text)
	}

	set title(title: string) {
		if (this.cardTitle) this.setText(this.cardTitle, title)
	}

	set id(id: string) {
		this.cardId = id;
	}

	set categoryClass(className: string) {
		if (this.cardCategory) {
			this.cardCategory.classList.remove(
				'card__category_soft',
				'card__category_hard',
				'card__category_other',
				'card__category_additional',
				'card__category_button'
			);
            this.cardCategory.classList.add(className);
		}
	}

    set index(index: number) {
        if (this.cardIndex) {
			this.setText(this.cardIndex, index)
        }
    }

	get id(): string {
		return this.cardId;
	}

	setSubmitDisabled(state: boolean) {
		this.setDisabled(this.cardButton, state);
	}
}
