Description
Appointment System is a Java-based application designed to manage appointments for various services, such as healthcare or business meetings. 
Users can schedule, modify, and cancel appointments through a simple console-based interface. 
The system is designed with object-oriented programming principles and handles user authentication, appointment scheduling, and data persistence using file storage.

Features
.User registration and login: Users can create accounts and log in to manage their appointments.
.Appointment scheduling: Users can view available time slots and book appointments.
.Modify or cancel appointments: Allows users to update or cancel existing appointments.
.Data persistence: Appointment and user data are saved to files to retain information between sessions.
.Role-based access: Different access levels for users and administrators (e.g., users can book appointments, and admins can manage the schedule).

Technologies Used
.Java: The core programming language for the application logic.
.File handling: Used for storing user and appointment information.

Installation
1.Clone the repository:
git clone https://github.com/CuneytBaskurt/Appointment-System.git
2.Navigate to the project directory:
cd Appointment-System
3.Compile and run the project using the following commands:
javac Main.java
java Main

Usage
.Register or log in: New users can register an account, while existing users can log in to manage their appointments.
.View available appointments: After logging in, users can browse available time slots for appointments.
.Book an appointment: Select a time slot and confirm the appointment.
.Modify or cancel: Users can update the time or service of an appointment or cancel it if needed.
.Admin features: Administrators can manage the appointment schedule, add or remove available time slots, and view all bookings.
