import React from 'react'

export const Button = ({color, children, onClick, type, buttonClass}) => {
  return (
    <button type={type} onClick={onClick} style={{"background-color": color}} className={buttonClass}>{children}</button>
  )
}