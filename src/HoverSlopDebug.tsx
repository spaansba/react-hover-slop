import { RefObject } from "react"

type HoverslopBox = {
  top: number
  right: number
  bottom: number
  left: number
}

type DebugCleanupFunction = () => void

export function HoverslopDebug<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  hoverslopBoxNormalized: () => HoverslopBox,
  isHovered: boolean,
  elementName: string
): DebugCleanupFunction {
  const element = elementRef.current
  if (!element) {
    return () => {}
  }

  let debugContainer = document.querySelector(
    `div[data-hover-slop-debug-container="true"]`
  ) as HTMLElement
  let shadowRoot: ShadowRoot
  let isNewContainer = false

  if (debugContainer) {
    shadowRoot = debugContainer.shadowRoot as ShadowRoot
  } else {
    debugContainer = document.createElement("div")
    debugContainer.setAttribute("data-hover-slop-debug-container", "true")
    document.body.appendChild(debugContainer)
    shadowRoot = debugContainer.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.textContent = ShadowRootStyles
    shadowRoot.appendChild(style)
    isNewContainer = true
  }

  const debugElement = document.createElement("div")
  debugElement.classList.add("debug-box")
  debugElement.id = elementName
  if (isHovered) {
    debugElement.classList.add("hovered")
  }
  shadowRoot.appendChild(debugElement)

  const debugLabel = document.createElement("div")
  debugLabel.classList.add("debug-label", "debug-label-name")
  debugLabel.textContent = elementName
  debugElement.appendChild(debugLabel)

  const createDimensionIndicator = (
    value: number,
    position: "top" | "right" | "bottom" | "left"
  ) => {
    if (value <= 0) return null

    const indicator = document.createElement("div")
    indicator.classList.add("debug-label", "debug-label-dimension", position)
    indicator.textContent = `${value}px`
    debugElement.appendChild(indicator)
    return indicator
  }

  const updateDebugElement = () => {
    const rect = element.getBoundingClientRect()
    const normalizedslopBox = hoverslopBoxNormalized()
    const existingIndicators = debugElement.querySelectorAll(".debug-label-dimension")
    existingIndicators.forEach((el) => el.remove())

    debugElement.style.left = `${rect.left - normalizedslopBox.left}px`
    debugElement.style.top = `${rect.top - normalizedslopBox.top}px`
    debugElement.style.width = `${rect.width + normalizedslopBox.left + normalizedslopBox.right}px`
    debugElement.style.height = `${
      rect.height + normalizedslopBox.top + normalizedslopBox.bottom
    }px`

    if (isHovered) {
      debugElement.classList.add("hovered")
    } else {
      debugElement.classList.remove("hovered")
    }

    createDimensionIndicator(normalizedslopBox.top, "top")
    createDimensionIndicator(normalizedslopBox.right, "right")
    createDimensionIndicator(normalizedslopBox.bottom, "bottom")
    createDimensionIndicator(normalizedslopBox.left, "left")

    const debugLabel = debugElement.querySelector(".debug-label-name") as HTMLElement
    if (debugLabel) {
      debugLabel.textContent = elementName
    }
  }

  updateDebugElement()

  const handleUpdate = () => {
    updateDebugElement()
  }

  window.addEventListener("scroll", handleUpdate, true)
  window.addEventListener("resize", handleUpdate)

  const observer = new MutationObserver(handleUpdate)
  observer.observe(element, { attributes: true, childList: true, subtree: true })

  return () => {
    if (debugElement && shadowRoot.contains(debugElement)) {
      shadowRoot.removeChild(debugElement)
    }

    if (
      isNewContainer &&
      debugContainer &&
      shadowRoot.querySelectorAll(".debug-box").length === 0
    ) {
      document.body.removeChild(debugContainer)
    }

    window.removeEventListener("scroll", handleUpdate, true)
    window.removeEventListener("resize", handleUpdate)
    observer.disconnect()
  }
}

const ShadowRootStyles = `
      .debug-box {
        position: fixed;
        pointer-events: none;
        transition: background-color 0.2s, border-color 0.2s;
      }
      .debug-box:is(.hovered) {
        background-color: rgba(0, 255, 0, 0.1);
        border: 1px solid green;
      }
      
      .debug-box:not(.hovered) {
        background-color: rgba(255, 0, 0, 0.1);
        border: 1px solid red;
      }
      .debug-label {
        position: absolute;
        color: white;
        font-family: monospace;
        white-space: nowrap;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }
      .debug-label-name {
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2px 6px;
        font-size: 12px;
      }
      .debug-label-dimension {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px 3px;
        font-size: 10px;
        border-radius: 2px;
      }
      .debug-box:hover .debug-label,
      .debug-box.hovered .debug-label {
        opacity: 1;
      }
      div[data-hover-slop-debug-container="true"]:has(.debug-box:hover) .debug-label {
        opacity: 1;
      }
      .debug-label-dimension.top {
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .debug-label-dimension.right {
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
      }
      .debug-label-dimension.bottom {
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
      }
      .debug-label-dimension.left {
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    `
