+++
title = "Yahtzee State Machine"
date = 2020-06-15T00:50:50Z
categories = ["Dev"]
banner = "https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "clintadair|Clint Adair"
+++

So this is one part release announcement, one part tech fan boy rant.

I’ve just released a new app/game. It isn’t an original, it is an implementation of the dice game Yahtzee. At the moment it doesn’t feature a computer opponent, it is designed to be played with two people on the same device. I may add a computer player at some point. In any case, you can check out the game at https://yahtzee.bate.dev

As usual, the UI is written using Svelte, but I also used this as an opportunity to work with [XState][xs], an implementation of finite state machines. I wrote an initial version without XState, and while it was relatively straight forward, I could feel it getting more and more complicated the more functionality I wanted to add. The game logic was deeply embedded into the UI components and when I wanted to add support for more than a single player, I could tell I’d already dug myself into a hole.

I’ve been hearing and reading good things about XState for a while, and I thought that modeling the game flow and logic with it would be a good fit. And boy was I right. 

With liberal use of the documentation on their site (which is quite well written), I was able to create a *machine* and a series of *actions*. They even have a visualizer you can use to see your state machine and send it arbitrary events.

I’m not going to go into all of the details of what a finite state machine is, or how XState works, but the general idea is that you write a ‘recipe’ that defines different states and the name of events to transition between those states. There are also actions that can be triggered when moving between states.

This state and extended state (aka. context) are then passed down to the UI. In this case it is passed down via a readable Svelte store, which is basically a simple observable.

No muss, no fuss.

In case you are interested, you can take a look at the [code repository][gh], but I’ve added the base machine definition here.

```js
export const yahtzeeMachine = Machine({
  id: 'yahtzee',
  context: {
    tableDice: [],
    trayDice: [],
    possibleScores: {},
    names: ['Player 1', 'Player 2'],
    scores: [{}, {}],
    currentPlayer: 0,
    rolls: 3,
    dice: 5,
    winner: null,
  },
  type: 'parallel',
  on: {
    SET_NAME: {
      actions: ['rename', 'saveNames']
    }
  },
  states: {
    game: {
      initial: 'welcome',
      states: {
        'welcome': {
          on: {
            ROLL: 'playing.rolling',
          }
        },
        'new': {
          entry: ['resetGame'],
          on: {
            ROLL: 'playing.rolling',
          }
        },
        playing: {
          initial: 'newturn',
          states: {
            newturn: {
              entry: ['tallyScore'],
              on: {
                ROLL: 'rolling',
              }
            },
            rolling: {
              on: {
                ROLLED: {
                  target: 'deciding',
                  actions: ['setRolledDice', 'decRolls', 'getPossible', 'addBonus']
                },
              }
            },
            deciding: {
              on: {
                ROLL: {
                  target: 'rolling',
                  cond: 'canRoll'
                },
                SET_SCORE: {
                  target: 'checkScore',
                  actions: ['setScore'],
                },
                SET_ASIDE: {
                  actions: ['moveToTray']
                },
                PUT_BACK: {
                  actions: ['moveToTable']
                },
              }
            },
            checkScore: {
              on: {
                '': [
                  {
                    target: 'finished',
                    cond: 'isGameOver',
                  },
                  {
                    target: 'newturn',
                    actions: ['nextPlayer']
                  }
                ]
              }
            },
            finished: {
              type: 'final',
              entry: ['tallyScore', 'determineWinner'],
            }
          },
          on: {
            START_OVER: 'new'
          }
        }
      }
    },
    sidebar: {
      initial: 'showScore',
      states: {
        showScore: {
          on: {
            VIEW_RULES: 'showRules',
          }
        },
        showRules: {
          on: {
            VIEW_SCORE: 'showScore',
          }
        }
      }
    }
  }
});
```

Again, I’m not going into all of the gory details, but you can see from this that there are nested states and parallel states. You can see the `welcome` and `new` states along with states within the game like `newturn`, `rolling` and `deciding`. There are also the events, which I’ve represented in `UPPER_SNAKE_CASE`. Events like `ROLL`, `SET_SCORE` and `START_OVER`. You can also see references to actions, which are defined separately, and are mostly just used to update the context.

I will definitely consider this the next time I need to create another app that is anything more than just a trivial UI implementation.

[xs]: 	https://xstate.js.org
[gh]: https://github.com/colinbate/yahtzee