// 1. Original Data Array
const originalStudents = [
  { name: "ali omer", age: 60, course: "wma" },
  { name: "omer", age: 20, course: "cco" },
  { name: "saqib", age: 40, course: "ccna" },
  { name: "baber", age: 10, course: "wma" },
  { name: "ali khan", age: 15, course: "cco" },
];

// 2. Data Filtering Logic
const filteredStudents = originalStudents.filter(
  (value) =>
    (value.age > 20 && value.name.toLowerCase().includes("ali")) ||
    value.course === "wma",
);

// 3. Render All Data & Filtered Data in UI
function renderUI() {
  const allTableBody = document.getElementById("allTableBody");
  const filteredTableBody = document.getElementById("filteredTableBody");

  document.getElementById("allCount").textContent =
    `${originalStudents.length} records`;
  document.getElementById("filteredCount").textContent =
    `${filteredStudents.length} records`;

  // Render Original Data Table
  allTableBody.innerHTML = originalStudents
    .map(
      (student, index) => `
    <tr class="hover:bg-gray-50/50">
      <td class="py-2.5 px-3 text-xs text-gray-400 font-medium">${index + 1}</td>
      <td class="py-2.5 px-3 font-medium text-gray-800 capitalize">${student.name}</td>
      <td class="py-2.5 px-3 text-gray-600">${student.age}</td>
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase">${student.course}</span></td>
    </tr>
  `,
    )
    .join("");

  // Render Filtered Data Table
  if (filteredStudents.length === 0) {
    filteredTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-gray-400 text-xs">No matching records found</td></tr>`;
  } else {
    filteredTableBody.innerHTML = filteredStudents
      .map(
        (student, index) => `
      <tr class="hover:bg-emerald-50/30">
        <td class="py-2.5 px-3 text-xs text-emerald-600 font-medium">${index + 1}</td>
        <td class="py-2.5 px-3 font-semibold text-gray-800 capitalize">${student.name}</td>
        <td class="py-2.5 px-3 text-gray-600">${student.age}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase">${student.course}</span></td>
      </tr>
    `,
      )
      .join("");
  }
}

// Initial UI load
renderUI();

// 4. Download Filtered PDF Handler
document.getElementById("downloadBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // --- Header Styling ---
  doc.setFillColor(15, 23, 42); // Dark Navy Blue Header Bar
  doc.rect(0, 0, 210, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("STUDENT FILTERED REPORT", 14, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 17);

  // Filter Rule Info
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Applied Filter Criteria:", 14, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("(Age > 20 && Name == 'ali') OR Course == 'wma'", 14, 42);

  // --- Table Headers & Data Format ---
  const tableHeaders = [["S.NO", "STUDENT NAME", "AGE", "COURSE NAME"]];

  const tableRows = filteredStudents.map((student, index) => [
    index + 1,
    student.name.toUpperCase(),
    student.age,
    student.course.toUpperCase(),
  ]);

  // --- PDF AutoTable Styling ---
  doc.autoTable({
    head: tableHeaders,
    body: tableRows,
    startY: 48,
    theme: "striped",
    headStyles: {
      fillColor: [220, 38, 38], // Red Accent Header
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      cellPadding: 3.5,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 40 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10,
      );
    },
  });

  // Download File
  doc.save("Filtered_Students_Report.pdf");
});
