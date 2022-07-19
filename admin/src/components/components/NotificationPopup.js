import React from 'react'

function NotificationPopup(props) {
  return (
    <div>
      {/* <!-- Button trigger modal --> */}
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header ">
                        <h5 className="modal-title text-center" id="exampleModalLabel">{ props.notificationpopup.tlt }</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <p>{props.notificationpopup.msg}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NotificationPopup
