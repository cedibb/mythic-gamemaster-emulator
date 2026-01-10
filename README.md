# Mythic GME Web App

A web application implementing the **Mythic Game Master Emulator 2nd Edition** rules for solo and GM-less roleplaying.

## Features

- **Fate Check**: Ask yes/no questions with adjustable likelihood and chaos factor
- **Chaos Factor Tracking**: Track and adjust chaos (1-9) throughout your adventure
- **Scene Management**: Set up scenes with automatic interrupt checks
- **Random Events**: Generate random events with focus and meaning tables
- **Event Meaning Generator**: Create action/description pairs for inspiration
- **Lists Manager**: Track NPCs and story threads
- **Automatic Random Event Detection**: Events trigger on double digits within chaos range

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Set Chaos Factor**: Start with chaos level 5 (default) and adjust as your story becomes more/less chaotic
2. **Start a Scene**: Describe what you expect to happen and check for interrupts
3. **Ask Fate Questions**: When uncertain about outcomes, ask yes/no questions with appropriate likelihood
4. **Track NPCs and Threads**: Add important characters and story threads to keep organized
5. **Generate Events**: Use the event generator for inspiration when needed

## Game Rules

This app implements the Mythic GME 2nd Edition mechanics:

- **Fate Chart**: Roll percentile dice against chaos-adjusted probabilities
- **Exceptional Results**: Double digits indicate exceptional yes/no answers
- **Random Events**: Occur when roll shows matching digits within chaos range
- **Scene Interrupts**: Checked at scene start based on chaos factor
- **Event Focus Table**: Determines what type of random event occurs
- **Event Meaning Tables**: Provides action/description pairs for interpretation

## Credits

Based on the **Mythic Game Master Emulator** by Tana Pigeon  
Published by Word Mill Games

## License

This is a fan-made tool for personal use. Mythic GME is a trademark of Word Mill Games.
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
