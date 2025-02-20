# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных, используемые в приложении

Карточка

```
interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
    categoryClass: string,
}
```

Данные заказа

```
interface IOrder {
    address: string;
    phone: string;
    email: string;
    payment: string;
    total: number;
    items: string[];
}
```

Интерфейс для коллекции карточек

```
interface interface ICardsData {
    cards: ICard[];
    cardPreview: ICard;
    events: IEvents;
    basket: ICard[];
    getCard(cardId: string): ICard;
    addCardToBasket(cardId: string): void;
    getBasketCardCount(): number;
    getBasketTotal(): number;
    clearBasket(): void;
    removeCardFromBasket(cardId: string): void;
}
```

Типизация данных валидации пользователя

```
type TOrderValidationData = {field: string, value: string};
```

Интерфейс для данных пользователя

```
interface IOrderData {
    address: string;
    phone: string;
    email: string;
    payment: string;
    events: IEvents;

    getOrderData(): TUserOrderInfo;
    validateAddress(data: TOrderValidationData): boolean;
    validatePhone(data: TOrderValidationData): boolean;
    validateEmail(data: TOrderValidationData): boolean;
    validatePayment(payment: string): boolean;
}
```

Данные карточек в корзине

```
type TBasketInfo = Pick<ICard, 'id' | 'title' | 'price'>;
```

Данные заказа
```
type TUserOrderInfo = Pick<IOrder, 'paymentMethod' | 'address' | 'phone' | 'email'>;
```

Данные пользователя в попапе для оформления заказа (способ оплаты, адрес)

```
type TUserOrderAddressInfo = Pick<IOrder, 'paymentMethod' | 'address'>;
```

Данные пользователя в попапе для оформления заказа (номер телефона, e-mail)

```
type TUserPersonalInfo = Pick<IOrder, 'phone' | 'email'>;
```

интерфейс запросов на сервер
```
interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

типизация полученных данных, при успешной отправке на сервер

```
interface IOrderRes {
    id: string;
    total: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
 - слой представления, которые отвечает за отображение данных на старнице.
 - слой данных, который отвечает за хранение и изменение данных.
 - презентер, который отвечает за связь представления и данных.

### Базовый код

#### Класс API
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
 - `on` - подписка на событие.
 - `emit` - Инициализация события с данными.
 - `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.


### Слой данных

#### Класс CardsData
Класс отвечает за хранение и работу с карточками, получаемые с сервера.\
Конструктор выглядит следующим образом: constructor(events: IEvents)

В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек
- _cardPreview: string | null - id карточки, выбранной для просмотра в модальном окне.
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.
- _basket: ICard[] - корзина, которая хранит массив карточек

Набор методов, доступных в классе для взаимодействия с данными карточек:
- getCard(cardId: string): ICard - получение карточки по id из массива карточек.
- addCardToBasket(cardId: string): void - добавляет карточку в корзину.
- get basket(): ICard[] - возвращает данные из поля _basket.
- set basket(cards: ICard[]): void - устонавливает карточки в поле _basket.
- getBasketCardCount(): number - метод, подсчитывающий количество карточек в корзине, для отображения их количества на главной странице.
- getBasketTotal(): number - метод, подсчитывающий стоимость корзины.
- clearBasket(): void - очищает все данные карточек из корзины.
- removeCardFromBasket(cardId: string): void - удаляет данные карточки из массива карточек в корзине.
- get cardPreview(): ICard - получение значения из поля _cardPreview.
- get cards(): ICard[] - получает данные о карточках из поля класса _cards.
- set cards(items: ICard[]): void - устанавливает данные cards: ICard[] в поле класса _cards.

#### Класс OrderData
Класс отвечает за хранение и работу с данными заказа.\
Конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:
- _address: string - адрес пользователя заказа
- _phone: number - номер телефона пользователя
- _email: string - электронная почта пользователя
- _paymentMethod: string - способ опталы
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также, в классе представлены методы, позволяющие взаимодействовать с данными пользователя заказа.
- set address(address: string): void - устанавливает переданное значение в поле _address.
- set phone(phone: string): void - устанавливает переданное значение в поле _phone.
- set email(email: string): void - устанавливает переданное значение в поле _email.
- set payment(payment: string): void - устанавливает переданное значение в поле _payment.
- getOrderData(): TUserOrderInfo - получение данных из полей класса
- validateAddress(data: TOrderValidationData): boolean - валидирует поле с адресом, возвращает true/false.
- validatePhone(data: TOrderValidationData): boolean - валидирует поле с номером телефона, возвращает true/false.
- validateEmail(data: TOrderValidationData): boolean - валидирует поле с почтой, возвращает true/false.
- validatePayment(payment: string): boolean - проверяет, валидна ли кнопка выбора оплаты


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элементов) передаваемых в них данных

#### Класс Modal
Класс реализует модальное окно. Имеет методы `open` & `close` для отображения модального окна. Имеет слушатель на кнопку esc, клик по оверлею и кнопку-крестик для закрытия модального окна.
- constructor(modalSelector: HTMLElement, events: IEvents) Конструктор принимает селектор модального окна, где будет отображаться содержимое. И экземпляр класса `EventEmitter` для возможности инициализации событий.

Поля класса:
- modalContainer: HTMLElement - селектор модального окна.
- events: IEvents - брокер событий.
- modalCloseButton: HTMLButtonElement - кнопка закрытия модального окна
- modalContent: HTMLElement - селектор контента модального окна

Методы:
- open(): void - метод отвечает за открытие модального окна.
- close(): void - закрытие модального окна.
- closeOnEsc(evt: KeyboardEvent): void - закрытие на esc
- setContent(content: HTMLElement): void - установка контенка в модальное окно
- clearModal(): void - очистка контента в модальном окне

#### Класс Form
Является базовым классом форм. При сабмите инициализуется событие, и передается объект с данными из инпута. При изменении данных в инпуте, инициализируется событие проверки верности введенных данных. Также, имеет метод изменения состояния кнопки сабмита. Предоставляет методы отображения ошибок формы. В конструкторе принимает форму.

Поля класса:
- fromName: string - значение атрибута name формы.
- _submit: HTMLButtonElement - кнопка сабмита формы.
- form: HTMLFormElement - элемент формы.
- _errors: HTMLElement  - селектор для вывода ошибок.
- inputs: NodeListOf<HTMLInputElement> - инпут элементы формы
- errorMessages: Record<string, string> - объект с полем и ошибкой.

Методы:
- handleSubmit(): void - отвечает за сабмит формы.
- getInputValues(): Record<string, string> - получает данные из инпутов.
- checkFormValidity(): void - проверяет форму на валидность.
- setErrorMessages(data: {field: string, message: string}): void - принимает объект данных для отображения ошибок.
- clearError(field: string): void - метод для скрытия сообщения об ошибке.
- displayErrors(): void - отвечает за отображение ошибок
- errors(value: string): void - отвечает за установку ошибков в поле ошибки.
- valid(value: boolean): void - делает кнопку сабмита активной, и наоборот.
- clearForm(): void - делает ресет формы.

#### класс Contacts 
Расширяет класс Form. На данный момент использует только методы базового класса Form, но может в будующем быть дополнен функционалом. Конструктор принимает `form: HTMLFormElement` и вызывает родительский конструктор, с параментром form.


#### Класс Order
Раширяет класс Form. Предназначен для отображения информации о заказе. Помимо функционала класса Form дает возможность выбрать способ оплаты. Класс предназначен для отображения контента в модальном окне о способе оплаты и адресе доставки. Помимо методов базового класса, обладает методом выбора способа оплаты. Конструктор принимает `form: HTMLFormElement` и вызывает родительский конструктор, с параментром form.

Поля класса:
- paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты.
- selectedPayment: string; - выбранный способ оплаты
- addressField: HTMLInputElement; - поле инпута с адресом

Методы:
- handleSubmit(): void - отвечает за сабмит формы
- activePaymentButton(buttonName: string): void - отвечает за переключение выбранной кнопки об оплате.
- checkFormValidity(): void - проверяет форму на валидность.


#### Класс OrderConfirmation
Предназначен для модального окна подтверждения заказа.

Поля класса:
- container: HTMLElement - темплейт разметки с окном подтверждения.
- button: HTMLButtonElement - кнопка успешного оформления заказа.
- _total: HTMLElement - элемент разметки для отображения суммы заказа.

Методы:
- total(value: number): void - отвечает за отображении суммы заказа.


#### Класс Card
Отвечает за отображение карточек, задавая карточкам следующие данные: название, категория, изображение, описание, цена. Класс будет принимать в конструктор `templateSelector: string` карточки, что позволит создавать разные вариации отображения карточки. Также, принимает экземпляр класса `EventEmitter`, для инициализации событий. Элементы разметки будут находиться в конструкторе, чтобы их поиск выполнялся 1 раз.

Поля класса:
- cardImage: HTMLImageElement | null - изображение карточки
- cardCategory: HTMLSpanElement | null - категория карточки
- cardTitle: HTMLHeadingElement - название карточки
- cardText: HTMLElement | null - описание карточки
- _cardButton: HTMLButtonElement | null - кнопка добавления карточки в корзину
- cardPrice: HTMLSpanElement - цена карточки
- cardId: string - id карточки
- cardDeleteButton: HTMLButtonElement | null - кнопка удаления карточки
- cardIndex: HTMLSpanElement | null - индекс карточки (для отображения в корзине)

Методы:
сеттеры:
- price(price: number | null) - устанавливает цену карточки, или указывает, что карточка бесценна
- category(category: string) - устонавливает категорию карточки
- image(url: string) - устанавливает изображение карточки.
- description(text: string) - устанавливает описание карточки.
- title(title: string) - устанавливает название карточки.
- id(id: string) - устанавливает id карточки.
- categoryClass(className: string) - устанавливает цвет категории карточки.
- index(index: number) - устанавливает индекс карточки
геттеры:
- cardButton(): HTMLButtonElement - получение кнопки добавления карточки в корзину для изменения ее состояния.
- get id(): string - возвращает уникальный id карточки.


#### Класс CardsContainer 
Расширяет класс Component. Отвечает за отображение массива карточек на главной странице. В конструктор также передаем `containerSelector: string` для нахождения контейнера, где будет отображаться массив карточек и eventEmitter.

Поля класса:
- headerBasket: HTMLButtonElement - кнопка-слушатель клика для открытия корзины.
- _headerBasketCounter: HTMLSpanElement - счетчик карточек в корзине

Методы:
- catalog(items: HTMLElement[]): void - метод, который принимает массив карточек и отображает их на главной странице приложения.
- headerBasketCounter(amount: number): void - отображает количество карточек в корзине на главной странице.


#### Класс Basket
Отвечает за отображения карточек, добавленных в корзину. Также, имеет кнопку оформления заказа, взаимодействие с которой вызывает функцию. В конструктор принимает `templateSelector: string` и `events: IEvents`

Поля класса:
- _basketList: HTMLElement - список, где будет отображаться информация о карточках, добавленных в корзину.
- _basketPrice: HTMLSpanElement - 
- _basketButton: HTMLButtonElement - кнопка для оформления заказа.

Методы:
сеттеры: 
- basketList(cards: HTMLElement[]): void - устанавливает карточки в корзине.
- basketPrice(total: number): void - устанавливает цену корзины.

геттер: 
- basketButton() - получает кнопку корзины.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бекендом сервиса.

### Взаимодействие компонентов
Код, описывающий взаимодействия компонентов будет располагать в файле `index.ts` и выполнять роль презентера.\
Взаимодействия осуществляются за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `intex.ts` сначала создаются экземпляры всех классов, а затем настраивается обработка событий.

Список всех событий, которые могут генерироваться в системе:\
События изменения данных (генерируются классами моделями данных):\
- `cards:changed` - изменение массива карточек.
- `basket:update` - событие, необходимое для перерасчета карточек в корзине.
- `address:updated` - изменение адреса
- `phone:updated` - изменение телефона
- `email:updated` - изменение email
- `address:valid` - адрес валиден
- `phone:valid` - телефон валиден
- `email:valid` - email валиден
- `payment:valid` - способ оплаты валиден


События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами представления):\
- `contacts:input` - изменение данных в форме контактной информации о пользователе.
- `order:input` - изменение данных в форме информации о заказе.
- `contacts:validation` - валидация всей формы (контактной информации) для переключения кнопки сабмита в активную.
- `order:validation` - валидация всей формы (информации о заказе) для переключения кнопки сабмита в активную.

- `modal: open` - модальное окно открылось.
- `modal: close` - модальное окно закрылось.
- `basket:submit` - сабмит корзины.
- `card:select` - выбор карточки для отображения в модальном окне.
- `card:submit` - сабмит выбранной карточки.
- `card:delete` - удаление карточки из корзины.
- `basket:open` - открытие модального окна корзины.
- `contacts:submit` - сохранение контактных данных пользователя.
- `order:submit` - сохранение данных заказа.
- `success:submit` - сабмит модального окна об успешной покупке
- `order:input` - инпуты формы order
- `contacts:input` - инпуты формы contacts