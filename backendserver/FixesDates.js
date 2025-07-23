const mongoose = require("mongoose");
const Patients = require("./modal/patients");

mongoose
  .connect("mongodb+srv://sankaliya200310:hVceOULeEGTYdgeY@cluster1.6lmgz.mongodb.net/mypatients")
  .then(async () => {
    console.log("✅ Connected to DB");

    // 👇 Fetch and log all patients
    const allPatients = await Patients.find({}).sort({ patientId: 1 });
    console.log(`🧾 Total patients fetched: ${allPatients.length}`);
    
    allPatients.forEach(p => {
      console.log(`➡️ ID: ${p.patientId}, Name: ${p.name}, Date: ${p.date}`);
    });

    // 🧠 Your patientId → date mappings
    const ranges = [
      { from: 1, to: 100, date: "12/10/2024" },
      { from: 101, to: 200, date: "26/12/2024" },
      { from: 201, to: 208, date: "30/12/2024" },
      { from: 209, to: 236, date: "28/01/2025" },
      { from: 237, to: 275, date: "09/02/2025" },
      { from: 276, to: 300, date: "20/02/2025" },
      { from: 301, to: 350, date: "10/03/2025" },
      { from: 351, to: 400, date: "12/04/2025" },

     
      
    ];

    for (const patient of allPatients) {
      const id = patient.patientId;

      const mapping = ranges.find(
        (range) => id >= range.from && id <= range.to
      );

      if (mapping) {
        console.log(`🔄 Updating patientId: ${id} to date: ${mapping.date}`);
        await Patients.updateOne(
          { _id: patient._id },
          { $set: { date: mapping.date } }
        );
      } else {
        console.warn(`⚠️ Skipped: patientId ${id} not in any range`);
      }
    }

    console.log("✅ All matching dates updated.");
    process.exit();
  })
  .catch((err) => console.error("❌ DB Connection Error", err));
