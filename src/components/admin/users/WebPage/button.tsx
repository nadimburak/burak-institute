import { Button } from "@mui/material"

const Buttons = (props:unknown) => {
    const style= {"backgroundColor":props.backgroundColor,
        "border":props.border,
        "border-radius":props.borderRadius,
        "padding":props.padding,
        "margin":props.margin,
        "color":props.color,
        "font-size:":props.fontSize,

    }
  return (
    <div>
      <Button style={style}>{props.text}</Button>
    </div>
  )
}

export default Buttons
