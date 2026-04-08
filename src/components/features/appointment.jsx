import { InlineWidget } from "react-calendly"

// Appointment component to embed Calendly scheduler
const Appointment = () => {
    return (
        <div className="text-center py-12">
            <InlineWidget styles={{ minWidth: '100%' }} url="" />
        </div>
    )
}
export default Appointment;