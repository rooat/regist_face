import React, {Component} from 'react'

export default class Modal extends Component {  
  constructor(props){
    super(props)
  }
  closeModal=()=>{
    this.props.setStateModal(false)
  }
  render(){
    return this.props.isOpenMsg?(
      <div className="z-10 top-1/3 w-2/3 border-2 bg-orange-100 border-orange-100 h-1/4 left-1/6 absolute rounded-md ">
          <div className="h-4/5 items-center flex">
              <div className="flex-1">
              {this.props.msgContent}
              </div>
              </div>
          <div className="flex items-center bg-orange-400 text-sm h-1/5 textColor" onClick={this.closeModal}>
              <div className="flex-1">关闭</div>
          </div>
      </div>):("")
  }
    
  }
  