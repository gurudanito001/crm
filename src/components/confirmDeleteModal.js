const ConfirmDeleteModal = ({entity, onClick, isLoading=false}) => {

  return (
    <div className="modal fade" id="confirmDeleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete {entity}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body py-5">
            <h5>Are you sure you want to delete {entity}?</h5>
            <p>This action cannot be reversed.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-danger btn-sm ms-3 px-3" disabled={isLoading} data-bs-dismiss="modal" onClick={onClick}>Delete {entity}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal;

