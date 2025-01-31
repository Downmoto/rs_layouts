export interface WindowConfig {
    // styles the window, this is not intended to style window-content
    // establish window-content styling separately in content component
    style: WindowStyleConfig
}

export interface WindowStyleConfig {
    // controls border-radius style, number is passed as px value
    borderRadius: number

    // controls background-color of window, it reads the same arguments 
    backgroundColour: string
}

export const WindowDefaultConfig: WindowConfig = {
    style: {
        borderRadius: 20,
        backgroundColour: "gray"
    }
}