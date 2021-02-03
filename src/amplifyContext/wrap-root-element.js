import React from "react"
import awsmobile from "../aws-exports"
import Amplify from "aws-amplify"

export const wrapRootElement = ({ element }) => {
  Amplify.configure(awsmobile)
  return <div>{element}</div>
}
