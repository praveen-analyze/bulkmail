import axios from "axios"
import { useState } from "react"
import "./App.css"

function App() {

  const API_URL = import.meta.env.VITE_API_URL

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [emails, setEmails] = useState("")
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const sendMail = async (event) => {

    event.preventDefault()

    setStatus(null)

    if (!subject.trim() || !message.trim() || !emails.trim()) {

      setStatus({
        type: "error",
        text: "Please fill in all fields before sending."
      })

      return
    }

    const recipients = emails
      .split(",")
      .map(email => email.trim())
      .filter(Boolean)

    if (recipients.length === 0) {

      setStatus({
        type: "error",
        text: "Enter at least one valid recipient email."
      })

      return
    }

    try {

      setIsSending(true)

      const response = await axios.post(
        `${API_URL}/api/mail/send`,
        {
          subject,
          message,
          recipients
        }
      )

      setStatus({
        type: "success",
        text:
          response.data.message ||
          "Emails sent successfully."
      })

      setSubject("")
      setMessage("")
      setEmails("")

    } catch (error) {

      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Unable to send emails."
      })

    } finally {

      setIsSending(false)
    }
  }

  return (

    <div className="app-shell">

      <div className="app-card">

        <div className="app-header">

          <h1>Bulk Mail Sender</h1>

          <p>
            Send one message to many recipients with a single click.
          </p>

        </div>

        {
          status && (
            <div className={`toast ${status.type}`}>
              {status.text}
            </div>
          )
        }

        <form
          className="form-grid"
          onSubmit={sendMail}
        >

          <label>

            Subject

            <input
              value={subject}
              onChange={(e)=>
                setSubject(e.target.value)
              }
              placeholder="Enter your email subject"
            />

          </label>


          <label>

            Message

            <textarea
              rows={6}
              value={message}
              onChange={(e)=>
                setMessage(e.target.value)
              }
              placeholder="Write your message here"
            />

          </label>


          <label>

            Recipients

            <textarea
              rows={3}
              value={emails}
              onChange={(e)=>
                setEmails(e.target.value)
              }
              placeholder="email1@example.com, email2@example.com"
            />

            <span className="hint">
              Separate multiple email addresses with commas.
            </span>

          </label>


          <button
            className="submit-button"
            type="submit"
            disabled={isSending}
          >

            {
              isSending
                ? "Sending..."
                : "Send Emails"
            }

          </button>

        </form>

      </div>

    </div>
  )
}

export default App