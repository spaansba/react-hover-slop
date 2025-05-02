# React Hover Slop

A React hook that extends the hover area around elements, creating a more forgiving and intuitive hover experience.

## [Live Demo](https://react-hover-slop-example-page.vercel.app/)

## Installation

```bash
npm install react-hover-slop
# or
yarn add react-hover-slop
# or
pnpm add react-hover-slop
```

## Why React Hover Slop?

- Predictive Intent: Detects user intent before they actually hover over an element
- Early Data Fetching: Pre-fetch data when users approach elements, reducing perceived loading times

## Usage

```jsx
import { useRef } from 'react';
import useHoverslop from 'react-hover-slop';

function MyComponent() {
  const buttonRef = useRef(null);
  
  const { isHovered } = useHoverslop(
    buttonRef,
    { top: 20, right: 20, bottom: 20, left: 20 }, // Extend hover hitbox 20px in all directions
    {
      onMouseEnter: () => console.log('Mouse entered extended area'),
      onMouseLeave: () => console.log('Mouse left extended area'),
    }
  );
  
  return (
    <button 
      ref={buttonRef}
      style={{ 
        backgroundColor: isHovered ? 'blue' : 'gray',
        transition: 'background-color 0.3s'
      }}
    >
      Hover Me
    </button>
  );
}
```

## API

### `useHoverslop(elementRef, hoverslopBox, mouseEvents, debugMode?)`

#### Parameters

- `elementRef`: React ref to the target element
- `hoverslopBox`: Either a number (applies to all sides) or an object with optional `top`, `right`, `bottom`, and `left` properties
- `mouseEvents`: Object containing optional callback functions:
  - `onMouseEnter`: Called when the cursor enters the extended area
  - `onMouseOver`: Called repeatedly while the cursor is in the extended area
  - `onMouseLeave`: Called when the cursor leaves the extended area
- `debugMode`: Boolean to enable visual debugging of hover areas (optional)

#### Returns

- `isHovered`: Boolean indicating whether the cursor is within the extended area

### Visual Debugging

Adds a visual border around the element for debugging your slop boxes. 

 <img src="./public/HoveSlopDebugMode.jpg" alt="Adds a visual border around the element for debugging your slop boxes. ">

## License

MIT
