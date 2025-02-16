import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: [[Number]], // 2D array for ticket numbers
});

const TambolaTicket = mongoose.models.TambolaTicket || mongoose.model("TambolaTicket", TicketSchema);
export default TambolaTicket;
