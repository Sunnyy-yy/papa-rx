# Prescription Management App

This app is designed to help manage patient prescriptions. It allows for the generation of printable prescriptions with patient details, medicine lists, and schedules.

## Features:
- **Prescription Generation**: Generate a printable prescription with patient details, including name, age, weight, and vital statistics like B.P. and pulse.
- **Medicine List**: Dynamically fetch and manage a list of medicines. Medicines can be added to a text file and retrieved for use in prescriptions.
- **Dynamic Scheduling**: Include medicine schedules (morning, afternoon, evening) and quantities in the prescription.
- **Responsive**: The app is built with a simple and responsive UI for easy use.

## Technologies Used:
- **Next.js**: Framework used for building the app.
- **React**: For creating interactive components.
- **MongoDB (optional)**: For storing medicine lists (if needed, can be swapped with local file storage).
- **JavaScript**: The main programming language used for logic and UI components.

## Key Files:
- **`/pages/api/medicine.ts`**: API to manage the medicine list, supporting GET and POST methods.
- **`/data/medicines.txt`**: Local storage file for storing medicine names.
- **Prescription Generation**: Using HTML and inline CSS for styling, a prescription is generated with dynamic patient and medicine details.

## How to Use:
1. Run the app using `npm run dev` or `yarn dev`.
2. Use the `/api/medicine` route to get or add medicines to the list.
3. Generate a prescription by selecting a patient and adding the necessary medicines.

## Setup:
1. Ensure you have `Node.js` installed.
2. Clone the repository and navigate to the project folder.
3. Install dependencies:
   ```bash
   npm install
