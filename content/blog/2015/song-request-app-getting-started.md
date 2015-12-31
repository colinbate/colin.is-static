+++
draft = true
title = "Getting Started with React+Redux"
series = ["Building A Song Request App"]
tags = ["series"]
categories = ["Dev"]
date = 2015-12-30T02:38:11Z
banner = "C:t_banner_center/mic_hrm05f.jpg"
+++
Over the holidays I worked on a web app. That isn't new, I do that most chances I get. However this app was an assignment, and I'd like to walk you through some of the lessons learned. I'm planning this to be a series of articles looking at different aspects of building this application.

The assignment in this case was [one that I created myself][ga]. I created it for some of my colleagues as a way to learn new web technologies without needing to worry about what to build. The goal was to recreate a simple app I had written years ago to request songs to add to my karaoke song list. Yes, I was an office karaoke jockey for a while.

The main part of the assignment aside from some specifications on functionality was that you needed to use at least two technologies that were new to you. But why stop at two? Why not make everything new?

I started with the notion of using [React][], mostly to see what all the fuss was about. React is a view engine, and doesn't provide the full package you get with some other frameworks. Looking around, I saw that Facebook also had a state management library called Flux. At this time I was investigating Reactive Programming libraries, and I had it in my head that I would use [Kefir.js][kj] instead of Flux. Then I heard about [Redux][] and I was hooked.

The ideas behind Redux are simple:

1. Application state is stored in a single object tree (*store*).
2. That state is read-only, you can only update it via an *action* describing what happened.
3. Changes are made with pure functions so that each state is independent (*reducers*).

Essentially it is event sourcing, or at least a light-weight version of it.

Redux isn't exclusively for use with React, but the two play well together. There is a `react-redux` package which provides some integration points. If you want to learn more about Redux, particularly if you don't know much about React, then go watch the [*Getting Started with Redux* course at Egghead.io][ehr]. It was produced by the creator of Redux and is a great, ground-up set of lessons.

For a taste, here is an example reducer function from my karaoke app:

```js
import * as Actions from '../actions';

function user(state = {}, action) {
  switch (action.type) {
    case Actions.CLEAR_USER:
      return {};
    case Actions.SET_USER:
      if (action.ready && action.result) {
        return {
          ...action.result
        };
      }
    default:
      return state;
  }
}
```

This function is responsible for managing the state of a single part of the app (the user info), and is combined with other reducers to create a function which manages the full application state.

You can see under the `SET_USER` case that I'm returning a new object populated with the spread of values from the action result. This is an ES2016 proposed feature (object spread) and probably not strictly necessary since the result would be a new object anyway from the state's perspective. In any case it gives you an idea.

The actions which this reducer handles look something like this:

```js
import {signin, signout} from '../api/auth';

export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';

export function login() {
  return {
    promise: signin(),
    type: SET_USER
  };
}

export function logout() {
  signout();
  return {
    type: CLEAR_USER
  };
}
```

Apart from the potentially confusing signout vs logout nomenclature, you can see that actions are potentially very simple, just objects with a type. Functions which create actions are known as action creators (clever). In the `login` case, I'm setting a promise on the action. This is actually picked up by some middleware which turns that into two actions, one initially when called and another when the promise is fulfilled. The state of the action is indicated by `action.ready` which you can see in the reducer above.

And here I bring it all together by creating a store with the reducers and middleware:

```js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import promiseMiddleware from './promise-middleware';
import thunkMiddleware from './thunk-middleware';

function configureStore(initialState) {
  const createStoreWithMiddleware = applyMiddleware(
    promiseMiddleware,
    thunkMiddleware
  )(createStore);
  return createStoreWithMiddleware(rootReducer, initialState);
}

const store = configureStore(); 
```

So that is some of the Redux part, how does this fit in with the rendering using React?

React uses JSX, an extension on JavaScript which allows HTML-like structures to be used inline your rendering methods. There are specific compilers for it, but Babel supports it as well if you are using that already.

Here is my `Header` component which is referenced simply in a containing JSX snippet as `<Header />`.

```js
import React from 'react';
import {connect} from 'react-redux';
import Button from './Button';
import {login, logout} from '../actions';

const Header = ({ user, login, logout, children }) => (
  <header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <span className="mdl-layout-title">{children}</span>
      <div className="mdl-layout-spacer"></div>
      <div>{user.email ?
        <div>
          <span>{user.email}</span>
          <Button accent="true" onClick={logout}>Logout</Button>
        </div> :
        <Button accent="true" onClick={login}>Login</Button>}
      </div>
    </div>
  </header>
);

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps, {login, logout})(Header);
```

The `Header` function is a fairly basic stateless React component. It can be a bit tricky at first glance if you aren't familiar with ES2015 syntax as between that and React, there are about four different semantic uses of curly braces in that snippet.

The `connect` function is what is doing the magic of hooking up the React component to the Redux store. You should really check out the lessons I mentioned earlier, as they explain what exactly the `connect` function is doing, so you can see how things are really wired up.

### Next Up

When I said that I wanted everything to be new for this app, I wasn't kidding. The only thing that I'd used before was ES2015 as a language and [Babel][] as a transpiler. That said, it was my first use of Babel 6, and I used [Webpack][] which was new to me as well.

I used [Hook.io][hook] as my backend and [Auth0][] as my authentication provider. And on the visual side, I used [Material Design Lite][mdl] for styles. I even used the [fetch][] API and polyfill for talking to the server. All told a great experience. I'll be sharing more of my *learnings* and struggles with you soon.


[ga]: https://github.com/colinbate/web-club-assignments/tree/master/song-request
[React]: https://facebook.github.io/react/
[Redux]: http://redux.js.org/
[kj]: https://rpominov.github.io/kefir/
[ehr]: https://egghead.io/series/getting-started-with-redux
[Babel]: http://babeljs.io
[Webpack]: https://webpack.github.io/docs/
[fetch]: https://github.com/github/fetch
[Auth0]: https://auth0.com
[hook]: http://hook.io
[mdl]: http://www.getmdl.io
