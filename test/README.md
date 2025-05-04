# react-hover-slop Test Application

This test application demonstrates the functionality of the `react-hover-slop` package. It showcases different usage patterns and configurations to help developers understand how to implement and test the hover slop functionality.

## Features Demonstrated

- **Multiple Element Types**: Tests the hover slop behavior on different element types (button, div, anchor)
- **Various Slop Configurations**: Shows different slop area configurations (symmetric, asymmetric, uniform)
- **Event Handling**: Demonstrates all available event handlers (onMouseEnter, onMouseLeave, onMouseOver)
- **Debug Mode**: Visual debugging overlay to see the extended hover areas
- **Event Options**: Shows the "once" option for event triggering
- **Event Logging**: Real-time display of triggered events with timestamps

## How to Run

From the main project directory:

```bash
npm run dev
```

Or from this test directory:

```bash
npm run dev
```

## Implementation Details

The test app is built with:
- Vite as the build tool
- React for UI components
- TypeScript for type safety
- Tailwind CSS for styling

## Test Scenarios

1. **Button with Large Slop Area**:
   - 60px slop on all sides
   - All event handlers implemented (onMouseEnter, onMouseLeave, onMouseOver)

2. **Card with Asymmetric Slop Area**:
   - Varied slop sizes on different sides (top: 20px, left: 100px, right: 20px, bottom: 0px)
   - onMouseEnter configured with `once: true` to demonstrate single triggering

3. **Link with Uniform Slop**:
   - 30px slop on all sides using the number shorthand
   - Basic event handlers

## Debug Mode

The debug overlay can be toggled on/off using the button at the top of the page. When enabled, it shows:

- The extended hover area around each element
- Color indicators for hover state (red = not hovered, green = hovered)
- Dimension labels showing the size of the slop area on each side

## Event Logging

The event log at the bottom of the page displays the most recent events (up to 10) triggered by the hover slop behavior, including:

- Timestamp
- Event type
- Element that triggered the event