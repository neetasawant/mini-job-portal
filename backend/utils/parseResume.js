const pdfParse = require("pdf-parse");

const parseResume = async (resumeUrl) => {
  try {
    const resumeBuffer = await fetch(resumeUrl).then((res) => res.arrayBuffer());
    const pdfData = await pdfParse(Buffer.from(resumeBuffer));

    const text = pdfData.text;
    const parsedData = {};

    // Extract name, email, phone, and skills using regex
    parsedData.name = text.match(/Name:\s*(.+)/i)?.[1] || "Unknown";
    parsedData.email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "Not found";
    parsedData.phone = text.match(/\+?\d{10,15}/)?.[0] || "Not found";
    
    // Example: Extracting skills (assuming they are listed under "Skills" section)
    const skillsMatch = text.match(/Skills:\s*(.+)/i);
    parsedData.skills = skillsMatch ? skillsMatch[1].split(",").map((s) => s.trim()) : [];

    return parsedData;
  } catch (error) {
    console.error("Error parsing resume:", error);
    return null;
  }
};

module.exports = parseResume;
