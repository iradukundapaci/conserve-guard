import { jsPDF } from "jspdf";

interface Schedule {
  task: string;
  group: { name: string };
  weekDay: string;
  dutyStart: string;
  dutyEnd: string;
}

interface ReportOptions {
  title?: string;
  subtitle?: string;
  filename?: string;
  pageSize?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

class PDFReportGenerator {
  private doc: jsPDF;
  private currentY: number;
  private pageHeight: number;
  private marginBottom: number = 20;
  private pageNumber: number = 1;

  private readonly defaultOptions: ReportOptions = {
    title: "Schedule Report",
    subtitle: `Generated on: ${new Date().toLocaleString()}`,
    filename: "schedule_report.pdf",
    pageSize: "a4",
    orientation: "portrait",
  };

  constructor(
    private schedules: Schedule[],
    private options: ReportOptions = {},
  ) {
    this.options = { ...this.defaultOptions, ...options };
    this.doc = new jsPDF({
      orientation: this.options.orientation,
      unit: "mm",
      format: this.options.pageSize,
    });
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = 0;

    // Set document metadata
    this.doc.setProperties({
      title: this.options.title,
      subject: this.options.subtitle,
      creator: "PDF Report Generator",
      author: "System Generated",
      keywords: "schedule, report, automated",
    });
  }

  private addPageNumber(): void {
    const pageWidth = this.doc.internal.pageSize.width;
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      `Page ${this.pageNumber}`,
      pageWidth / 2,
      this.pageHeight - 10,
      { align: "center" },
    );
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.marginBottom) {
      this.addPageNumber();
      this.doc.addPage();
      this.pageNumber++;
      this.currentY = 20;
      this.addTableHeader(); // Repeat header on new page
    }
  }

  private addTableHeader(): void {
    const headers = ["Task", "Group", "Day", "Start Time", "End Time"];
    const headerXPositions = [14, 50, 90, 120, 150];

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");

    headers.forEach((header, i) => {
      this.doc.text(header, headerXPositions[i], this.currentY);
    });

    // Add header underline
    this.doc.setDrawColor(100);
    this.doc.setLineWidth(0.5);
    this.doc.line(10, this.currentY + 2, 200, this.currentY + 2);

    this.currentY += 10;
  }

  private addTitle(): void {
    this.doc.setFontSize(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.options.title!, 105, 20, { align: "center" });

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(this.options.subtitle!, 105, 30, { align: "center" });

    this.currentY = 40;
  }

  private addContent(): void {
    const headerXPositions = [14, 50, 90, 120, 150];

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);

    this.schedules.forEach((schedule, index) => {
      this.checkPageBreak(8);

      // Add zebra striping for better readability
      if (index % 2 === 0) {
        this.doc.setFillColor(240, 240, 240);
        this.doc.rect(10, this.currentY - 4, 190, 8, "F");
      }

      const row = [
        schedule.task,
        schedule.group.name,
        schedule.weekDay,
        schedule.dutyStart,
        schedule.dutyEnd,
      ];

      row.forEach((value, i) => {
        // Truncate long text with ellipsis
        const maxWidth = 30;
        let text = value;
        if (this.doc.getTextWidth(text) > maxWidth) {
          while (this.doc.getTextWidth(text + "...") > maxWidth) {
            text = text.slice(0, -1);
          }
          text += "...";
        }
        this.doc.text(text, headerXPositions[i], this.currentY);
      });

      this.currentY += 8;
    });
  }

  private addFooter(): void {
    this.checkPageBreak(15);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "italic");
    this.doc.text("End of Report", 105, this.pageHeight - 15, {
      align: "center",
    });
    this.addPageNumber();
  }

  public generate(): void {
    try {
      this.addTitle();
      this.addTableHeader();
      this.addContent();
      this.addFooter();
      this.doc.save(this.options.filename);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      throw new Error("Failed to generate PDF report");
    }
  }
}

// Usage example:
const generatePDFReport = (
  schedules: Schedule[],
  options?: ReportOptions,
): void => {
  const generator = new PDFReportGenerator(schedules, options);
  generator.generate();
};

export { generatePDFReport, type Schedule, type ReportOptions };
