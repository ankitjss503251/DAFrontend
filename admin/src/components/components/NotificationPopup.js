import React from 'react'

function NotificationPopup(props) {
  return (
    <div>
      {/* <!-- Button trigger modal --> */}
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        {/* <!-- Modal --> */}
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header ">
                        <h5 class="modal-title text-center" id="exampleModalLabel">{ props.notificationpopup.tlt }</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>{props.notificationpopup.msg}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NotificationPopup
