

const ListItem = ({title, onClick, description, sideInfo, extraInfo, icon}) =>{
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={onClick}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className={`bi ${icon} text-white fs-5`}></i></span>
        <article>
          <span className='h6 fw-bold'>{title}</span> <br />
          <span>{description}</span>
        </article>
      </div>
      <div className='w-25 d-flex flex-column justify-content-center'>
        <span className='small'>{sideInfo}</span>
        <span className="text-success fw-bold">{extraInfo}</span>
      </div>
    </li>
  )
}

export default ListItem;