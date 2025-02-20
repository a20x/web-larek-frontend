import { IEvents } from "../base/events";

export class Modal {
    protected modalCloseButton: HTMLButtonElement;
    protected modalContainer: HTMLElement;
    protected events: IEvents;
    protected modalContent: HTMLElement;

    constructor(modalElement: HTMLElement, events: IEvents) {
        this.modalContainer = modalElement;
        this.events = events;
        this.modalCloseButton = this.modalContainer.querySelector('.modal__close');
        this.modalContent = this.modalContainer.querySelector('.modal__content')

        this.modalCloseButton.addEventListener('click', this.close.bind(this));
        this.modalContainer.addEventListener('mousedown', (evt) => {
            if(evt.target === evt.currentTarget) {
                this.close();
            }
        })
        this.closeOnEsc = this.closeOnEsc.bind(this);
    }

    open() {
        this.modalContainer.classList.add('modal_active');
        this.events.emit(`modal:open`);
    }

    close() {
        this.modalContainer.classList.remove('modal_active');
        this.events.emit(`modal:close`);
    }

    closeOnEsc(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    setContent(content: HTMLElement) {
        this.clearModal()
        this.modalContent.append(content);
    }

    clearModal() {
        this.modalContent.innerHTML = '';
    }
}