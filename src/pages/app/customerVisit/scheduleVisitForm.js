import '../../../styles/auth.styles.css';

const ScheduleCustomerVisit = () => {
  return (
    <form className="mt-5">
      <div className="mb-3">
        <label htmlFor="companyName" className="form-label">Company Name</label>
        <select className="form-select shadow-none" id="companyName" aria-label="Default select example">
          <option value="1">Company 1</option>
          <option value="2">Company 2</option>
          <option value="3">Company 3</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="contactPerson" className="form-label">Contact Person</label>
        <select className="form-select shadow-none" id="contactPerson" aria-label="Default select example">
          <option value="1">Contact Person 1</option>
          <option value="2">Contact Person 2</option>
          <option value="3">Contact Person 3</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="meetingDate" className="form-label">Meeting Date</label>
        <input type="date" className="form-control shadow-none" id="meetingDate" placeholder="Enter Meeting Date" />
      </div>

      <div className="mb-3">
        <label htmlFor="meetingPurpose" className="form-label">Meeting Purpose</label>
        <input type="text" className="form-control shadow-none" id="meetingPurpose" placeholder="Enter Meeting Purpose" />
      </div>

      <div className="mb-3">
        <label htmlFor="meetingVenue" className="form-label">Meeting Venue</label>
        <input type="text" className="form-control shadow-none" id="meetingVenue" placeholder="Enter Meeting Venue" />
      </div>
    </form>
  )
}

export default ScheduleCustomerVisit;