export interface WindowData{
    id: string
    panes: string[]
    topLeft: Point
    botRight: Point
}


type Point = {
    x: number,
    y: number
}