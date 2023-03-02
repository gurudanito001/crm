interface NotificationProps {
  heading?: string | null, paragraph?: string | null, btnText?: string | null, img: any | null,
  open: boolean, onClose: () => void 
}

const defaultProps : NotificationProps = {
  open: false,
  onClose: ()=>{},
  heading: "You have a new Email!", 
  paragraph: "A link to confirm your email has been sent to your email address.", 
  btnText : "Open Mail",
  img: null
}

const NotificationModal = (props: NotificationProps) =>{

  return(
    <div className="modalContainer" onClick={props.onClose}>
      <section className="card m-auto text-center p-4 py-5" style={{width: "350px"}} onClick={(e)=>e.stopPropagation()}>
        <header className="h5">{props.heading || defaultProps.heading}</header>
        <figure><img src={props.img || defaultProps.img} /></figure>
        <p>{props.paragraph || defaultProps.paragraph}</p>
        <button className="btn btnGreen d-inline-block mt-4" >{props.btnText || defaultProps.btnText}</button>
      </section>
    </div>
  )
}

export default NotificationModal;