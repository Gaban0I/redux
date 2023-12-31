# Context API et useReducer

Jusqu'à présent, nous avons vu avec React comment passer des données d'un composant à un autre de façon *descendante* et *ascendante* avec les **props**.

```jsx
// Représente l'état (state) de l'application
const todos = [
    {title : "Acheter du pain"},
    {title : "Nourrir le chat"}
];

function App() {
    return (
        <Todolist todos={todos} />
    );
}

function Todolist(props) {
    return (
        <ul>
            {props.todos.map((todo, index) => (
                <li key={index}>{todo.title}</li>
            ))}
        </ul>
    );
}
```

Transmettre des valeurs via les props est une bonne méthode quand les composants sont proches …

<img src="images/react-props.png" width="800" />

Mais parfois, les composants sont éloignés :

<img src="images/react-props-problem.png" width="800" />

Depuis React 16.8, il est possible d'utiliser la **Context API** pour passer des informations entre les composants de l'application, sans passer par le mécanisme de props.

Le passage via les props va déboucher sur l’anti pattern de **« forage des props »** (appelé **props drilling** )

<img src="images/react-props-drilling.png" width="800" />

---

Pour éviter cela, nous avons à notre disposition **le Hook Context**

Le Contexte permet de mettre à disposition des données globales via un **Provider**.

Tout composant ayant besoins de ces données pourra y accéder via un **Consumer**.

<img src="images/react-context.png" width="800" />

---

Pour créer un Contexte, il faut définir un module qui met à disposition les données via un **Provider** et un **Consumer**

On initialise un nouveau contexte avec la méthode `createContext()` de React :

```js
// UserContext.js
import { createContext } from 'react';

const UserContext = createContext();

export default UserContext;
```

Ensuite, pour que le contexte soit accessible, il doit faire parti des composants parents de ceux qui vont y accéder.

Le Provider met à disposition les données :

```jsx
// App.jsx
import UserContext from './UserContext';

function App() {
    const user = { name: "Zuckerberg", age: 35 };

    return (
        <UserContext.Provider value={user}>
            <Hello />
        </UserContext.Provider>
    )
}
```

Ici, la prop "value" du Provider va mettre à disposition l'objet `user` à tous les enfants de ce Provider (le composant `<Hello>`)

On accède ensuite aux données dans le composant enfant grâce au hook `useContext()`:

```jsx
// Hello.jsx
import { useContext } from 'react';
import UserContext from './UserContext'; // importe le contexte 'UserContext'

function HomePage() {
    const user = useContext(UserContext); // récupère les données du contexte

    return (
        <>
            <h3>{user.name}</h3>    {/* ✅ */}
            <span>{user.age}</span> {/* ✅ */}
        </>
    );
}
```

À noter que l'on peut aussi passer directement via le `Consumer` dans le render :

```jsx
// Hello.jsx
import { useContext } from 'react';
import UserContext from './UserContext';

function HomePage() {
    return (
        <UserContext.Consumer>
            {user => (
                <>
                    <h3>{user.name}</h3>    {/* ✅ */}
                    <span>{user.age}</span> {/* ✅ */}
                </>
            )}
        </UserContext.Consumer>
    );
}
```

La documentation de l'API Context est disponible ici : https://fr.reactjs.org/docs/context.html

# Exercice 01

Allez sur l'URL suivante et complètez l'exercice :

Connectez-vous sur l'URL suivante et complétez les instructions définies dans les différents fichiers :

<!-- (ANCIENNE URL (obsolète) : https://jsitor.com/IMBdk60Fi) -->
https://stackblitz.com/edit/react-context-01

---

## Le hook useReducer()

`useReducer()` est un hook qui permet comme `useState()` de gérer un état, mais passant par un **reducer**.

Par définition, un reducer est une *fonction* qui prend en paramètre un **état** et une **action** :

```js
function monReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { counter: state.counter + 1 }
        case 'DECREMENT':
            return { counter: state.counter - 1 }
        // À noter qu'il faut toujours prévoir une action par défaut.
        default:
            return state;
    }
}
```

Le but premier d'un reducer est de **renvoyer un nouvel état à partir d'un état précédent**.

Le nouvel état doit **TOUJOURS** être différent de l'état précédent.

Sur des valeurs primitives, on peut simplement les remplacer, mais pour des objets (`[]` ou `{}`), il faut **copier** l'objet grâce à la syntaxe de destructuring : `{ ...oldObj }`

---

Le hook `useReducer()` de react prend en argument 2 paramètres :

- une fonction reducer
- un état initial (souvent un objet JS)

Le hook renvoie un tableau de 2 éléments :

- le nouvel état
- une fonction `dispatch()` permettant de déclencher un changement d'état via une **action** :

```js
const [state, dispatch] = useReducer(monReducer, { counter: 0 });

// On peut déclencher un changement d'état via une action
// Une action est un simple objet littéral JS contenant une propriété "type"
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'DECREMENT' });
```

Une action peut aussi accepter un second paramètres, généralement appelé `payload`, et qui sera transmit à la fonction reducer :

```js
function monReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {counter: state.counter + (action.payload ?? 1)}
        case 'DECREMENT':
            return {counter: state.counter - (action.payload ?? 1)}
        default:
            return {...state};
    }
}

const [state, dispatch] = useReducer(monReducer, { counter: 0 });

dispatch({ type: 'INCREMENT', payload: 5 });
```

## Combiner l'API Context et `useReducer()`

En combinant l'API Context et le hook `useReducer()`, on peut simuler le comportement basique d'un store Redux.

Le **store** et la fonction **dispatch** créé par `useReducer()` peuvent être transmis aux sous-composants via un **Provider** :

```jsx
// App.jsx

// 1. Création d'un reducer
function basketReducer(state, action) {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return [...state, action.payload];
        case 'REMOVE_PRODUCT':
            return [...state.filter(product => product.id !== action.payload.id)];
        default:
            return [...state];
    }
}

// 2. Création d'un contexte
const BasketContext = React.createContext();

function App() {
    const [state, dispatch] = useReducer(basketReducer, []);

    // 3. Le provider fourni le state et la fonction dispatch aux composants enfants
    return (
        <BasketContext.Provider value={{state, dispatch}}>
            <Basket />
            <ProductsList />
        </BasketContext.Provider>
    )
}
```

```jsx
// Basket.jsx
function Basket() {
    const { state, dispatch } = useContext(BasketContext);

    return (
        <div>
            <h3>Votre panier</h3>
            {state.map(product => (
                <div key={product.id}>
                    {product.name}
                    <button onClick={() => dispatch({type: 'REMOVE_PRODUCT', payload: product})}>
                        Supprimer
                    </button>
                </div>
            ))}
        </div>
    )
}
```

```jsx
// ProductsList.jsx
function ProductsList() {
    const { state, dispatch } = useContext(BasketContext);

    return (
        <div>
            <h3>Liste des produits</h3>
            {state.map(product => (
                <div key={product.id}>
                    {product.name}
                    <button onClick={() => dispatch({type: 'ADD_PRODUCT', payload: product})}>
                        Ajouter au panier
                    </button>
                </div>
            ))}
        </div>
    )
}
```

---

# Exercice 02

Connectez-vous sur l'URL suivante et complétez les instructions définies dans les différents fichiers :

https://stackblitz.com/edit/react-context-02

# Exercice 03 

Récupérez le dossier **`03 - TodoApp`** fourni, et installez les dépendances :

```bash
npm install
```

Lancez le projet :

```bash
npm start
```

Complétez dans les différents fichiers les annotations `// TODO` en commentaire pour faire fonctionner la TodoList.

Vous devez :

- Créer le contexte
- Brancher le Provider du contexte sur l'app
- Écrire le contenu du reducer
- Utiliser `useReducer` dans l'app
- Dispatcher les différentes actions (création, suppression, modification de status)
- Afficher le nombre de todos faites