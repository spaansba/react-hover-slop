/**
 * React Hover Slop - Type Definitions
 */

import { RefObject } from "react"

/**
 * Defines the extended area around an element
 * Can be a single number (applied to all sides) or an object with specific values per side
 */
export type HoverSlopBox =
  | {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  | number

/**
 * Event handlers that can be triggered by hover slop
 */
export type EventHandlers = {
  onMouseOver?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

/**
 * Configuration options for the useHoverSlop hook
 */
export type HoverSlopOptions = {
  /**
   * When true, displays visual debugging for the hover slop area
   */
  debugMode?: boolean

  /**
   * Options for controlling event behavior
   */
  eventOptions?: {
    onMouseEnter?: {
      /**
       * When true, onMouseEnter will only fire once
       */
      once?: boolean
    }
    onMouseLeave?: {
      /**
       * When true, onMouseLeave will only fire once
       */
      once?: boolean
    }
  }
}

/**
 * Return value from the useHoverSlop hook
 */
export type UseHoverSlopResult = {
  /**
   * Whether the cursor is currently within the extended hover area
   */
  isHovered: boolean
}

/**
 * Parameters for the useHoverSlop hook
 */
export type UseHoverSlopParams<T extends HTMLElement> = {
  /**
   * Reference to the target DOM element
   */
  elementRef: RefObject<T | null>

  /**
   * Definition of the extended hover area
   */
  hoverslopBox: HoverSlopBox

  /**
   * Event handlers to trigger on hover events
   */
  mouseEvents: EventHandlers

  /**
   * Additional configuration options
   */
  options?: HoverSlopOptions
}
